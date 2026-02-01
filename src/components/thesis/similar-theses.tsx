import Link from "next/link";
import { Users, Calendar } from "lucide-react";

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
  if (!similar || similar.length === 0) return null;

  // Format authors for display
  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return "Unknown";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(" & ");
    return `${authors[0]} et al.`;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h4 className="font-bold text-slate-800 mb-2">Related Theses</h4>
      <div className="space-y-3">
        {similar.map((thesis) => (
          <Link
            key={thesis.thesisId}
            href={`/view/${thesis.thesisId}`}
            className="block text-xs hover:bg-slate-50 p-3 rounded-md transition-colors border border-transparent hover:border-slate-200"
          >
            {/* Title */}
            <p className="text-slate-800 font-medium leading-snug line-clamp-2 mb-2">
              {thesis.title}
            </p>
            
            {/* Authors and Year */}
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1 truncate">
                <Users className="h-3 w-3" />
                {formatAuthors(thesis.authors)}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                {thesis.year}
              </span>
            </div>

            {/* Department Badge */}
            <div className="mt-2">
              <span className="inline-block text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {thesis.department}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
