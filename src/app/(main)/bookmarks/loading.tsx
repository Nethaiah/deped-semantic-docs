import { Skeleton } from "@/components/ui/skeleton";
import {
  BookmarkControlsSkeleton,
  BookmarkResultsSkeleton,
} from "@/components/bookmarks/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="w-56 h-8 mb-2 rounded" />
        <Skeleton className="w-72 h-4 rounded" />
      </div>

      {/* Controls Skeleton */}
      <BookmarkControlsSkeleton />

      {/* Results Skeleton */}
      <BookmarkResultsSkeleton />
    </div>
  );
}
