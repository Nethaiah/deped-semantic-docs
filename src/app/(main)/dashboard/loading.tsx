import {
  StatsCardsSkeleton,
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
} from "@/components/dashboard/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="relative rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-7 sm:px-8 sm:py-9">
          <div className="space-y-1 w-full sm:w-[70%]">
            <Skeleton className="w-40 h-4 mb-2 rounded" />
            <Skeleton className="w-80 h-8 mb-2 rounded" />
            <Skeleton className="w-96 h-5 rounded" />
          </div>
          <div className="text-left sm:text-right w-full sm:w-[30%] flex-shrink-0">
            <Skeleton className="w-40 h-8 mb-1 rounded sm:ml-auto" />
            <Skeleton className="w-48 h-5 rounded sm:ml-auto" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <StatsCardsSkeleton />

      {/* Main Content Grid: Theses Table + Sidebar */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Theses Table */}
        <div className="w-full xl:flex-1 min-w-0">
          <ThesesTableSkeleton />
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[350px] 2xl:w-[400px] flex-shrink-0 space-y-6">
          <MonthlyActivitySkeleton />
          <RecentlyViewedSkeleton />
        </div>
      </div>
    </div>
  );
}
