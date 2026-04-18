import {
  DashboardHeroSkeleton,
  StatsCardsSkeleton,
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
} from "@/components/dashboard/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Skeleton */}
      <DashboardHeroSkeleton />

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
