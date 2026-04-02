import { Skeleton } from "@/components/ui/skeleton";

/* ─── Full View Thesis Skeleton (3-column grid layout) ─── */
export function ViewThesisSkeleton() {
  return (
    <div className="p-5 lg:p-8 w-full">
      {/* Back Button */}
      <div className="mb-4">
        <Skeleton className="w-20 h-7 rounded-sm" />
      </div>

      <div className="grid grid-cols-13 gap-8">
        {/* Sidebar — Thesis Info + Actions */}
        <div className="col-span-13 lg:col-span-3">
          {/* Title */}
          <Skeleton className="w-full h-6 mb-2 rounded" />
          <Skeleton className="w-3/4 h-6 mb-4 rounded" />

          {/* Authors */}
          <div className="flex items-start gap-3 mt-3">
            <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="w-16 h-4 mb-1 rounded" />
              <Skeleton className="w-40 h-4 rounded" />
            </div>
          </div>

          {/* Metadata rows */}
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-32 h-4 rounded" />
              </div>
            ))}
          </div>

          {/* Keywords */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <Skeleton className="w-16 h-3 mb-2 rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-6 rounded-full" />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>

        {/* Main Content — Abstract & Q&A */}
        <div className="col-span-13 lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="w-24 h-9 rounded-md" />
              <Skeleton className="w-24 h-9 rounded-md" />
            </div>
            {/* Abstract content */}
            <div className="space-y-2">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-5/6 h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-4/5 h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-2/3 h-4 rounded" />
            </div>

            {/* Q&A Section */}
            <div className="mt-6 pt-4 border-t">
              <Skeleton className="w-48 h-5 mb-3 rounded" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Sidebar — PDF Viewer + Similar Theses */}
        <div className="col-span-13 lg:col-span-4 space-y-6">
          {/* PDF Viewer */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between">
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
            <Skeleton className="w-full h-[400px]" />
          </div>

          {/* Similar Theses */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Skeleton className="w-32 h-5 mb-3 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-md">
                  <Skeleton className="w-full h-4 mb-1 rounded" />
                  <Skeleton className="w-3/4 h-4 mb-2 rounded" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-24 h-3 rounded" />
                    <Skeleton className="w-12 h-3 rounded" />
                  </div>
                  <Skeleton className="w-20 h-4 mt-2 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
