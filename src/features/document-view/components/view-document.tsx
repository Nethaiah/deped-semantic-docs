import Link from "next/link";
import { Files, History } from "lucide-react";
import DocumentInfoSidebar from "./document-info";
import {
  getDocumentById,
  getSimilarDocuments,
} from "../server/get-document-data";
import DocumentActions from "./document-actions";
import DocumentAnalysis from "./document-summary";
import DocumentPDFViewer from "./pdf-viewer";
import SimilarDocuments from "./similar-documents";
import { checkBookmark } from "../../shared/server/check-bookmark";
import BackButton from "./back-button";

type Props = {
  documentId: string;
};

export default async function ViewDocument({ documentId }: Props) {
  const { data: doc, error } = await getDocumentById(documentId);
  const similar = await getSimilarDocuments(documentId, 3);
  const { bookmarked } = await checkBookmark(documentId);

  if (error || !doc) {
    return;
  }

  return (
    <div className="p-8">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3">
          <DocumentInfoSidebar doc={doc} />
          <DocumentActions
            sourcePath={doc.sourcePath}
            docId={doc.id}
            initialBookmarked={bookmarked}
          />
        </div>

        <div className="col-span-12 lg:col-span-6 space-y-6">
          <DocumentAnalysis summary={doc.summary} documentId={doc.id} />
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <DocumentPDFViewer sourcePath={doc.sourcePath} title={doc.title} />
          <SimilarDocuments similar={similar} />

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h4 className="font-bold text-slate-800 mb-2">
              Attachments & History
            </h4>
            <div className="text-xs space-y-2">
              {doc.sourcePath && (
                <Link
                  href={doc.sourcePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-600 hover:text-[#278fb6]"
                >
                  <Files className="h-4 w-4" /> View Source Document
                </Link>
              )}
              <span className="flex items-center gap-2 text-slate-600">
                <History className="h-4 w-4" /> Version History (1)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
