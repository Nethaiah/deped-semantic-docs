import PDFViewer from "@/components/document/manage-pdf-viewer";

type Props = {
  sourcePath?: string;
  title: string;
};

export default function DocumentPDFViewer({ sourcePath, title }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" style={{ height: '600px' }}>
      {sourcePath ? (
        <PDFViewer file={sourcePath} title={title} />
      ) : (
        <div className="p-6 text-center text-slate-500">
          <p>No PDF available for this document.</p>
        </div>
      )}
    </div>
  );
}