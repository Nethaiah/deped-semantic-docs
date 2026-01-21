import { FileText, Clock, Eye } from "lucide-react";
import { Stats } from "@/server/stats/get-stats";

interface StatsCardsProps {
  stats: Stats;
  accentColor?: string;
}

export default function StatsCards({ stats, accentColor = "#278fb6" }: StatsCardsProps) {
  const isOrdersPositive = stats.ordersDailyChange >= 0;
  const isMemosPositive = stats.memorandumsDailyChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Orders Card */}
      <div className="group relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div 
          className="absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to bottom right, ${accentColor}1A, transparent, transparent)` }}
        ></div>

        <div 
          className="absolute top-0 right-0 w-20 lg:w-40 h-15 lg:h-30 rounded-bl-full"
          style={{ background: `linear-gradient(to bottom right, ${accentColor}26, transparent)` }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-40 lg:w-60 h-40 lg:h-50 rounded-bl-full"
          style={{ background: `linear-gradient(to bottom right, ${accentColor}26, transparent)` }}
        ></div>

        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${accentColor}26` }}
            >
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
            {stats.ordersDailyChange !== 0 && (
              <span
                className={`text-sm font-semibold ${
                  isOrdersPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOrdersPositive ? "+" : ""}
                {stats.ordersDailyChange}
              </span>
            )}
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-slate-800">
            {stats.totalOrders}
          </p>
        </div>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
        ></div>
      </div>

      {/* Total Memorandums Card */}
      <div className="group relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-0 right-0 w-20 lg:w-40 h-15 lg:h-30 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-bl-full"></div>
        <div className="absolute top-0 right-0 w-40 lg:w-60 h-40 lg:h-50 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-bl-full"></div>

        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Eye className="w-6 h-6 text-slate-700" />
            </div>
            {stats.memorandumsDailyChange !== 0 && (
              <span
                className={`text-sm font-semibold ${
                  isMemosPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isMemosPositive ? "+" : ""}
                {stats.memorandumsDailyChange}
              </span>
            )}
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Total Memoranda
          </h3>
          <p className="text-3xl font-bold text-slate-800">
            {stats.totalMemorandums}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      {/* Recent Uploads Card */}
      <div className="group relative bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-0 right-0 w-20 lg:w-40 h-15 lg:h-30 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full"></div>
        <div className="absolute top-0 right-0 w-40 lg:w-60 h-40 lg:h-50 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full"></div>

        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-slate-700" />
            </div>
            <span className="text-sm text-slate-500 font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-slate-600 text-sm font-semibold mb-1">
            Recent Uploads
          </h3>
          <p className="text-3xl font-bold text-slate-800">
            {stats.recentUploads}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-2">
            {stats.currentMonth}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
}
