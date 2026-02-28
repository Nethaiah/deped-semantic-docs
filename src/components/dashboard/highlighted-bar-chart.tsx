"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, Cell } from "recharts";
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

export interface HighlightedBarChartProps {
  data: {
    month: string;
    desktop: number; // We'll map 'uploads' to 'desktop' or make this dynamic
    label?: string;
  }[];
  color?: string;
  title?: string;
  description?: string;
}

export function HighlightedBarChart({ 
  data, 
  color = "var(--chart-1)",
  title = "Bar Chart",
  description
}: HighlightedBarChartProps) {
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
    <Card className="border-none shadow-none">
      <CardHeader className="p-0 mb-0 border-none">
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
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#highlighted-pattern-dots)"
            />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" radius={4} fill={color}>
              {data.map((_, index) => (
                <Cell
                  className="duration-200"
                  key={`cell-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? color : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
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
