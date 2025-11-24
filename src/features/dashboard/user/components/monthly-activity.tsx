"use client";

import { HighlightedBarChart } from "@/features/dashboard/user/components/highlighted-bar-chart";
import { MonthlyActivityData } from "../../../shared/server/get-monthly-activity";

interface MonthlyActivityProps {
  data: MonthlyActivityData[];
}

export default function MonthlyActivity({ data }: MonthlyActivityProps) {
  const currentData = data.map(d => ({
    month: d.month,
    desktop: d.uploads,
    label: d.fullMonth
  }));

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 relative">
      <HighlightedBarChart
        data={currentData}
        title="Monthly Activity"
        description="New uploads and edits over the last 6 months."
        color="#278fb6"
      />
    </div>
  );
}
