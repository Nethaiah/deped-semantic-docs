"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "../../../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PDFViewerClientProps = {
  file: string;
  title?: string;
  initialScale?: number;
};

export default function PDFViewerClient({ file, title, initialScale = 1 }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(initialScale);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setNumPages(0);
    setCurrentPage(1);
    setPageInput("1");
    pageRefs.current = [];
  }, [file]);

  useEffect(() => {
    const idx = Math.min(Math.max(currentPage - 1, 0), Math.max(numPages - 1, 0));
    const node = pageRefs.current[idx];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, numPages]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 truncate">{title ? `Reviewing: ${title}` : "PDF Viewer"}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-xs text-gray-600 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)))}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setScale(1)}
            className="h-8 px-2 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 text-xs"
            aria-label="Reset zoom"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-2">
        <div className="border rounded-md h-full bg-gray-50 grid grid-cols-12 gap-2 overflow-hidden">
          <aside className="col-span-3 border-r overflow-auto p-2">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="number"
                min={1}
                max={Math.max(numPages, 1)}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-16 h-8 border border-gray-300 rounded px-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const n = Number(pageInput) || 1;
                  setCurrentPage(Math.min(Math.max(n, 1), Math.max(numPages, 1)));
                }}
                className="h-8 px-3 text-xs rounded bg-gray-200 hover:bg-gray-300"
              >
                Go
              </button>
            </div>
            <div className="space-y-2 overflow-x-auto overflow-y-auto">
              <div className="min-w-max">
                <Document file={file} loading={null} onLoadError={() => {}}>
                  {Array.from({ length: numPages }, (_, i) => (
                    <div key={`thumb-${i + 1}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(i + 1);
                          setPageInput(String(i + 1));
                        }}
                        className="block w-full text-left rounded hover:border-gray-300"
                      >
                        <Page pageNumber={i + 1} width={100} renderTextLayer={false} renderAnnotationLayer={false} />
                      </button>
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </aside>
          <div className="col-span-9 overflow-x-auto overflow-y-auto p-2">
            <div className="min-w-max">
              <Document
                file={file}
                onLoadSuccess={(info: { numPages: number }) => setNumPages(info.numPages)}
                onLoadError={(e: unknown) => console.error("PDF load error", e)}
                loading={<div className="p-6 text-sm text-gray-500">Loading PDF…</div>}
                error={<div className="p-6 text-sm text-red-600">Failed to load PDF.</div>}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={`pagewrap-${i + 1}`} ref={(el) => { pageRefs.current[i] = el; }} className="mb-4">
                    <Page
                      pageNumber={i + 1}
                      width={Math.round(420 * scale)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
