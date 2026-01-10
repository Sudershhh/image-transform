import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/lib/utils/session';
import prisma from '@/lib/prisma';
import { deleteFromS3, getPresignedUrl } from '@/lib/s3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const sessionId = await getSessionId();

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify session ownership
    if (image.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Regenerate presigned URLs to prevent expiration
    const freshUrls: { originalUrl?: string; processedUrl?: string } = {};

    // Regenerate original URL
    try {
      freshUrls.originalUrl = await getPresignedUrl(image.originalS3Key, 604800); // 7 days
    } catch (error) {
      console.error(`Error generating presigned URL for original ${imageId}:`, error);
      // Fallback to stored URL if generation fails
      freshUrls.originalUrl = image.originalUrl;
    }

    // Regenerate processed URL if it exists
    if (image.processedS3Key) {
      try {
        freshUrls.processedUrl = await getPresignedUrl(image.processedS3Key, 604800); // 7 days
      } catch (error) {
        console.error(`Error generating presigned URL for processed ${imageId}:`, error);
        // Fallback to stored URL if generation fails
        freshUrls.processedUrl = image.processedUrl || null;
      }
    }

    return NextResponse.json({
      ...image,
      ...freshUrls,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Verify session ownership
    if (image.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete from S3 using stored keys
    try {
      await deleteFromS3(image.originalS3Key);
      if (image.processedS3Key) {
        await deleteFromS3(image.processedS3Key);
      }
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      // Continue with DB deletion even if S3 deletion fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
