import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header — renders instantly from the page, this is just for initial load */}
      <div className="mb-6">
        <Skeleton className="w-32 h-8 rounded mb-1" />
        <Skeleton className="w-72 h-4 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="w-full h-96 rounded-xl" />
    </div>
  );
}
