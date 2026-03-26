"use client";

import { HighlightedBarChart } from "@/components/dashboard/highlighted-bar-chart";
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
    <Card className="bg-white rounded-lg shadow-md border border-slate-200 p-0 relative flex flex-col justify-center overflow-hidden">
      <CardContent className="p-4 pt-1 flex-1 min-h-[340px]">
        <HighlightedBarChart
          data={currentData}
          title="Monthly Activity"
          description="New theses added over the last 6 months."
          color={accentColor}
        />
      </CardContent>
    </Card>
  );
}

