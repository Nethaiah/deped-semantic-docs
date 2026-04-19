"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export interface HighlightedLineChartProps {
  data: {
    month: string;
    desktop: number; // We'll map 'uploads' to 'desktop' or make this dynamic
    label?: string;
  }[];
  color?: string;
  title?: string;
  description?: string;
}

export function HighlightedLineChart({ 
  data, 
  color = "var(--chart-1)",
  title = "Line Chart",
  description
}: HighlightedLineChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const chartConfig = {
    desktop: {
      label: "Uploads",
      color: color,
    },
  } satisfies ChartConfig;

  const activeData = React.useMemo(() => {
    if (activeIndex === null) return null;
    return data[activeIndex];
  }, [activeIndex, data]);

  return (
    <Card className="border-none shadow-none h-full flex flex-col bg-transparent rounded-none">
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 mb-0 shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <TrendingUp className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          {activeData
            ? `${activeData.month}: ${activeData.desktop} uploads`
            : description || "Monthly activity"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, left: 12, right: 12, bottom: 24 }}
            onMouseMove={(e: any) => {
              if (e.activeTooltipIndex !== undefined) {
                setActiveIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              type="monotone"
              dataKey="desktop"
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDesktop)"
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="highlighted-pattern-dots"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  );
};
