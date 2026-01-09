"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ImageIcon } from "lucide-react"

interface StatsData {
  totalImages: number
  chartData: Array<{ date: string; count: number }>
}

const chartConfig = {
  images: {
    label: "Images Generated",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function StatsCompact() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats({
          totalImages: data.totalImages,
          chartData: data.chartData,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Format chart data for recharts
  const chartData = stats?.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    images: item.count,
    fullDate: item.date,
  })) || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Number of Images Processed */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Images Processed
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-4xl font-bold tracking-tight text-primary">
              {stats?.totalImages.toLocaleString() || "0"}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Total transformations
          </p>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-24 w-full bg-muted animate-pulse rounded" />
          ) : (
            <>
              <ChartContainer config={chartConfig} className="h-24 w-full mb-4">
                <BarChart
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value, payload) => {
                          const item = payload?.[0]?.payload
                          return item?.fullDate
                            ? new Date(item.fullDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : value
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
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
