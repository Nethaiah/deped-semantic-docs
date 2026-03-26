import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { thesesFilterParamsCache } from "@/lib/search-params";
import { getThemeForRole } from "@/lib/theme-config";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = userData?.role || "user";
  const displayName = userData?.full_name || user.user_metadata.full_name;
  const theme = getThemeForRole(role);
  const isAdmin = role === "admin";

  const { page, yearFrom, yearTo, department, college, title } =
    await thesesFilterParamsCache.parse(searchParams);

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Unified Hero & Stats Container ── */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#1b3b35] via-[#24453b] to-[#5a4834]">
        {/* Decorative Background Elements */}
        {/* Geometric Light Rings (Particles) */}
        <div className="absolute -top-16 -right-16 w-[32rem] h-[32rem] rounded-full border-[1px] border-white/10 bg-white/[0.02] pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-[24rem] h-[24rem] rounded-full border-[1px] border-white/10 bg-white/[0.02] pointer-events-none" />
        
        {/* Lower Left Rings */}
        <div className="absolute -bottom-12 -left-12 w-[28rem] h-[28rem] rounded-full border-[1px] border-white/10 bg-white/[0.01] pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-[20rem] h-[20rem] rounded-full border-[1px] border-white/5 bg-transparent pointer-events-none" />

        {/* Glowing Highlight Blobs */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[100px] opacity-30 transform translate-x-1/3 -translate-y-1/3" style={{ background: theme.primary }} />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full blur-[80px] opacity-20 transform -translate-x-1/2 translate-y-1/3" style={{ background: theme.primary }} />
        {/* Warm Golden Highlight at Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] rounded-full bg-[#f59e0b] blur-[120px] opacity-[0.25] transform translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white">
                  <span className="text-sm font-bold opacity-90">D</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  Dashboard
                </p>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-sm">
                  Welcome back, {displayName}
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                  A refined view of your institution's theses repository, including document metrics and recent uploads.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-medium text-white/90">
                {isAdmin ? "Administrator Portal" : "Researcher Portal"}
              </span>
            </div>
          </div>

          {/* ── Glassy Stats Container ── */}
          <Suspense fallback={<StatsCardsSkeleton />}>
            <StatsSection accentColor={theme.primary} />
          </Suspense>
        </div>
      </div>

      {/* ── Main Content: Full-width Table ── */}
      <div className="w-full">
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

      {/* ── Bottom Row: Activity & Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
        <div className="w-full flex-shrink-0">
          <Suspense fallback={<MonthlyActivitySkeleton />}>
            <ActivitySection accentColor={theme.primary} />
          </Suspense>
        </div>

        <div className="w-full flex-shrink-0">
          <Suspense fallback={<RecentlyViewedSkeleton />}>
            <RecentSection accentColor={theme.primary} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
