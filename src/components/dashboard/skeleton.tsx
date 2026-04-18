"use client";

import { useTheme } from "@/components/theme-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeroSkeleton() {
  const { role, theme } = useTheme();
  const isAdmin = role === "admin";

  return (
    <div
      className="relative min-h-[350px] overflow-hidden rounded-[2rem] border border-white/5 p-6 shadow-xl sm:p-10"
      style={{ backgroundColor: theme.primary }}
    >
      <div
        className={`pointer-events-none absolute -bottom-[400px] -right-[200px] h-[800px] w-[800px] rounded-full blur-[140px] ${
          isAdmin ? "bg-white/18" : "bg-amber-500/20"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-[200px] -right-[100px] h-[450px] w-[450px] rounded-full blur-[100px] ${
          isAdmin ? "bg-white/20" : "bg-[#D4A373]/30"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-[80px] -right-[50px] h-[250px] w-[250px] rounded-full blur-[80px] ${
          isAdmin ? "bg-white/16" : "bg-amber-400/20"
        }`}
      />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -top-48 -right-48 h-[550px] w-[550px] rounded-full bg-white/5" />

      <div className="relative z-10 flex animate-pulse flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/10" />
              <div className="h-4 w-24 rounded bg-white/10" />
            </div>
            <div className="space-y-3">
              <div className="h-10 w-64 rounded-lg bg-white/10 sm:w-96" />
              <div className="h-4 w-48 rounded-lg bg-white/10 sm:w-72" />
            </div>
          </div>
          <div className="flex flex-col gap-3 self-end md:-mt-20 md:self-auto">
            <div className="h-8 w-32 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="h-28 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="gap-0 border p-0 shadow-sm">
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

export function ThesesTableSkeleton() {
  return (
    <div className="col-span-2 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-4 lg:px-6">
        <Skeleton className="h-7 w-24 rounded" />
        <Skeleton className="h-9 w-24 rounded" />
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr] border-b bg-muted/40 px-4 py-3">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-1 items-center gap-2 border-b px-4 py-4 last:border-0 md:grid-cols-[80px_1fr_1fr_1fr] md:gap-0"
        >
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-full max-w-[280px] rounded" />
          <Skeleton className="hidden h-4 w-32 rounded md:block" />
          <Skeleton className="hidden h-4 w-28 rounded md:block" />
        </div>
      ))}

      <div className="flex justify-center gap-2 border-t bg-muted/30 px-4 py-4 lg:px-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded" />
        ))}
      </div>
    </div>
  );
}

export function MonthlyActivitySkeleton() {
  return (
    <Card className="gap-0 border p-0 shadow-sm">
      <CardContent className="min-h-[340px] p-4">
        <Skeleton className="mb-1 h-5 w-36 rounded" />
        <Skeleton className="mb-6 h-4 w-56 rounded" />
        <div className="flex h-[230px] items-end justify-between gap-3 px-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
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

export function RecentlyViewedSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden border p-0 shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5">
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
              <div className="flex items-start gap-3 px-5 py-4">
                <Skeleton className="mt-0.5 h-5 w-10 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="mt-1 flex gap-3">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded" />
              </div>
              {i < 2 && <Separator />}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
