"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, HardDrive, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, XAxis, RadialBar, RadialBarChart } from "recharts";
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
  storage: {
    label: "Storage",
    color: "hsl(var(--chart-2))",
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

  const chartData = stats.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    images: item.count,
    fullDate: item.date,
  }));

  const calculateGrowth = () => {
    if (chartData.length < 7) return null;
    const last3Days = chartData.slice(-3).reduce((sum, d) => sum + d.images, 0);
    const prev3Days = chartData.slice(-6, -3).reduce((sum, d) => sum + d.images, 0);
    if (prev3Days === 0) return null;
    const growth = ((last3Days - prev3Days) / prev3Days) * 100;
    return Math.round(growth);
  };

  const growthPercentage = calculateGrowth();

  const storageLimitMB = 10240;
  const storagePercentage = Math.min((stats.estimatedStorageMB / storageLimitMB) * 100, 100);

  const radialData = [
    {
      name: "Storage",
      value: storagePercentage,
      fill: "var(--color-storage)",
    },
  ];

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
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground/70">
                Total Images
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/20">
                <Image className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold tracking-tight text-primary">
                {stats.totalImages.toLocaleString()}
              </div>
              {growthPercentage !== null && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  growthPercentage >= 0 ? 'text-chart-1' : 'text-destructive'
                }`}>
                  {growthPercentage >= 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(growthPercentage)}%</span>
                </div>
              )}
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              All time generated
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-chart-2/10 to-chart-2/5 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground/70">
                Storage Used
              </CardTitle>
              <div className="p-2 rounded-lg bg-chart-2/20">
                <HardDrive className="h-4 w-4 text-chart-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-4xl font-bold tracking-tight text-chart-2 mb-1">
                  {stats.estimatedStorageMB.toLocaleString()}
                </div>
                <p className="text-xs text-foreground/60">MB used</p>
                <p className="text-xs text-foreground/50 mt-1">
                  {Math.round(storagePercentage)}% of limit
                </p>
              </div>
              <div className="w-20 h-20">
                <ChartContainer config={chartConfig}>
                  <RadialBarChart
                    data={radialData}
                    innerRadius={28}
                    outerRadius={40}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={4}
                      fill="var(--color-storage)"
                    />
                  </RadialBarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm bg-gradient-to-br from-chart-3/10 to-chart-3/5 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground/70">
                Recent Activity
              </CardTitle>
              <div className="p-2 rounded-lg bg-chart-3/20">
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-4xl font-bold tracking-tight text-chart-3">
                {stats.last7DaysCount}
              </div>
              <span className="text-xs text-foreground/50">images</span>
            </div>
            <p className="text-xs text-foreground/60 mb-4">Last 7 days</p>
            <ChartContainer config={chartConfig} className="h-20 w-full">
              <BarChart
                data={chartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 4,
                  bottom: 4,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-foreground/10" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tick={{ fontSize: 10, fill: "var(--foreground)" }}
                />
                <ChartTooltip
                  cursor={false}
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
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
