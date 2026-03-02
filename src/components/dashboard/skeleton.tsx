import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ─────────────────────────── Stats Cards Skeleton ─────────────────────────── */
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border shadow-sm p-0 gap-0">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─────────────────────────── Theses Table Skeleton ─────────────────────────── */
export function ThesesTableSkeleton() {
  return (
    <div className="col-span-2 bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-4 border-b bg-muted/30">
        <Skeleton className="h-7 w-24 rounded" />
        <Skeleton className="h-9 w-24 rounded" />
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:block">
        <div className="bg-muted/40 border-b px-4 py-3 grid grid-cols-[80px_1fr_1fr_1fr]">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-4 border-b last:border-0 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_1fr] gap-2 md:gap-0 items-center"
        >
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-full max-w-[280px] rounded" />
          <Skeleton className="h-4 w-32 rounded hidden md:block" />
          <Skeleton className="h-4 w-28 rounded hidden md:block" />
        </div>
      ))}

      {/* Pagination */}
      <div className="px-4 lg:px-6 py-4 border-t bg-muted/30 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded" />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── Monthly Activity Skeleton ────────────────────── */
export function MonthlyActivitySkeleton() {
  return (
    <Card className="border shadow-sm p-0 gap-0">
      <CardContent className="p-4 min-h-[340px]">
        <Skeleton className="h-5 w-36 mb-1 rounded" />
        <Skeleton className="h-4 w-56 mb-6 rounded" />
        <div className="flex items-end justify-between gap-3 h-[230px] px-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <Skeleton
                className="w-full rounded-t"
                style={{ height: `${60 + (i * 25) % 130}px` }}
              />
              <Skeleton className="h-3 w-8 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────── Recently Viewed Skeleton ────────────────────── */
export function RecentlyViewedSkeleton() {
  return (
    <Card className="border shadow-sm overflow-hidden p-0 gap-0">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ul>
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <div className="px-5 py-4 flex items-start gap-3">
                <Skeleton className="h-5 w-10 rounded-md shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="flex gap-3 mt-1">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-4 rounded shrink-0 mt-1" />
              </div>
              {i < 2 && <Separator />}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
