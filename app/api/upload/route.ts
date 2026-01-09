import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSessionId } from '@/lib/utils/session';
import { validateImageFile, getFileExtension } from '@/lib/utils/validation';
import { uploadToS3, getPresignedUrl } from '@/lib/s3';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { processError, formatErrorForDatabase, ErrorType } from '@/lib/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const sessionId = await getOrCreateSessionId();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExtension = getFileExtension(file.name);
    const imageId = uuidv4();
    const originalKey = `original/${imageId}.${fileExtension}`;

    await uploadToS3(buffer, originalKey, file.type);
    const originalUrl = await getPresignedUrl(originalKey);

    const imageRecord = await prisma.image.create({
      data: {
        id: imageId,
        sessionId,
        originalFilename: file.name,
        originalUrl,
        originalS3Key: originalKey,
        status: 'processing',
      },
    });

    // In production, you might want to use a queue system
    processImage(imageId, originalKey, originalUrl).catch(async (error) => {
      const processedError = processError(error);
      const userMessage = formatErrorForDatabase(processedError);

      try {
        await prisma.image.update({
          where: { id: imageId },
          data: {
            status: 'failed',
            errorMessage: userMessage,
          },
        });
      } catch (dbError) {
        // Silently fail if we can't update the error in database
      }
    });

    return NextResponse.json({
      imageId: imageRecord.id,
      status: imageRecord.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

async function processImage(imageId: string, originalKey: string, originalUrl: string) {
  let tempKey: string | null = null;

  try {
    const removeBgResponse = await fetch(originalUrl);
    if (!removeBgResponse.ok) {
      throw new Error(
        `Failed to fetch original image from storage. Status: ${removeBgResponse.status}`
      );
    }

    const imageBlob = await removeBgResponse.blob();
    const { removeBackground } = await import('@/lib/services/removeBg');
    let processedBuffer: Buffer;
    try {
      processedBuffer = Buffer.from(await removeBackground(imageBlob));
    } catch (error) {
      const processedError = processError(error);
      throw new Error(
        `Background removal failed: ${processedError.message}. ${processedError.technicalDetails || ''}`
      );
    }

    tempKey = `temp/${imageId}-no-bg.png`;
    const { uploadToS3, getPresignedUrl, deleteFromS3 } = await import('@/lib/s3');
    
    try {
      await uploadToS3(processedBuffer, tempKey, 'image/png');
    } catch (error) {
      throw new Error(`Failed to upload processed image to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const tempUrl = await getPresignedUrl(tempKey);
    const { flipImage } = await import('@/lib/services/pixelixe');
    let flippedArrayBuffer: ArrayBuffer;
    try {
      flippedArrayBuffer = await flipImage(tempUrl, true, false);
    } catch (error) {
      const processedError = processError(error);
      throw new Error(
        `Image flip failed: ${processedError.message}. ${processedError.technicalDetails || ''}`
      );
    }
    const flippedBuffer = Buffer.from(flippedArrayBuffer);

    const processedKey = `processed/${imageId}.png`;
    try {
      await uploadToS3(flippedBuffer, processedKey, 'image/png');
    } catch (error) {
      throw new Error(`Failed to upload final image to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    const processedUrl = await getPresignedUrl(processedKey);

    if (tempKey) {
      try {
        await deleteFromS3(tempKey);
      } catch (error) {
        // Non-critical cleanup failure
      }
    }

    await prisma.image.update({
      where: { id: imageId },
      data: {
        processedUrl,
        processedS3Key: processedKey,
        status: 'completed',
      },
    });
  } catch (error) {
    if (tempKey) {
      try {
        const { deleteFromS3 } = await import('@/lib/s3');
        await deleteFromS3(tempKey);
      } catch (cleanupError) {
        // Non-critical cleanup failure
      }
    }

    const processedError = processError(error);
    const userMessage = formatErrorForDatabase(processedError);

    try {
      await prisma.image.update({
        where: { id: imageId },
        data: {
          status: 'failed',
          errorMessage: userMessage,
        },
      });
    } catch (dbError) {
      // Silently fail if we can't update the error in database
    }

    throw error;
  }
}
