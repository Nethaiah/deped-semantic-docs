import { FileText, Clock, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stats } from "@/server/stats/get-stats";

interface StatsCardsProps {
  stats: Stats;
  accentColor?: string;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  accentLine: string;
  badge?: string;
  sub?: string;
  decorations?: React.ReactNode;
}

function StatCard({ label, value, icon, iconBg, accentLine, badge, sub, decorations }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
      {/* Decorative Backgrounds */}
      {decorations}

      {/* Accent bottom line */}
      <span
        className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-lg z-20"
        style={{ background: accentLine }}
      />
      <CardContent className="pl-4 sm:pl-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium relative z-20">
              {badge}
            </Badge>
          )}
        </div>
        <div className="mt-3 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
          {sub && (
            <p className="text-xs text-muted-foreground pt-1">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsCards({ stats, accentColor = "#278fb6" }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      <StatCard
        label="Total Theses"
        value={stats.totalTheses}
        icon={<FileText className="h-5 w-5 text-foreground/70" />}
        iconBg={`${accentColor}22`}
        accentLine={`linear-gradient(to right, ${accentColor}, transparent)`}
        decorations={
          <>
            <div 
              className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 rounded-bl-full pointer-events-none"
              style={{ background: `linear-gradient(to bottom right, ${accentColor}26, transparent)` }}
            />
            <div 
              className="absolute top-0 right-0 w-48 sm:w-60 h-48 sm:h-60 rounded-bl-full pointer-events-none"
              style={{ background: `linear-gradient(to bottom right, ${accentColor}15, transparent)` }}
            />
          </>
        }
      />
      <StatCard
        label="Total Views"
        value={stats.totalViews}
        icon={<Eye className="h-5 w-5 text-emerald-600" />}
        iconBg="rgb(209 250 229)"
        accentLine="linear-gradient(to right, #10b981, transparent)"
        decorations={
          <>
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 sm:w-60 h-48 sm:h-60 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          </>
        }
      />
      <StatCard
        label="Recent Uploads"
        value={stats.recentUploads}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        iconBg="rgb(254 243 199)"
        accentLine="linear-gradient(to right, #f59e0b, transparent)"
        badge="This Month"
        sub={stats.currentMonth}
        decorations={
          <>
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 sm:w-60 h-48 sm:h-60 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          </>
        }
      />
    </div>
  );
}
