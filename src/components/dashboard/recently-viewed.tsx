"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/lib/badge-variants";
import { Clock, ArrowRight, History, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentlyViewedThesis } from "@/server/theses/get-recently-viewed";

type Props = {
  theses: RecentlyViewedThesis[];
  accentColor?: string;
};

export default function RecentlyViewed({ theses, accentColor = "var(--theme-color)" }: Props) {
  const router = useRouter();

  // Format authors for display
  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return "Unknown";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(" & ");
    return `${authors[0]} et al.`;
  };

  if (theses.length === 0) {
    return (
      <Card className="bg-white rounded-lg shadow-md flex flex-col gap-0 border-slate-200 p-0 overflow-hidden">
        <CardHeader className="p-4 border-b border-transparent bg-slate-50/50 mb-0">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2 m-0">
            <History className="w-5 h-5" />
            Recently Viewed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              No recently viewed theses yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Start exploring theses to see your history here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md border border-slate-200 p-0 flex flex-col gap-0 overflow-hidden h-[420px]">
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 mb-0 shrink-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2 m-0">
            <History className="w-5 h-5" />
            Recently Viewed
          </CardTitle>
          <p className="text-sm text-slate-500">
            Your recently explored document history.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4 overflow-y-auto min-h-0 flex-1">
        <div className="space-y-3">
        {theses.map((item) => {
          const firstKeyword = item.keywords?.[0];
          const variant = firstKeyword ? getBadgeVariant(firstKeyword) : null;

          return (
            <div
              key={item.thesisId}
              onClick={() => router.push(`/view/${item.thesisId}`)}
              className="group relative bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Title and Year */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: accentColor }}>
                      {item.year}
                    </p>
                    {firstKeyword && variant && (
                      <Badge
                        size="sm"
                        {...(variant === "dynamic"
                          ? { className: getDynamicBadgeClasses(firstKeyword) }
                          : { variant })}
                      >
                        {firstKeyword}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Thesis Title */}
                  <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                    {item.title}
                  </p>
                  
                  {/* Authors */}
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="truncate">{formatAuthors(item.authors)}</span>
                  </div>
                  
                  {/* Viewed Time */}
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.viewedAt)}</span>
                  </div>
                </div>
                <ArrowRight 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" 
                  style={{ color: accentColor }}
                />
              </div>
            </div>
          );
        })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Format a timestamp to a human-readable "time ago" string
 */
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
