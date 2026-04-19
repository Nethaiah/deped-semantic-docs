import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Page Header Skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-52 rounded" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <Skeleton className="h-3 w-16 mb-2 rounded" />
            <Skeleton className="h-8 w-10 rounded" />
          </div>
        ))}
      </div>

      {/* Status Tabs Skeleton */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Toolbar Skeleton: Search + Column button */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-full max-w-sm rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md ml-auto" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-28 rounded hidden sm:block" />
          <Skeleton className="h-4 w-16 rounded hidden md:block" />
          <Skeleton className="h-4 w-16 rounded hidden md:block" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`px-4 py-3 flex items-center gap-4 border-b border-gray-100 last:border-0 ${
              i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            }`}
          >
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <Skeleton className="h-4 w-20 rounded font-mono" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-4 w-28 rounded hidden sm:block" />
            <Skeleton className="h-7 w-24 rounded-md hidden md:block" />
            <Skeleton className="h-5 w-16 rounded-full hidden md:block" />
            <Skeleton className="h-7 w-7 rounded ml-auto shrink-0" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
        <Skeleton className="h-4 w-28 rounded" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
