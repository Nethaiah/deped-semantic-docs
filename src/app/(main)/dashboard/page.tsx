import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { thesesFilterParamsCache } from "@/lib/search-params";
import { getThemeForRole } from "@/lib/theme-config";
import { getCurrentUserRole } from "@/lib/dal";
import { Separator } from "@/components/ui/separator";

// Data fetchers
import { getStats } from "@/server/stats/get-stats";
import { getTheses } from "@/server/theses/get-theses";
import { getThesesFilterOptions } from "@/server/theses/get-filter-options";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";
import { getRecentlyViewed } from "@/server/theses/get-recently-viewed";

// Dashboard components
import ClientTimeDisplay from "@/components/shared/time";
import StatsCards from "@/components/dashboard/stats-card";
import ThesesTable from "@/components/dashboard/theses-table";
import MonthlyActivity from "@/components/dashboard/monthly-activity";
import RecentlyViewed from "@/components/dashboard/recently-viewed";

// Skeleton fallbacks
import {
  StatsCardsSkeleton,
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
} from "@/components/dashboard/skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};

/* ── Async data-fetching sections ── */

async function StatsSection({ accentColor }: { accentColor: string }) {
  const stats = await getStats();
  return <StatsCards stats={stats} accentColor={accentColor} />;
}

async function ThesesSection({
  page,
  filters,
  accentColor,
}: {
  page: number;
  filters: { yearFrom?: string; yearTo?: string; department?: string; college?: string; title?: string };
  accentColor: string;
}) {
  const [theses, filterOptions] = await Promise.all([
    getTheses(page, 10, {
      yearFrom: filters.yearFrom ? parseInt(filters.yearFrom) : undefined,
      yearTo: filters.yearTo ? parseInt(filters.yearTo) : undefined,
      department: filters.department || undefined,
      college: filters.college || undefined,
      title: filters.title || undefined,
    }),
    getThesesFilterOptions(),
  ]);

  return (
    <ThesesTable
      initialData={theses.data}
      initialTotalPages={theses?.totalPages}
      initialPage={page}
      initialFilters={{
        yearFrom: filters.yearFrom || "",
        yearTo: filters.yearTo || "",
        department: filters.department || "",
        college: filters.college || "",
        title: filters.title || "",
      }}
      filterOptions={filterOptions}
      accentColor={accentColor}
    />
  );
}

async function ActivitySection({ accentColor }: { accentColor: string }) {
  const data = await getMonthlyActivity();
  return <MonthlyActivity data={data} accentColor={accentColor} />;
}

async function RecentSection({ accentColor }: { accentColor: string }) {
  const data = await getRecentlyViewed(3);
  return <RecentlyViewed theses={data} accentColor={accentColor} />;
}

/* ── Page ── */

export default async function DocumentsPage({ searchParams }: Props) {
  const userRole = await getCurrentUserRole();
  if (!userRole) {
    redirect("/login");
  }

  const role = userRole.role;
  const displayName = userRole.fullName;
  const theme = getThemeForRole(role);
  const isAdmin = userRole.isAdmin;

  const { page, yearFrom, yearTo, department, college, title } =
    await thesesFilterParamsCache.parse(searchParams);

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Hero Header ── */}
      <div className="relative rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Decorative blob */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: theme.primary }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-7 sm:px-8 sm:py-9">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {isAdmin ? "Administrator" : "Researcher"} Portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Welcome back,{" "}
              <span style={{ color: theme.primary }}>{displayName}!</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Explore and discover theses from your institution.
            </p>
          </div>
          <div className="flex-shrink-0">
            <ClientTimeDisplay />
          </div>
        </div>
        <Separator />
      </div>

      {/* ── Stats Cards ── */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection accentColor={theme.primary} />
      </Suspense>

      {/* ── Main Grid: Theses Table + Sidebar ── */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Theses Table — takes flexible max space */}
        <div className="w-full xl:flex-1 min-w-0">
          <Suspense fallback={<ThesesTableSkeleton />}>
            <ThesesSection
              page={page}
              filters={{
                yearFrom: yearFrom || undefined,
                yearTo: yearTo || undefined,
                department: department || undefined,
                college: college || undefined,
                title: title || undefined,
              }}
              accentColor={theme.primary}
            />
          </Suspense>
        </div>

        {/* Right Column — fixed width on large screens */}
        <div className="w-full xl:w-[350px] 2xl:w-[400px] flex-shrink-0 space-y-6">
          <Suspense fallback={<MonthlyActivitySkeleton />}>
            <ActivitySection accentColor={theme.primary} />
          </Suspense>

          <Suspense fallback={<RecentlyViewedSkeleton />}>
            <RecentSection accentColor={theme.primary} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
