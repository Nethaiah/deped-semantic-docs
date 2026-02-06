"use client";

import { HighlightedBarChart } from "@/components/dashboard/highlighted-bar-chart";
import { MonthlyActivityData } from "@/server/stats/get-monthly-activity";

interface MonthlyActivityProps {
  data: MonthlyActivityData[];
  accentColor?: string;
}

export default function MonthlyActivity({ data, accentColor = "#278fb6" }: MonthlyActivityProps) {
  const currentData = data.map((d) => ({
    month: d.month,
    desktop: d.uploads,
    label: d.fullMonth,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 relative">
      <HighlightedBarChart
        data={currentData}
        title="Monthly Activity"
        description="New theses added over the last 6 months."
        color={accentColor}
      />
    </div>
  );
}

