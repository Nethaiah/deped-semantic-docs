import ClientTimeDisplay from "@/components/shared/time";
import ThesesTable from "@/components/dashboard/theses-table";
import { getTheses } from "@/server/theses/get-theses";
import { getStats } from "@/server/stats/get-stats";
import { getRecentlyViewed } from "@/server/theses/get-recently-viewed";
import StatsCards from "@/components/dashboard/stats-card";
import RecentlyViewed from "@/components/dashboard/recently-viewed";
import MonthlyActivity from "@/components/dashboard/monthly-activity";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";
import { getThemeForRole } from "@/lib/theme-config";

interface DashboardPageProps {
  name: string;
  role: string;
}

export default async function DashboardPage({ name, role }: DashboardPageProps) {
  const theses = await getTheses();
  const stats = await getStats();
  const recentlyViewed = await getRecentlyViewed(3);
  const monthlyActivity = await getMonthlyActivity();

  const theme = getThemeForRole(role);
  const isAdmin = role === "admin";

  // Dynamic Tailwind classes based on role
  const bgGradient = isAdmin
    ? "from-gray-50 via-gray-100 to-gray-200"
    : "from-slate-50 via-slate-100 to-slate-200";

  const headerBorder = isAdmin ? "border-gray-200" : "border-slate-200";
  const headerGradientOverlay = isAdmin
    ? "from-gray-400/10 to-gray-500/10"
    : "from-slate-400/10 to-slate-500/10";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-5 lg:p-6`}>
      {/* Header Section */}
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
                isAdmin ? "from-gray-800 to-gray-600" : "from-slate-800 to-slate-600"
              } bg-clip-text text-transparent mb-2`}
            >
              Welcome Back,{" "}
              <span style={{ color: theme.primary }}>{name}!</span>
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

      {/* Stats Cards */}
      <StatsCards stats={stats} accentColor={theme.primary} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issuances Table */}
        <ThesesTable
          initialData={theses.data}
          initialTotalPages={theses?.totalPages}
          accentColor={theme.primary}
        />

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity Chart */}
          <MonthlyActivity data={monthlyActivity} accentColor={theme.primary} />

          {/* Recently Viewed */}
          <RecentlyViewed theses={recentlyViewed} accentColor={theme.primary} />
        </div>
      </div>
    </div>
  );
}
