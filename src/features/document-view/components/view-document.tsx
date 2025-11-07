import Link from "next/link";
import type { DocumentItem } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Bookmark,
  Share2,
  FileDown,
  Flag,
  BookText,
  Files,
  History,
  CalendarDays,
} from "lucide-react";

type Props = {
  doc: DocumentItem;
  similar: DocumentItem[];
};

export default function ViewDocument({ doc, similar }: Props) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3">
          <h3 className="text-xl font-bold text-slate-800">{doc.code}</h3>
          <p className="text-slate-600 text-sm mt-1">{doc.title}</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <CalendarDays className="h-4 w-4" />
              <span>Issued: {doc.issuedDate}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {doc.tags.map((t) => (
                <Badge
                  key={t}
                  size="md"
                  variant={(function getBadgeVariant(tag: string):
                    | "policy"
                    | "memo"
                    | "learning"
                    | "curriculum"
                    | "schoolCalendar" {
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
                  })(t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-6 border-t pt-4 space-y-2">
            <button className="w-full text-left bg-slate-100 border-1 border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3">
              <Bookmark className="h-4 w-4" /> Bookmark
            </button>
            <button className="w-full text-left bg-slate-100 border-1 border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button className="w-full text-left bg-slate-100 border-1 border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3">
              <FileDown className="h-4 w-4" /> Download PDF
            </button>
            <button className="w-full text-left bg-slate-100 border-1 border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3">
              <Flag className="h-4 w-4" /> Report Issue
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800">
            Document Analysis
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Generate summary or ask questions about the content.
          </p>

          <div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all duration-200">
              <BookText className="h-4 w-4" /> Generate Summary
            </button>
          </div>

          <div className="mt-6 border-t pt-6">
            <h4 className="font-bold text-slate-800 mb-3">
              Ask a question about the document
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., When does the school year end?"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800">
                Ask
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-800">Document Content</h4>
              <div className="text-sm bg-slate-100 rounded-lg p-1 flex">
                <button className="px-2 py-0.5 rounded-md bg-white shadow text-xs font-semibold">
                  Text
                </button>
                <button className="px-2 py-0.5 rounded-md text-slate-600 text-xs">
                  PDF
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-md">
              <strong>I. Rationale</strong>
              <br />
              {doc.contentText ||
                "The Department of Education (DepEd) is committed to providing a learning environment that is safe..."}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h4 className="font-bold text-slate-800 mb-2">Similar Documents</h4>
            <div className="space-y-3">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={`/view/${s.slug}`}
                  className="block text-xs text-blue-600 hover:bg-slate-50 p-2 rounded-md"
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

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h4 className="font-bold text-slate-800 mb-2">
              Attachments & History
            </h4>
            <div className="text-xs space-y-2">
              <span className="flex items-center gap-2 text-slate-600">
                <Files className="h-4 w-4" /> Enclosure 1: School Calendar.pdf
              </span>
              <span className="flex items-center gap-2 text-slate-600">
                <History className="h-4 w-4" /> Version History (3)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
