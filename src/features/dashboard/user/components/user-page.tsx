import { TrendingUp, FileText, Clock, Eye } from "lucide-react";
import ClientTimeDisplay from "@/features/shared/components/time";
import LatestIssuances from "./latest-issuances";
import { getLatestIssuances } from "@/features/shared/server/get-latest-issuances";
import { getStats } from "@/features/shared/server/get-stats";
import { getRecentlyViewed } from "@/features/shared/server/get-recently-viewed";
import StatsCards from "@/features/shared/components/stats-card";
import RecentlyViewed from "@/features/dashboard/user/components/recently-viewed";
import MonthlyActivity from "./monthly-activity";
import { getMonthlyActivity } from "../server/get-monthly-activity";

export default async function UserDocuments({ name = "User" }) {
  const latestIssuances = await getLatestIssuances();
  const stats = await getStats();
  const recentlyViewed = await getRecentlyViewed(4); // Get last 4 viewed documents
  const monthlyActivity = await getMonthlyActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 px-8 py-15 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-400/10 to-slate-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Welcome Back, <span className="text-[#278fb6]">{name}!</span>
            </h1>
            <p className="text-slate-600 text-base font-medium">
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