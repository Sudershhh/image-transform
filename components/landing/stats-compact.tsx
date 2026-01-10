"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { HardDrive } from "lucide-react";

interface StatsData {
  estimatedStorageMB: number;
  chartData: Array<{ date: string; count: number }>;
}

const chartConfig = {
  images: {
    label: "Images",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StatsCompact() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats({
          estimatedStorageMB: data.estimatedStorageMB,
          chartData: data.chartData,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData =
    stats?.chartData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      images: item.count,
      fullDate: item.date,
    })) || [];

  const CustomTooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    const fullDate = data.payload?.fullDate;

    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-foreground mb-1.5">
          {fullDate
            ? new Date(fullDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : data.payload?.date}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-xs text-muted-foreground">Images</span>
          <span className="text-xs font-medium text-foreground ml-auto">
            {data.value}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Storage Card */}
      <Card className="border shadow-sm">
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage
            </CardTitle>
            <div className="p-1.5 rounded-lg bg-primary/10">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {loading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded mx-auto" />
          ) : (
            <div className="text-5xl sm:text-5xl font-bold tracking-tight text-primary text-center">
              {stats?.estimatedStorageMB.toLocaleString() || "0"}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            MB used
          </p>
        </CardContent>
      </Card>

      {/* Bar Chart Card */}
      <Card className="border shadow-sm">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {loading ? (
            <div className="h-16 w-full bg-muted animate-pulse rounded" />
          ) : (
            <>
              <ChartContainer config={chartConfig} className="h-16 w-full mb-2">
                <BarChart
                  data={chartData}
                  margin={{ left: 0, right: 0, top: 0, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip content={<CustomTooltipContent />} />
                  <Bar
                    dataKey="images"
                    fill="var(--color-images)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
              <p className="text-sm text-muted-foreground mt-1.5">
                Last 7 days
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
