import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { thesesFilterParamsCache } from "@/lib/search-params";
import { getThemeForRole } from "@/lib/theme-config";
import { getCurrentUserRole } from "@/lib/dal";

// Data fetchers
import { getStats } from "@/server/stats/get-stats";
import { getTheses } from "@/server/theses/get-theses";
import { getThesesFilterOptions } from "@/server/theses/get-filter-options";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";
import { getRecentlyViewed } from "@/server/theses/get-recently-viewed";
import { getCollegeInteractions } from "@/server/stats/get-college-interactions";

// Dashboard components
import ThesesTable from "@/components/dashboard/theses-table";
import MonthlyActivity from "@/components/dashboard/monthly-activity";
import RecentlyViewed from "@/components/dashboard/recently-viewed";
import CollegeInteractions from "@/components/dashboard/college-interactions";

// Skeleton fallbacks
import {
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
  CollegeInteractionsSkeleton,
} from "@/components/dashboard/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};

/* ── Async data-fetching sections ── */

async function DashboardName() {
  const userRole = await getCurrentUserRole();
  return userRole?.fullName || "Researcher";
}

async function DashboardDescription() {
  const userRole = await getCurrentUserRole();
  const isAdmin = userRole?.isAdmin || false;
  return isAdmin
    ? "system repository, including users and system metrics."
    : "research papers repository, including document metrics and recent uploads.";
}

async function DashboardPortalPill() {
  const userRole = await getCurrentUserRole();
  const isAdmin = userRole?.isAdmin || false;

  return (
    <div className="px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-sm">
      <span className="text-xs font-semibold text-white tracking-wide">
        {isAdmin ? "Admin Portal" : "Researcher Portal"}
      </span>
    </div>
  );
}

async function DashboardStatsBar() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden mt-4">
      <div className="px-6 py-6 flex flex-col items-center justify-center">
        <p className="text-[2rem] font-bold text-white mb-1 leading-none">
          {stats.totalTheses}
        </p>
        <p className="text-xs text-white/80 font-bold tracking-wide">
          Total Research Papers
        </p>
      </div>
      <div className="px-6 py-6 flex flex-col items-center justify-center">
        <p className="text-[2rem] font-bold text-white mb-1 leading-none">
          {stats.totalViews}
        </p>
        <p className="text-xs text-white/80 font-bold tracking-wide">
          Total Views
        </p>
      </div>
      <div className="px-6 py-6 flex flex-col items-center justify-center">
        <p className="text-[2rem] font-bold text-white mb-1 leading-none">
          {stats.recentUploads}
        </p>
        <p className="text-xs text-white/80 font-bold tracking-wide">
          Recent Uploads
        </p>
        <p className="text-[10px] text-white/50 font-bold tracking-widest mt-1 uppercase">
          {stats.currentMonth}
        </p>
      </div>
    </div>
  );
}

function DashboardStatsBarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden mt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-6 flex flex-col items-center justify-center gap-2"
        >
          <Skeleton className="h-10 w-20 bg-white/15" />
          <Skeleton className="h-3 w-24 bg-white/15" />
          {i === 2 && <Skeleton className="h-3 w-16 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

async function ThesesSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, yearFrom, yearTo, department, college, title } =
    await thesesFilterParamsCache.parse(searchParams);

  const userRole = await getCurrentUserRole();
  const theme = getThemeForRole(userRole?.role || "user");

  const [theses, filterOptions] = await Promise.all([
    getTheses(page, 10, {
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      department: department || undefined,
      college: college || undefined,
      title: title || undefined,
    }),
    getThesesFilterOptions(),
  ]);

  return (
    <ThesesTable
      initialData={theses.data}
      initialTotalPages={theses?.totalPages}
      initialPage={page}
      initialFilters={{
        yearFrom: yearFrom || "",
        yearTo: yearTo || "",
        department: department || "",
        college: college || "",
        title: title || "",
      }}
      filterOptions={filterOptions}
      accentColor={theme.primary}
    />
  );
}

// ... Activity and Recent Sections ...
async function ActivitySection() {
  const userRole = await getCurrentUserRole();
  const theme = getThemeForRole(userRole?.role || "user");
  const data = await getMonthlyActivity();
  return <MonthlyActivity data={data} accentColor={theme.primary} />;
}

async function RecentSection() {
  const userRole = await getCurrentUserRole();
  const theme = getThemeForRole(userRole?.role || "user");
  const data = await getRecentlyViewed(3);
  return <RecentlyViewed theses={data} accentColor={theme.primary} />;
}

async function CollegeInteractionsSection() {
  const userRole = await getCurrentUserRole();
  const theme = getThemeForRole(userRole?.role || "user");
  const data = await getCollegeInteractions(5);
  return <CollegeInteractions data={data} accentColor={theme.primary} />;
}

function DashboardHeader() {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/5 p-6 shadow-xl sm:p-10"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      <div className="pointer-events-none absolute -bottom-[400px] -right-[200px] h-[800px] w-[800px] rounded-full bg-white/18 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-[200px] -right-[100px] h-[450px] w-[450px] rounded-full bg-white/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-[80px] -right-[50px] h-[250px] w-[250px] rounded-full bg-white/16 blur-[80px]" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[550px] h-[550px] bg-white/5 rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                DASHBOARD
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight mb-3">
                Welcome back,{" "}
                <Suspense
                  fallback={
                    <span
                      aria-hidden="true"
                      className="inline-block h-10 w-56 align-middle rounded-md bg-white/15 animate-pulse"
                    />
                  }
                >
                  <DashboardName />
                </Suspense>
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-xl">
                A refined view of your institution&apos;s{" "}
                <Suspense
                  fallback={
                    <span
                      aria-hidden="true"
                      className="inline-block h-4 w-72 max-w-full align-middle rounded-md bg-white/10 animate-pulse"
                    />
                  }
                >
                  <DashboardDescription />
                </Suspense>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 flex-shrink-0 self-end md:self-auto md:-mt-20">
            <Suspense
              fallback={<Skeleton className="h-8 w-32 rounded-full bg-white/15" />}
            >
              <DashboardPortalPill />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<DashboardStatsBarSkeleton />}>
          <DashboardStatsBar />
        </Suspense>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function DocumentsPage({ searchParams }: Props) {
  return (
    <div className="min-h-full bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Dashboard Hero: static shell, dynamic text + stats stream in ── */}
      <DashboardHeader />

      {/* ── Top Grid: Activity, College & Recent ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
        <div className="xl:col-span-2 min-w-0">
          <Suspense fallback={<MonthlyActivitySkeleton />}>
            <ActivitySection />
          </Suspense>
        </div>

        <div className="xl:col-span-1 min-w-0">
          <Suspense fallback={<CollegeInteractionsSkeleton />}>
            <CollegeInteractionsSection />
          </Suspense>
        </div>

        <div className="xl:col-span-1 min-w-0">
          <Suspense fallback={<RecentlyViewedSkeleton />}>
            <RecentSection />
          </Suspense>
        </div>
      </div>

      {/* ── Main Grid: Theses Table Full Width ── */}
      <div className="w-full">
        <Suspense fallback={<ThesesTableSkeleton />}>
          <ThesesSection searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
