"use client";

import React from "react";
import { BarChart as BarChartIcon } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CollegeInteractionData } from "@/server/stats/get-college-interactions";

export interface CollegeInteractionsProps {
  data: CollegeInteractionData[];
  accentColor?: string;
}

export default function CollegeInteractions({ 
  data, 
  accentColor = "var(--theme-color)" 
}: CollegeInteractionsProps) {
  
  const chartData = data.map((d) => ({
    name: d.college.length > 15 ? d.college.substring(0, 15) + "..." : d.college,
    fullName: d.college,
    interactions: d.interactions,
  }));

  return (
    <Card className="bg-white rounded-lg shadow-md border border-slate-200 p-0 flex flex-col gap-0 overflow-hidden h-[420px]">
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 mb-0 shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <BarChartIcon className="w-5 h-5 text-slate-500" />
          Top Colleges by Interactions
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Colleges with the most engaged research papers.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-6 flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
            No interactions data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
              <XAxis 
                type="number" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: "#334155", fontSize: 13, fontWeight: 500 }}
                width={65}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-slate-200 shadow-lg p-3 rounded-lg flex flex-col gap-1 z-50">
                        <span className="text-sm font-bold text-slate-800">
                          {payload[0].payload.fullName}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
                          <span className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{payload[0].value}</span> interactions
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="interactions" 
                radius={[0, 4, 4, 0]}
                barSize={32}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={accentColor} fillOpacity={Math.max(0.4, 1 - (index * 0.15))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
