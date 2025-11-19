import Link from "next/link";
import type { DocumentData } from "../server/get-document-data";

type Props = {
  similar: DocumentData[];
};

export default function SimilarDocuments({ similar }: Props) {
  if (!similar || similar.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h4 className="font-bold text-slate-800 mb-2">Similar Documents</h4>
      <div className="space-y-3">
        {similar.map((s) => (
          <Link
            key={s.id}
            href={`/view/${s.id}`}
            className="block text-xs text-[#278fb6] hover:bg-slate-100 p-2 rounded-md transition-colors"
          >
            <div className="flex justify-between font-semibold">
              <span>{s.code}</span>
              <span>~</span>
            </div>
            <p className="text-slate-500 font-normal mt-0.5">{s.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
