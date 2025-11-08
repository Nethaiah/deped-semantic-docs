"use client";

import { ArrowRight, TrendingUp, FileText, Clock, Eye } from "lucide-react";
import { useCurrentTime } from "@/lib/time-utils";
import { useRouter } from "next/navigation";
import { recentlyViewed, latestIssuances } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

// Mock monthly data for chart - placeholder data
const monthlyData = [
  { month: "Jun", uploads: 12 },
  { month: "Jul", uploads: 19 },
  { month: "Aug", uploads: 15 },
  { month: "Sep", uploads: 25 },
  { month: "Oct", uploads: 22 },
  { month: "Nov", uploads: 30 },
];

type Admin = {
  name: string;
};

// Helper to map tag labels to Badge variant
const getBadgeVariant = (
  tag: string
): "policy" | "memo" | "learning" | "curriculum" | "schoolCalendar" => {
  switch (tag) {
    case "Policy":
      return "policy";
    case "Memo":
      return "memo";
    case "Learning":
      return "learning";
    case "Curriculum":
      return "curriculum";
    case "School Calendar":
      return "schoolCalendar";
    default:
      return "policy";
  }
};

export default function AdminDocuments({ name }: Admin) {
  const { formattedTime, formattedDate } = useCurrentTime();
  const router = useRouter();

  const maxUploads = Math.max(...monthlyData.map((d) => d.uploads));
  const totalUploads = monthlyData.reduce((sum, d) => sum + d.uploads, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 px-8 py-15 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Welcome Back, <span className="text-[#008c8b]">{name}!</span>
            </h1>
            <p className="text-slate-600 text-base font-medium">
              Stay informed with the latest orders and memoranda from your
              organization.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tracking-wide text-slate-800">
              {formattedTime}
            </div>
            <div className="text-sm font-medium text-slate-600">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
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
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Eye className="w-6 h-6 text-purple-600" />
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
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Clock className="w-6 h-6 text-indigo-600" />
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
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issuances Table */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xl font-bold text-slate-800">
              Latest Issuances
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer">
              View All →
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Document
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Tags
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Issuer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestIssuances.map((issuance, index) => (
                <tr
                  key={`${issuance.id}-${index}`}
                  onClick={() => router.push(`/view/${issuance.slug}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                    {issuance.issuedDate}
                  </td>
                  <td className="py-4 px-4">
                    <div className="max-w-xs">
                      <p className="font-bold text-[#008c8b] text-sm mb-0.5">
                        {issuance.code}
                      </p>
                      <p className="text-sm text-slate-700 truncate">
                        {issuance.title}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {issuance.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          size="md"
                          variant={getBadgeVariant(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {issuance.tags.length > 2 && (
                        <span className="text-xs text-slate-500 font-semibold">
                          +{issuance.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {issuance.office}
                  </td>
                </tr>
              ))}

              {/* Empty State - Show when no data */}
              {latestIssuances.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No issuances found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
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
                      className="w-full bg-[#008c8b] rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
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
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Recently Viewed
            </h2>
            <div className="space-y-3">
              {recentlyViewed.map((item, i) => (
                <div
                  key={`${item.slug}-${i}`}
                  onClick={() => router.push(`/view/${item.slug}`)}
                  className="group relative bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#008c8b] text-sm">
                          {item.code}
                        </p>
                        <Badge
                          size="md"
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
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
