"use client";

import { HighlightedLineChart } from "@/components/dashboard/highlighted-line-chart";
import { MonthlyActivityData } from "@/server/stats/get-monthly-activity";

interface MonthlyActivityProps {
  data: MonthlyActivityData[];
  accentColor?: string;
}

import { Card, CardContent } from "@/components/ui/card";

export default function MonthlyActivity({ data, accentColor = "var(--theme-color)" }: MonthlyActivityProps) {
  const currentData = data.map((d) => ({
    month: d.month,
    desktop: d.uploads,
    label: d.fullMonth,
  }));

  return (
    <Card className="bg-white rounded-lg shadow-md border border-slate-200 p-0 flex flex-col gap-0 overflow-hidden h-[420px]">
      <HighlightedLineChart
        data={currentData}
        title="Monthly Activity"
        description="New research papers added over the last 6 months."
        color={accentColor}
      />
    </Card>
  );
}

