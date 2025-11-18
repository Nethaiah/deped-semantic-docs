import { TrendingUp, FileText, Clock, Eye } from "lucide-react";
import ClientTimeDisplay from "@/features/dashboard/shared/components/time";
import LatestIssuances from "./latest-issuances";
import { getLatestIssuances } from "@/features/shared/server/get-latest-issuances";

// Mock monthly data for chart - placeholder data
const monthlyData = [
  { month: "Jun", uploads: 12 },
  { month: "Jul", uploads: 19 },
  { month: "Aug", uploads: 15 },
  { month: "Sep", uploads: 25 },
  { month: "Oct", uploads: 22 },
  { month: "Nov", uploads: 30 },
];

export default async function UserDocuments({ name = "User" }) {
  const latestIssuances = await getLatestIssuances();

  const maxUploads = Math.max(...monthlyData.map((d) => d.uploads));
  const totalUploads = monthlyData.reduce((sum, d) => sum + d.uploads, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Total Issuances
          </h3>
          <p className="text-3xl font-bold text-slate-800">127</p>
          <p className="text-xs text-green-600 font-medium mt-2">
            +12% from last month
          </p>
          <div className="absolute top-0 right-0 w-40 h-30 bg-gradient-to-br from-[#278fb6]/15 to-transparent rounded-bl-full"></div>
          <div className="absolute top-0 right-0 w-60 h-50 bg-gradient-to-br from-[#278fb6]/15   to-transparent rounded-bl-full"></div>
        </div>

        <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Eye className="w-6 h-6 text-slate-700" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Documents Viewed
          </h3>
          <p className="text-3xl font-bold text-slate-800">45</p>
          <p className="text-xs text-green-600 font-medium mt-2">
            +8% from last week
          </p>
          <div className="absolute top-0 right-0 w-40 h-30 bg-gradient-to-br from-[#278fb6]/15 to-transparent rounded-bl-full"></div>
          <div className="absolute top-0 right-0 w-60 h-50 bg-gradient-to-br from-[#278fb6]/15   to-transparent rounded-bl-full"></div>
        </div>

        <div className="relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Clock className="w-6 h-6 text-slate-700" />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Recent Uploads
          </h3>
          <p className="text-3xl font-bold text-slate-800">
            {monthlyData[monthlyData.length - 1].uploads}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-2">
            November 2024
          </p>
          <div className="absolute top-0 right-0 w-40 h-30 bg-gradient-to-br from-[#278fb6]/15 to-transparent rounded-bl-full"></div>
          <div className="absolute top-0 right-0 w-60 h-50 bg-gradient-to-br from-[#278fb6]/15   to-transparent rounded-bl-full"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issuances Table */}
        <LatestIssuances
          initialData={latestIssuances.data}
          initialTotalPages={latestIssuances.totalPages}
        />

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-slate-800">
                Monthly Activity
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                New uploads and edits over the last 6 months.
              </p>
            </div>

            <div className="mt-6 h-48 flex items-end justify-between gap-2 pb-8 relative">
              {monthlyData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col items-center justify-end h-40 relative">
                    {/* Number label above bar */}
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {data.uploads}
                    </span>
                    {/* Bar */}
                    <div
                      className="w-full bg-[#278fb6] rounded-t-lg transition-all duration-500 hover:bg-slate-600 relative group"
                      style={{
                        height: `${(data.uploads / maxUploads) * 100}%`,
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.uploads} uploads
                      </div>
                    </div>
                  </div>
                  {/* Month label */}
                  <span className="text-xs font-medium text-slate-600">
                    {data.month}
                  </span>
                </div>
              ))}
              <div className="absolute bottom-8 left-0 right-0 h-px bg-slate-200"></div>
            </div>
          </div>

          {/* Recently Viewed */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Recently Viewed
            </h2>
            <div className="space-y-3">
              {recentlyViewed.map((item, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/view/${item.slug}`)}
                  className="group relative bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#278fb6] text-sm">
                          {item.code}
                        </p>
                        <Badge
                          variant={getBadgeVariant(item.tags?.[0] || "Policy")}
                        >
                          {item.tags?.[0] || "Policy"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Recently</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#278fb6] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
