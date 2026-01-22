"use client";
import dynamic from "next/dynamic";

const PDFViewerClient = dynamic(() => import("@/components/document/manage-pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-center text-sm text-gray-600">Loading PDF Viewer…</div>
  ),
});

export type PDFViewerProps = {
  file: string;
  title?: string;
  initialScale?: number;
};

export default function PDFViewer(props: PDFViewerProps) {
  return <PDFViewerClient {...props} />;
}
