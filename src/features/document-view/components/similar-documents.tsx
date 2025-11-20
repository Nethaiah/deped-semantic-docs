import Link from "next/link";
import type { DocumentData } from "../server/get-document-data";

type Props = {
  similar: DocumentData[];
};

export default function SimilarDocuments({ similar }: Props) {
  if (!similar || similar.length === 0) return null;

// Helper function to format similarity score as percentage
const formatSimilarity = (score?: number) => {
  if (!score) return null;
  return `${Math.round(score * 100)}%`;
};

// Helper function to get color based on similarity score
const getSimilarityColor = (score?: number) => {
  if (!score) return "text-slate-400";
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.7) return "text-blue-600";
  return "text-amber-600";
};

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h4 className="font-bold text-slate-800 mb-2">Similar Documents</h4>
      <div className="space-y-3">
        {similar.map((s) => (
          <Link
            key={s.id}
            href={`/view/${s.id}`}
             className="block text-xs hover:bg-slate-50 p-2 rounded-md transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex justify-between items-center font-semibold mb-1">
              <span className="text-blue-600">{s.code}</span>
              {(s as any).similarityScore && (
                <span className={`text-xs font-medium ${getSimilarityColor((s as any).similarityScore)}`}>
                  {formatSimilarity((s as any).similarityScore)}
                </span>
              )}
            </div>
            <p className="text-slate-600 font-normal leading-snug">{s.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
