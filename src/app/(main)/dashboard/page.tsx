import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { thesesFilterParamsCache } from "@/lib/search-params";
import { getThemeForRole } from "@/lib/theme-config";
import { getCurrentUserRole } from "@/lib/dal";
import Image from "next/image";

// Data fetchers
import { getStats } from "@/server/stats/get-stats";
import { getTheses } from "@/server/theses/get-theses";
import { getThesesFilterOptions } from "@/server/theses/get-filter-options";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";
import { getRecentlyViewed } from "@/server/theses/get-recently-viewed";

// Dashboard components
import ThesesTable from "@/components/dashboard/theses-table";
import MonthlyActivity from "@/components/dashboard/monthly-activity";
import RecentlyViewed from "@/components/dashboard/recently-viewed";

// Skeleton fallbacks
import {
  ThesesTableSkeleton,
  MonthlyActivitySkeleton,
  RecentlyViewedSkeleton,
} from "@/components/dashboard/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};

/* ── Async data-fetching sections ── */

async function DashboardHeader() {
  const userRole = await getCurrentUserRole();
  const role = userRole?.role || "user";
  const displayName = userRole?.fullName || "Researcher";
  const isAdmin = userRole?.isAdmin || false;

  const stats = await getStats();

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-[#1C402E] shadow-xl p-6 sm:p-10 border border-white/5">
      {/* --- Ambient Blobs / Glow --- */}
      {/* Intense Golden/Amber Glow Bottom Right only */}
      <div className="absolute -bottom-[400px] -right-[200px] w-[800px] h-[800px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -right-[100px] w-[450px] h-[450px] bg-[#D4A373]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-[80px] -right-[50px] w-[250px] h-[250px] bg-amber-400/20 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Solid Low-Opacity White Circles */}
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[550px] h-[550px] bg-white/5 rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-6">
            {/* Logo/Dashboard Header text */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                 <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">DASHBOARD</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight mb-3">
                Welcome back, {displayName}
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-xl">
                A refined view of your institution's {isAdmin ? 'system repository, including users and system metrics.' : 'theses repository, including document metrics and recent uploads.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 flex-shrink-0 self-end md:self-auto md:-mt-20">
            {/* Top Pill button */}
            <div className="px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-sm">
              <span className="text-xs font-semibold text-white tracking-wide">
                {isAdmin ? 'Admin Portal' : 'Researcher Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Glass Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden mt-4">
          <div className="px-6 py-6 flex flex-col items-center justify-center">
            <p className="text-[2rem] font-bold text-white mb-1 leading-none">{stats.totalTheses}</p>
            <p className="text-xs text-white/80 font-bold tracking-wide">Total Theses</p>
          </div>
          <div className="px-6 py-6 flex flex-col items-center justify-center">
            <p className="text-[2rem] font-bold text-white mb-1 leading-none">{stats.totalViews}</p>
            <p className="text-xs text-white/80 font-bold tracking-wide">Total Views</p>
          </div>
          <div className="px-6 py-6 flex flex-col items-center justify-center">
            <p className="text-[2rem] font-bold text-white mb-1 leading-none">{stats.recentUploads}</p>
            <p className="text-xs text-white/80 font-bold tracking-wide">Recent Uploads</p>
            <p className="text-[10px] text-white/50 font-bold tracking-widest mt-1 uppercase">{stats.currentMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-[#1C402E] shadow-xl p-6 sm:p-10 border border-white/5 min-h-[350px]">
       <div className="animate-pulse flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/10"></div>
                   <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
                <div className="space-y-3">
                   <div className="h-10 w-64 sm:w-96 bg-white/10 rounded-lg" />
                   <div className="h-4 w-48 sm:w-72 bg-white/10 rounded-lg" />
                </div>
             </div>
             <div className="flex flex-col gap-3 self-end md:-mt-20 md:self-auto">
                <div className="h-8 w-32 bg-white/10 rounded-full" />
             </div>
          </div>
          <div className="h-28 w-full bg-white/10 rounded-2xl" />
       </div>
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

/* ── Page ── */

export default function DocumentsPage({ searchParams }: Props) {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Dashboard Unified Header (Hero & Stats) ── */}
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      {/* ── Top Grid: Activity & Recent ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
        <div className="xl:col-span-3 min-w-0">
          <Suspense fallback={<MonthlyActivitySkeleton />}>
            <ActivitySection />
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
