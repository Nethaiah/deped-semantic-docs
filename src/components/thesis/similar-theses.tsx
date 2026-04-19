"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, ArrowRight, Building } from "lucide-react";
import { useTheme } from "@/components/theme-context";

type SimilarThesis = {
  thesisId: string;
  title: string;
  year: number;
  department: string;
  college: string;
  keywords: string[];
  authors: string[];
};

type Props = {
  similar: SimilarThesis[];
};

export default function SimilarTheses({ similar }: Props) {
  const { theme } = useTheme();
  if (!similar || similar.length === 0) return null;

  // Format authors for display
  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return "Unknown";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(" & ");
    return `${authors[0]} et al.`;
  };

  return (
    <Card className="rounded-xl border-gray-200 p-0 gap-0">
      <CardContent className="p-4 sm:p-5">
        <h4 className="font-bold text-slate-800 mb-3 sm:mb-4">Related Research Papers</h4>
        <div className="space-y-3">
        {similar.map((thesis) => (
          <Link
            key={thesis.thesisId}
            href={`/view/${thesis.thesisId}`}
            className="group relative block bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Year and Department Badge */}
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-sm" style={{ color: theme.primary }}>
                    {thesis.year}
                  </p>
                </div>
                
                {/* Thesis Title */}
                <p className="text-sm text-slate-700 line-clamp-2 mb-2 font-medium group-hover:text-slate-900">
                  {thesis.title}
                </p>
                
                {/* Authors */}
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <Users className="w-3 h-3" />
                  <span className="truncate">{formatAuthors(thesis.authors)}</span>
                </div>
                
                {/* Department */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Building className="w-3 h-3" />
                  <span className="truncate">{thesis.department}</span>
                </div>
              </div>
              
              {/* Hover Arrow */}
              <ArrowRight 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" 
                style={{ color: theme.primary }}
              />
            </div>
          </Link>
        ))}
        </div>
      </CardContent>
    </Card>
  );
}
