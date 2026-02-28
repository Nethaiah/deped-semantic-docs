import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/* ─────────────── Colleges Grid Skeleton (for /categories) ─────────────── */
export function CollegesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="flex-row items-center gap-4 px-4 sm:px-6 py-4 rounded-2xl border-gray-100"
        >
          <CardContent className="flex items-center gap-4 p-0">
            <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="w-16 h-5 mb-1.5 rounded" />
              <Skeleton className="w-48 h-4 mb-1.5 rounded" />
              <Skeleton className="w-28 h-4 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─────────── Controls Skeleton (search bar + filter + sort) ─────────── */
export function CategoryControlsSkeleton() {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="w-24 h-12 rounded-lg" />
        <Skeleton className="w-full lg:w-48 h-12 rounded-lg" />
      </div>
    </div>
  );
}

/* ─────────── Results Skeleton (thesis list + pagination) ─────────── */
export function CategoryResultsSkeleton() {
  return (
    <>
      {/* Results Count */}
      <Skeleton className="w-56 h-4 mb-4 rounded" />

      {/* Thesis Cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-xl border-gray-200 p-4 sm:p-6"
          >
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <Skeleton className="w-full max-w-[500px] h-6 mb-2 rounded" />
                  <Skeleton className="w-3/4 max-w-[350px] h-6 mb-2 rounded" />
                  <Skeleton className="w-48 h-4 mb-2 rounded" />
                  <div className="flex gap-4 mb-3">
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-32 h-4 rounded" />
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
            </CardContent>
          </Card>
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
