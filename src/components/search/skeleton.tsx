import { Skeleton } from "@/components/ui/skeleton";

/* ─── Search Results Skeleton (shown while RAG API is fetching) ─── */
export function SearchResultsSkeleton({ showAnswer = true }: { showAnswer?: boolean }) {
  return (
    <>
      {/* AI Answer Skeleton */}
      {showAnswer && (
        <div className="mb-6 p-6 bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-20 h-6 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-5/6 h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-2/3 h-4 rounded" />
          </div>
        </div>
      )}

      {/* Results Count Skeleton */}
      <Skeleton className="w-56 h-4 mb-4 rounded" />

      {/* Thesis Card Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 md:p-6"
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
    </>
  );
}
