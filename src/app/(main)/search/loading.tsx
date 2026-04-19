import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="w-40 h-8 mb-2 rounded" />
        <Skeleton className="w-96 h-4 rounded" />
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <Skeleton className="flex-1 h-12 rounded-lg" />
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <Skeleton className="w-24 h-12 rounded-lg" />
            <Skeleton className="flex-1 lg:flex-none lg:w-24 h-12 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Initial State Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-12 flex flex-col items-center">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="w-48 h-6 mb-2 rounded" />
        <Skeleton className="w-80 h-4 mb-4 rounded" />
        <div className="space-y-2 w-60">
          <Skeleton className="w-40 h-4 mx-auto rounded" />
          <Skeleton className="w-56 h-4 rounded" />
          <Skeleton className="w-52 h-4 rounded" />
          <Skeleton className="w-48 h-4 rounded" />
        </div>
      </div>
    </div>
  );
}
