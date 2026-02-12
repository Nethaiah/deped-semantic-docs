import { Skeleton } from "@/components/ui/skeleton";

/* ─────────────────────────── Stats Cards Skeleton ─────────────────────────── */
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative bg-white rounded-lg shadow-md border border-slate-200 p-6 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-16 h-5 rounded" />
            </div>
            <Skeleton className="w-24 h-4 mb-2 rounded" />
            <Skeleton className="w-20 h-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Theses Table Skeleton ─────────────────────────── */
export function ThesesTableSkeleton() {
  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-4 border-b border-slate-200 bg-slate-50">
        <Skeleton className="w-24 h-7 rounded" />
        <Skeleton className="w-24 h-9 rounded" />
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block">
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 grid grid-cols-[80px_1fr_1fr_1fr]">
          <Skeleton className="w-12 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-20 h-4 rounded" />
        </div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_1fr] gap-2 md:gap-0 items-center"
        >
          <Skeleton className="w-14 h-5 rounded" />
          <Skeleton className="w-full max-w-[280px] h-5 rounded" />
          <Skeleton className="w-32 h-4 rounded hidden md:block" />
          <Skeleton className="w-28 h-4 rounded hidden md:block" />
        </div>
      ))}

      {/* Pagination */}
      <div className="px-4 lg:px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-9 h-9 rounded" />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── Monthly Activity Skeleton ────────────────────── */
export function MonthlyActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 relative min-h-[350px]">
      {/* Title */}
      <Skeleton className="w-36 h-5 mb-1 rounded" />
      <Skeleton className="w-56 h-4 mb-6 rounded" />

      {/* Chart bars */}
      <div className="flex items-end justify-between gap-3 h-[230px] px-4 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${40 + Math.random() * 140}px` }}
            />
            <Skeleton className="w-8 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── Recently Viewed Skeleton ────────────────────── */
export function RecentlyViewedSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="w-32 h-5 rounded" />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Year + Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="w-10 h-4 rounded" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
                {/* Title */}
                <Skeleton className="w-full h-4 mb-2 rounded" />
                <Skeleton className="w-3/4 h-4 mb-2 rounded" />
                {/* Authors */}
                <Skeleton className="w-28 h-3 mb-1 rounded" />
                {/* Time */}
                <Skeleton className="w-16 h-3 rounded" />
              </div>
              <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
