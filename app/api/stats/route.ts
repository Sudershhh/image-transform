import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getObjectSize } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    const totalImages = await prisma.image.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentImages = await prisma.image.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const chartData: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      chartData[dateKey] = 0;
    }

    recentImages.forEach((image) => {
      const dateKey = new Date(image.createdAt).toISOString().split('T')[0];
      if (chartData[dateKey] !== undefined) {
        chartData[dateKey]++;
      }
    });

    const chartDataArray = Object.entries(chartData).map(([date, count]) => ({
      date,
      count,
    }));

    const last7DaysCount = recentImages.length;

    const allImages = await prisma.image.findMany({
      select: {
        originalS3Key: true,
        processedS3Key: true,
      },
    });

    let totalStorageBytes = 0;
    
    const batchSize = 10;
    for (let i = 0; i < allImages.length; i += batchSize) {
      const batch = allImages.slice(i, i + batchSize);
      const sizePromises = batch.flatMap((image) => {
        const promises: Promise<number>[] = [];
        
        if (image.originalS3Key) {
          promises.push(getObjectSize(image.originalS3Key));
        }
        
        if (image.processedS3Key) {
          promises.push(getObjectSize(image.processedS3Key));
        }
        
        return promises;
      });
      
      const sizes = await Promise.all(sizePromises);
      totalStorageBytes += sizes.reduce((sum, size) => sum + size, 0);
    }

    const estimatedStorageMB = Math.round(totalStorageBytes / (1024 * 1024));
    const estimatedStorageGB = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);

    return NextResponse.json({
      totalImages,
      last7DaysCount,
      estimatedStorageMB,
      estimatedStorageGB,
      chartData: chartDataArray,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
