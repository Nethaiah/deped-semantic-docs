"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant, getDynamicBadgeClasses } from "@/features/shared/lib/badge-variants";
import { Clock, ArrowRight, History } from "lucide-react";

type RecentlyViewedDoc = {
  id: string;
  code: string;
  title: string;
  tags: string[];
  viewedAt: string;
  dateIssued?: string | null;
  issuer?: string | null;
};

type Props = {
  documents: RecentlyViewedDoc[];
};

export default function RecentlyViewed({ documents }: Props) {
  const router = useRouter();

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Recently Viewed
        </h2>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No recently viewed documents yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Start exploring documents to see your history here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Recently Viewed
      </h2>
      <div className="space-y-3">
        {documents.map((item) => {
          const firstTag = item.tags?.[0];
          const variant = firstTag ? getBadgeVariant(firstTag) : null;
          
          return (
            <div
              key={item.id}
              onClick={() => router.push(`/view/${item.id}`)}
              className="group relative bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-[#278fb6] text-sm">
                      {item.code}
                    </p>
                    {firstTag && variant && (
                      <Badge
                        size="sm"
                        {...(variant === "dynamic"
                          ? { className: getDynamicBadgeClasses(firstTag) }
                          : { variant })}
                      >
                        {firstTag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.viewedAt)}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#278fb6] group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
    day: "numeric" 
  });
}