import { TrendingUp, FileText, Clock, Eye } from "lucide-react";
import ClientTimeDisplay from "@/components/shared/time";
import LatestIssuances from "./latest-issuances";
import { getLatestIssuances } from "@/server/documents/get-latest-issuances";
import { getStats } from "@/server/stats/get-stats";
import { getRecentlyViewed } from "@/server/documents/get-recently-viewed";
import StatsCards from "@/components/shared/stats-card";
import RecentlyViewed from "@/components/dashboard/user/recently-viewed";
import MonthlyActivity from "./monthly-activity";
import { getMonthlyActivity } from "@/server/stats/get-monthly-activity";

export default async function UserDocuments({ name = "User" }) {
  const latestIssuances = await getLatestIssuances();
  const stats = await getStats();
  const recentlyViewed = await getRecentlyViewed(3); // Get last 4 viewed documents
  const monthlyActivity = await getMonthlyActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-5 lg:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 px-8 py-10 lg:py-15 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-400/10 to-slate-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 gap-5 lg:gap-0 flex-col lg:flex-row flex justify-between items-start">
          <div className="w-full lg:w-[70%]">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Welcome Back, <span className="text-[#278fb6]">{name}!</span>
            </h1>
            <p className="text-slate-600 text-sm lg:text-xl font-regular">
              Stay informed with the latest orders and memoranda from your
              organization.
            </p>
          </div>
          <ClientTimeDisplay />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issuances Table */}
        <LatestIssuances
          initialData={latestIssuances.data}
          initialTotalPages={latestIssuances?.totalPages}
        />

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity Chart */}
          <MonthlyActivity data={monthlyActivity} />

          {/* Recently Viewed */}
          <RecentlyViewed documents={recentlyViewed} />
        </div>
      </div>
    </div>
  );
}
