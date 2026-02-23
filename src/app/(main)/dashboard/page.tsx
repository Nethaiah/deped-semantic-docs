import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { thesesFilterParamsCache } from "@/lib/search-params";
import { getThemeForRole } from "@/lib/theme-config";

// Data fetchers
import { getStats } from "@/server/stats/get-stats";
import { getTheses } from "@/server/theses/get-theses";
import { getThesesFilterOptions } from "@/server/theses/get-filter-options";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";
import { getRecentlyViewed } from "@/server/theses/get-recently-viewed";

// Existing components — imported directly
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

/* ── Async data-fetching sections (defined in page file, no wrapper components) ── */

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
  // Auth check — fast, cached by the layout's identical call
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

  // Parse URL params for theses table filters
  const { page, yearFrom, yearTo, department, college, title } =
    await thesesFilterParamsCache.parse(searchParams);

  // Dynamic classes based on role
  const bgGradient = isAdmin
    ? "from-gray-50 via-gray-100 to-gray-200"
    : "from-slate-50 via-slate-100 to-slate-200";
  const headerBorder = isAdmin ? "border-gray-200" : "border-slate-200";
  const headerGradientOverlay = isAdmin
    ? "from-gray-400/10 to-gray-500/10"
    : "from-slate-400/10 to-slate-500/10";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-5 lg:p-6`}>
      {/* Header Section — renders instantly (no data fetch) */}
      <div
        className={`bg-white rounded-lg shadow-md border ${headerBorder} px-8 py-10 lg:py-15 mb-6 relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${headerGradientOverlay} rounded-full blur-3xl`}
        ></div>
        <div className="relative z-10 gap-5 lg:gap-0 flex-col lg:flex-row flex justify-between items-start">
          <div className="w-full lg:w-[70%]">
            <h1
              className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
                isAdmin
                  ? "from-gray-800 to-gray-600"
                  : "from-slate-800 to-slate-600"
              } bg-clip-text text-transparent mb-2`}
            >
              Welcome Back,{" "}
              <span style={{ color: theme.primary }}>{displayName}!</span>
            </h1>
            <p
              className={`${
                isAdmin ? "text-gray-600" : "text-slate-600"
              } text-sm lg:text-xl font-regular`}
            >
              Explore and discover theses from your institution.
            </p>
          </div>
          <ClientTimeDisplay />
        </div>
      </div>

      {/* Stats Cards — streams in */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection accentColor={theme.primary} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Theses Table — streams in */}
        <Suspense key={JSON.stringify({ page, yearFrom, yearTo, department, college, title })} fallback={<ThesesTableSkeleton />}>
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity — streams in */}
          <Suspense fallback={<MonthlyActivitySkeleton />}>
            <ActivitySection accentColor={theme.primary} />
          </Suspense>

          {/* Recently Viewed — streams in */}
          <Suspense fallback={<RecentlyViewedSkeleton />}>
            <RecentSection accentColor={theme.primary} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
