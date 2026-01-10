import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/lib/utils/session';
import prisma from '@/lib/prisma';
import { getPresignedUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ images: [] });
    }

    const images = await prisma.image.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    // Regenerate presigned URLs for all images to prevent expiration
    const imagesWithFreshUrls = await Promise.all(
      images.map(async (image) => {
        const freshUrls: { originalUrl?: string; processedUrl?: string | null } = {};

        // Regenerate original URL
        try {
          freshUrls.originalUrl = await getPresignedUrl(image.originalS3Key, 604800); // 7 days
        } catch (error) {
          console.error(`Error generating presigned URL for original ${image.id}:`, error);
          // Fallback to stored URL if generation fails
          freshUrls.originalUrl = image.originalUrl;
        }

        // Regenerate processed URL if it exists
        if (image.processedS3Key) {
          try {
            freshUrls.processedUrl = await getPresignedUrl(image.processedS3Key, 604800); // 7 days
          } catch (error) {
            console.error(`Error generating presigned URL for processed ${image.id}:`, error);
            // Fallback to stored URL if generation fails
            freshUrls.processedUrl = image.processedUrl ?? null;
          }
        }

        return {
          ...image,
          ...freshUrls,
        };
      })
    );

    return NextResponse.json({ images: imagesWithFreshUrls });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
