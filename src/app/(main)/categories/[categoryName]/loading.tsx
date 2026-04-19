import { Skeleton } from "@/components/ui/skeleton";
import {
  CategoryControlsSkeleton,
  CategoryResultsSkeleton,
} from "@/components/categories/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-full">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="mb-4">
          <Skeleton className="w-36 h-7 rounded" />
        </div>
        <Skeleton className="w-20 h-8 mb-1 rounded" />
        <Skeleton className="w-64 h-4 rounded" />
      </div>

      {/* Controls Skeleton */}
      <CategoryControlsSkeleton />

      {/* Results Skeleton */}
      <CategoryResultsSkeleton />
    </div>
  );
}
