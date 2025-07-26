"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

type ChartDataItem = {
  browser: string
  visitors: number
  fill: string
}

const chartConfig = {
  visitors: { label: "Visitors" },
  employed: { label: "Employed", color: "var(--chart-1)" },
  "under-employed": { label: "Under-Employed", color: "var(--chart-4)" }, // 👈 Added this line
  unemployed: { label: "Unemployed", color: "var(--chart-2)" },
  "self-employed": { label: "Self-Employed", color: "var(--chart-3)" },
  unknown: { label: "Unknown", color: "var(--chart-5)" },
} satisfies ChartConfig


export function ChartPieLegend() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  useEffect(() => {
    axios.get("/alumni-chart").then((res) => {
      setChartData(res.data)
    })
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Alumni Employment Pie</CardTitle>
        <CardDescription>Data from database</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
  data={chartData}
  dataKey="visitors"
  nameKey="browser"
  label={({ percent }) => `${(percent * 100).toFixed(1)}%`} // 👈 ito ang naglalagay ng percentage
  isAnimationActive={false}
/>

            <ChartLegend
              content={
                <ChartLegendContent nameKey="browser" payload={chartData} />
              }
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
