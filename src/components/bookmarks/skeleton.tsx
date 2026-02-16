import { Skeleton } from "@/components/ui/skeleton";

/* ─────────── Controls Skeleton (search + sort) ─────────── */
export function BookmarkControlsSkeleton() {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="w-full lg:w-48 h-12 rounded-lg" />
      </div>
    </div>
  );
}

/* ─────────── Results Skeleton (thesis list + pagination) ─────────── */
export function BookmarkResultsSkeleton() {
  return (
    <>
      {/* Results Count */}
      <Skeleton className="w-56 h-4 mb-4 rounded" />

      {/* Thesis Cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1">
                <Skeleton className="w-full max-w-[500px] h-6 mb-2 rounded" />
                <Skeleton className="w-3/4 max-w-[350px] h-6 mb-2 rounded" />
                <Skeleton className="w-48 h-4 mb-2 rounded" />
                <div className="flex gap-4 mb-3">
                  <Skeleton className="w-16 h-4 rounded" />
                  <Skeleton className="w-32 h-4 rounded" />
                  <Skeleton className="w-20 h-4 rounded" />
                </div>
                <Skeleton className="w-full h-4 mb-1 rounded" />
                <Skeleton className="w-5/6 h-4 mb-3 rounded" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="w-20 h-6 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="flex lg:flex-col gap-2">
                <Skeleton className="w-10 h-10 rounded" />
                <Skeleton className="w-10 h-10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-9 h-9 rounded" />
        ))}
      </div>
    </>
  );
}
