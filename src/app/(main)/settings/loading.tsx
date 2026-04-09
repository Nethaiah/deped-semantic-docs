import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="space-y-8 p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="w-28 h-8 rounded" />
        <Skeleton className="w-80 h-5 rounded" />
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <div>
          <Skeleton className="w-20 h-5 mb-1 rounded" />
          <Skeleton className="w-72 h-4 rounded" />
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-gray-200 space-y-6">
            {/* Setting Item 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="w-40 h-5 mb-1 rounded" />
                  <Skeleton className="w-48 h-4 rounded" />
                </div>
              </div>
              <Skeleton className="w-14 h-8 rounded" />
            </div>

            {/* Setting Item 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="w-24 h-5 mb-1 rounded" />
                  <Skeleton className="w-40 h-4 rounded" />
                </div>
              </div>
              <Skeleton className="w-16 h-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
