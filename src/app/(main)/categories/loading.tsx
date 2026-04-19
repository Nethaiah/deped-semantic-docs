import { Skeleton } from "@/components/ui/skeleton";
import { CollegesGridSkeleton } from "@/components/categories/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-full">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="w-56 h-8 mb-2 rounded" />
        <Skeleton className="w-80 h-4 rounded" />
      </div>

      {/* Colleges Grid Skeleton */}
      <CollegesGridSkeleton />
    </div>
  );
}
