import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-6 lg:mb-8">
        <Skeleton className="w-56 lg:w-72 h-8 lg:h-9 mb-2 rounded" />
        <Skeleton className="w-full max-w-md h-4 rounded" />
      </div>

      {/* Form Section Skeleton */}
      <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm space-y-6">
        <div className="space-y-2">
           <Skeleton className="w-32 h-4 rounded" />
           <Skeleton className="w-full h-10 rounded" />
        </div>
        <div className="space-y-2">
           <Skeleton className="w-48 h-4 rounded" />
           <Skeleton className="w-full h-40 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
             <Skeleton className="w-24 h-4 rounded" />
             <Skeleton className="w-full h-10 rounded" />
          </div>
          <div className="space-y-2">
             <Skeleton className="w-28 h-4 rounded" />
             <Skeleton className="w-full h-10 rounded" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
           <Skeleton className="w-32 h-10 rounded" />
        </div>
      </div>
    </div>
  );
}
