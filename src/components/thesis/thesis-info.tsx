import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Building2, 
  GraduationCap, 
  Users, 
  BookOpen,
  FileText
} from "lucide-react";
import { getBadgeVariant, getDynamicBadgeClasses } from "@/lib/badge-variants";
import type { ThesisData } from "@/server/theses/get-thesis-data";

type Props = {
  thesis: ThesisData;
};

export default function ThesisInfoSidebar({ thesis }: Props) {
  // Format author names for display
  const formatAuthors = (authors: ThesisData["authors"]) => {
    if (!authors || authors.length === 0) return "Unknown Author";
    return authors.map((a) => a.authorName).join(", ");
  };

  return (
    <Card className="rounded-xl border-gray-200 p-0 gap-0">
      <CardContent className="p-4 sm:p-5">
        {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 leading-tight">
        {thesis.title}
      </h3>

      {/* Authors */}
      <div className="mt-3 flex items-start gap-3 text-slate-600">
        <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <span className="font-medium text-slate-700">Authors:</span>
          <p className="text-slate-600">{formatAuthors(thesis.authors)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        {/* Year */}
        <div className="flex items-start gap-3 text-slate-600">
          <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Year: {thesis.year}</span>
        </div>

        {/* Department */}
        <div className="flex items-start gap-3 text-slate-600">
          <GraduationCap className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Department: {thesis.department}</span>
        </div>

        {/* College */}
        <div className="flex items-start gap-3 text-slate-600">
          <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>College: {thesis.college}</span>
        </div>

        {/* Advisor */}
        {thesis.advisor && (
          <div className="flex items-start gap-3 text-slate-600">
            <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Advisor: {thesis.advisor}</span>
          </div>
        )}

        {/* Total Pages */}
        {thesis.totalPages > 0 && (
          <div className="flex items-start gap-3 text-slate-600">
            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{thesis.totalPages} pages</span>
          </div>
        )}

        {/* Keywords */}
        {thesis.keywords && thesis.keywords.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Keywords
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {thesis.keywords.map((keyword) => {
                const variant = getBadgeVariant(keyword);
                return (
                  <Badge
                    key={keyword}
                    size="md"
                    {...(variant === "dynamic"
                      ? { className: getDynamicBadgeClasses(keyword) }
                      : { variant })}
                  >
                    {keyword}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </CardContent>
    </Card>
  );
}
