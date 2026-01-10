"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Compare } from "@/components/ui/compare";

interface StatsData {
  totalImages: number;
  last7DaysCount: number;
  estimatedStorageMB: number;
  estimatedStorageGB: string;
  chartData: Array<{ date: string; count: number }>;
}

const chartConfig = {
  images: {
    label: "Images",
    color: "hsl(var(--primary))",
  },
  storage: {
    label: "Storage",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FeaturesSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  if (!stats && !loading) return null;

  const chartData =
    stats?.chartData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      images: item.count,
      fullDate: item.date,
    })) || [];

  const storageLimitMB = 10240;
  const storagePercentage = stats
    ? Math.min((stats.estimatedStorageMB / storageLimitMB) * 100, 100)
    : 0;

  const radialData = [
    {
      name: "Storage",
      value: storagePercentage,
      fill: "var(--color-storage)",
    },
  ];

  const beforeImage = "/beer.jpg";
  const afterImage = "/processed-beer.jpg";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="features-section"
      ref={ref}
      className="relative min-h-screen py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Platform Statistics
              </h2>
              <p className="text-foreground/80 text-lg">
                Real-time insights into our image transformation platform
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-24 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold text-foreground mb-1">
                          7-Day Trend
                        </CardTitle>
                        <p className="text-xs text-foreground/60">
                          Weekly activity overview
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-chart-1">
                          {stats?.last7DaysCount || 0}
                        </div>
                        <span className="text-xs text-foreground/50">
                          images
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-56 w-full"
                    >
                      <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                          left: 12,
                          right: 12,
                          top: 12,
                          bottom: 12,
                        }}
                      >
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          className="stroke-foreground/10"
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 11, fill: "var(--foreground)" }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              indicator="dot"
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
                        <Area
                          dataKey="images"
                          type="linear"
                          fill="var(--chart-5)"
                          fillOpacity={0.5}
                          stroke="var(--chart-1)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      Storage Usage
                    </CardTitle>
                    <p className="text-xs text-foreground/60">
                      Platform storage consumption
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between gap-8">
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold text-chart-1">
                              {stats?.estimatedStorageGB || "0.00"}
                            </span>
                            <span className="text-sm font-medium text-foreground/60">
                              GB
                            </span>
                          </div>
                          <p className="text-sm text-foreground/50 mt-1">
                            of 10 GB used
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-chart-2 transition-all duration-500"
                              style={{ width: `${storagePercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-foreground/50">
                            <span>
                              {stats?.estimatedStorageMB.toLocaleString() || 0}{" "}
                              MB
                            </span>
                            <span>10,240 MB</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex-shrink-0">
                        <ChartContainer
                          config={chartConfig}
                          className="h-32 w-32"
                        >
                          <RadialBarChart
                            data={radialData}
                            innerRadius={45}
                            outerRadius={60}
                            startAngle={90}
                            endAngle={-270}
                            barSize={12}
                          >
                            <PolarAngleAxis
                              type="number"
                              domain={[0, 100]}
                              angleAxisId={0}
                              tick={false}
                            />
                            <RadialBar
                              background={{ fill: "hsl(var(--muted))" }}
                              dataKey="value"
                              cornerRadius={6}
                              fill="var(--chart-1)"
                            />
                          </RadialBarChart>
                        </ChartContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-xl font-bold text-foreground">
                              {Math.round(storagePercentage)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="sticky top-24">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  See It In Action
                </h2>
                <p className="text-foreground/80 text-lg">
                  Compare original and transformed images side by side
                </p>
              </div>
              <div className="relative w-full">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 blur-2xl opacity-40" />
                <div className="relative rounded-xl border bg-card p-2 shadow-xl">
                  <Compare
                    firstImage={beforeImage}
                    secondImage={afterImage}
                    slideMode="drag"
                    showHandlebar={true}
                    className="w-full aspect-[4/3] rounded-lg"
                    firstImageClassName="object-cover"
                    secondImageClassname="object-cover"
                  />
                  <div className="mt-3 flex justify-between px-2 pb-1 text-sm text-foreground/70">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-foreground/40" />
                      Original
                    </span>
                    <span className="flex items-center gap-2">
                      Transformed
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
