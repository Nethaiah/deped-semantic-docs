"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
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

  useEffect(() => {
    setNumPages(0);
    setCurrentPage(1);
    setPageInput("1");
  }, [file]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    setScale(initialScale);
  }, [initialScale]);

  const goToPage = (page: number) => {
    setCurrentPage((prev) => {
      if (numPages === 0) return prev;
      const next = Math.min(Math.max(page, 1), numPages);
      return next;
    });
  };

  const handlePageInputSubmit = () => {
    const n = Number(pageInput);
    if (!Number.isFinite(n)) return;
    goToPage(Math.round(n));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-700 truncate">{title ? `Reviewing: ${title}` : "PDF Viewer"}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              {"<"}
            </button>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={Math.max(numPages, 1)}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handlePageInputSubmit();
                  }
                }}
                className="w-16 h-8 border border-gray-300 rounded px-2 text-sm"
                aria-label="Current page number"
              />
              <span className="text-xs text-gray-500">/ {numPages || "–"}</span>
            </div>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={numPages === 0 || currentPage >= numPages}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              {">"}
            </button>
          </div>

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
        <div className="border rounded-md h-full bg-gray-50 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto flex justify-center">
            <div className="p-4">
              <Document
                file={file}
                onLoadSuccess={(info: { numPages: number }) => {
                  setNumPages(info.numPages);
                  setCurrentPage((prev) => Math.min(prev, info.numPages));
                }}
                onLoadError={(e: unknown) => console.error("PDF load error", e)}
                loading={<div className="p-6 text-sm text-gray-500">Loading PDF…</div>}
                error={<div className="p-6 text-sm text-red-600">Failed to load PDF.</div>}
              >
                {numPages > 0 && (
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                )}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
