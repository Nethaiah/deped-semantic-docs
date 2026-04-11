import PDFViewer from "@/components/thesis/pdf-viewer/manage-pdf-viewer";
import { RAGApiService } from "@/lib/api/rag-api";

type Props = {
  sourcePath?: string;
  thesisId: string;
  title: string;
};

export default function DocumentPDFViewer({ sourcePath, thesisId, title }: Props) {
  const pdfUrl = sourcePath ? RAGApiService.getProxyPdfUrl(thesisId) : undefined;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" style={{ height: '600px' }}>
      {pdfUrl ? (
        <PDFViewer file={pdfUrl} title={title} />
      ) : (
        <div className="p-6 text-center text-slate-500">
          <p>No PDF available for this document.</p>
        </div>
      )}
    </div>
  );
}