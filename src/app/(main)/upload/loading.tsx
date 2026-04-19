import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header Skeleton */}
      <div className="mb-6 lg:mb-8">
        <Skeleton className="w-56 lg:w-72 h-8 lg:h-9 mb-2 rounded" />
        <Skeleton className="w-full max-w-md h-4 rounded" />
      </div>

      {/* Form Section Skeleton */}
      <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm space-y-6">
        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="w-24 h-10 rounded" />
          <Skeleton className="w-36 h-10 rounded" />
        </div>

        {/* Title & helper text skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-64 h-6 rounded" />
          <Skeleton className="w-full max-w-2xl h-4 rounded" />
        </div>

        {/* File upload UI skeleton */}
        <Skeleton className="w-full h-48 rounded border-dashed" />

        {/* Info box skeleton */}
        <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
          <Skeleton className="w-48 h-5 rounded" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <Skeleton className="w-64 h-4 rounded" />
          <Skeleton className="w-full sm:w-40 h-10 rounded" />
        </div>
      </div>
    </div>
  );
}
