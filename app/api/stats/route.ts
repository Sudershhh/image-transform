import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get total images count
    const totalImages = await prisma.image.count();

    // Get images from last 7 days grouped by date
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

    // Group by date for chart data
    const chartData: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      chartData[dateKey] = 0;
    }

    // Count images per day
    recentImages.forEach((image) => {
      const dateKey = new Date(image.createdAt).toISOString().split('T')[0];
      if (chartData[dateKey] !== undefined) {
        chartData[dateKey]++;
      }
    });

    // Convert to array format for chart
    const chartDataArray = Object.entries(chartData).map(([date, count]) => ({
      date,
      count,
    }));

    // Calculate last 7 days count
    const last7DaysCount = recentImages.length;

    // Estimate storage (rough calculation: assume average 500KB per image)
    // This is a placeholder - in production you'd calculate actual S3 storage
    const estimatedStorageMB = Math.round((totalImages * 500) / 1024);
    const estimatedStorageGB = (estimatedStorageMB / 1024).toFixed(2);

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
