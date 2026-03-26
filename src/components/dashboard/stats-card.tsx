import { FileText, Clock, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stats } from "@/server/stats/get-stats";

interface StatsCardsProps {
  stats: Stats;
  accentColor?: string;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-around rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-lg gap-6 sm:gap-2">
      {/* Total Theses */}
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <p className="text-3xl sm:text-4xl font-bold tabular-nums text-white drop-shadow-sm">
          {stats.totalTheses}
        </p>
        <p className="text-sm sm:text-base font-medium text-white/80 mt-1">
          Total Theses
        </p>
      </div>

      <div className="hidden sm:block w-px h-12 bg-white/20" />

      {/* Total Views */}
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <p className="text-3xl sm:text-4xl font-bold tabular-nums text-white drop-shadow-sm">
          {stats.totalViews}
        </p>
        <p className="text-sm sm:text-base font-medium text-white/80 mt-1">
          Total Views
        </p>
      </div>

      <div className="hidden sm:block w-px h-12 bg-white/20" />

      {/* Recent Uploads */}
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <p className="text-3xl sm:text-4xl font-bold tabular-nums text-white drop-shadow-sm">
          {stats.recentUploads}
        </p>
        <p className="text-sm sm:text-base font-medium text-white/80 mt-1">
          Recent Uploads
        </p>
        {stats.currentMonth && (
          <span className="text-[10px] text-white/60 uppercase tracking-wider mt-1">
            {stats.currentMonth}
          </span>
        )}
      </div>
    </div>
  );
}
