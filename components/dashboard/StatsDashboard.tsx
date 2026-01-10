"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, HardDrive, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface StatsData {
  totalImages: number;
  last7DaysCount: number;
  estimatedStorageMB: number;
  estimatedStorageGB: string;
  chartData: Array<{ date: string; count: number }>;
}

const chartConfig = {
  images: {
    label: "Images Generated",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // Format chart data for recharts
  const chartData = stats.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    images: item.count,
    fullDate: item.date,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Total Images Card */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Images
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/20">
                <Image className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-primary">
              {stats.totalImages.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time generated
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Storage Card */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-chart-2/10 to-chart-2/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Storage Used
              </CardTitle>
              <div className="p-2 rounded-lg bg-chart-2/20">
                <HardDrive className="h-4 w-4 text-chart-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-chart-2">
              {stats.estimatedStorageMB.toLocaleString()} MB
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated usage
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Card with Bar Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-chart-3/10 to-chart-3/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </CardTitle>
              <div className="p-2 rounded-lg bg-chart-3/20">
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight mb-3 text-chart-3">
              {stats.last7DaysCount}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Last 7 days</p>
            {/* Bar Chart */}
            <ChartContainer config={chartConfig} className="h-16 w-full">
              <BarChart
                data={chartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fontSize: 10 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value, payload) => {
                        const item = payload?.[0]?.payload;
                        return item?.fullDate
                          ? new Date(item.fullDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : value;
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="images"
                  fill="var(--color-images)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
