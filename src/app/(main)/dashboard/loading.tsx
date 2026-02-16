import {
  StatsCardsSkeleton,
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
} from "@/components/dashboard/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-5 lg:p-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 px-8 py-10 lg:py-15 mb-6 relative overflow-hidden">
        <div className="relative z-10 gap-5 lg:gap-0 flex-col lg:flex-row flex justify-between items-start">
          <div className="w-full lg:w-[70%]">
            <Skeleton className="w-80 h-9 mb-2 rounded" />
            <Skeleton className="w-96 h-5 rounded" />
          </div>
          <div className="text-right w-full lg:w-[30%]">
            <Skeleton className="w-40 h-8 mb-1 rounded ml-auto" />
            <Skeleton className="w-48 h-5 rounded ml-auto" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <StatsCardsSkeleton />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Theses Table Skeleton */}
        <ThesesTableSkeleton />

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity Skeleton */}
          <MonthlyActivitySkeleton />

          {/* Recently Viewed Skeleton */}
          <RecentlyViewedSkeleton />
        </div>
      </div>
    </div>
  );
}
