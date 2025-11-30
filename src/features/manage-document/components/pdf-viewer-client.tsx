"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { RotateCcw, Plus, Minus, ChevronLeft, ChevronRight, Maximize, X, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// 1. Configure Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PDFViewerClientProps = {
  file: string;
  title?: string;
  initialScale?: number;
};

// ----------------------------------------------------------------------
// 2. Custom Portal (Same as before)
// ----------------------------------------------------------------------
const FullScreenPortal = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-200">
        {children}
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------------------------------
// 3. The Viewer Component (Continuous Scroll)
// ----------------------------------------------------------------------

type PDFInstanceProps = {
  file: string;
  title?: string;
  initialScale?: number;
  onMaximize?: () => void;
  onClose?: () => void;
  isModal?: boolean;
};

function PDFInstance({ file, title, initialScale = 1, onMaximize, onClose, isModal = false }: PDFInstanceProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(initialScale);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 1. Measure Container for "Fit Width"
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Subtract padding/scrollbar space
        setContainerWidth(entries[0].contentRect.width - 40);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isModal]);

  // 2. Setup Scroll Observer (To update Page Number as you scroll)
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5, // Page is considered "active" when 50% visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.getAttribute("data-page-number") || "1");
          setCurrentPage(pageNum);
        }
      });
    }, options);

    // Attach observer to all page elements
    const pages = document.querySelectorAll(`[data-instance-id="${isModal ? 'modal' : 'preview'}"] .pdf-page-wrapper`);
    pages.forEach((page) => observerRef.current?.observe(page));
  }, [numPages, isModal]); // Re-run when pages are rendered

  // Trigger observer setup when numPages changes
  useEffect(() => {
    if (numPages > 0) {
      // Small timeout to allow React to render DOM nodes
      setTimeout(setupIntersectionObserver, 500);
    }
    return () => observerRef.current?.disconnect();
  }, [numPages, setupIntersectionObserver]);

  // 3. Navigation Helpers
  const scrollToPage = (pageNumber: number) => {
    const targetPage = pageNumber;
    if (targetPage < 1 || targetPage > numPages) return;

    // We can just scroll the container or use scrollIntoView
    const pageId = `pdf-page-${isModal ? 'modal' : 'preview'}-${targetPage}`;
    const element = document.getElementById(pageId);
    
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentPage(targetPage);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${isModal ? 'overflow-hidden' : ''}`} data-instance-id={isModal ? 'modal' : 'preview'}>
      
      {/* --- TOOLBAR --- */}
      <div className="px-4 py-3 border-b flex flex-wrap items-center justify-center gap-3 bg-white text-gray-700 z-10 shadow-sm shrink-0">
        
        {/* Title with Tooltip */}
        <div className="flex-shrink min-w-0 group relative">
          <p className="text-sm font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]" 
            title={isModal ? title : `${title || "Document"}`}
            >
            {isModal ? title : `${title || "Document"}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pagination (Now triggers Scroll) */}
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => scrollToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <div className="flex items-center gap-1 min-w-[3rem] justify-center">
              <span className="text-xs text-gray-500 font-medium"> {currentPage} / {numPages || "–"}</span>
            </div>
            <button
              onClick={() => scrollToPage(currentPage + 1)}
              disabled={numPages === 0 || currentPage >= numPages}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 border-l pl-2 border-gray-200">
            <button
              onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600 w-10 text-center font-medium">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale(1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {onMaximize && (
            <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
              <button
                onClick={onMaximize}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          )}

          {onClose && (
            <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
              <button
                onClick={onClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- CONTENT AREA (SCROLLABLE) --- */}
      <div className="flex-1 overflow-hidden p-0 bg-gray-50 relative">
        <div ref={containerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4">
           <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400 gap-2">
                   <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                   <span className="text-sm">Loading PDF...</span>
                </div>
              }
              error={
                <div className="mt-20 text-red-500 font-medium text-sm text-center">Unable to load document.</div>
              }
              className="flex flex-col items-center gap-6" // Gap between pages
           >
              {/* LOOP THROUGH ALL PAGES */}
              {Array.from(new Array(numPages), (el, index) => (
                <div 
                    key={`page_${index + 1}`}
                    id={`pdf-page-${isModal ? 'modal' : 'preview'}-${index + 1}`}
                    data-page-number={index + 1}
                    className="pdf-page-wrapper shadow-lg"
                >
                    <Page 
                        pageNumber={index + 1} 
                        // Width Logic:
                        // 1. Modal: Fits available container width
                        // 2. Preview: Uses scale
                        width={isModal && containerWidth ? containerWidth : undefined}
                        scale={isModal ? undefined : scale} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="bg-white"
                        loading={
                            <div className="bg-white h-[800px] w-[600px] flex items-center justify-center text-gray-300">
                                Loading Page {index + 1}...
                            </div>
                        }
                    />
                </div>
              ))}
           </Document>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Main Export
// ----------------------------------------------------------------------

export default function PDFViewerClient({ file, title, initialScale = 1 }: PDFViewerClientProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {/* 1. Small Preview */}
      <PDFInstance 
        file={file} 
        title={title} 
        initialScale={initialScale} 
        onMaximize={() => setIsFullScreen(true)}
      />

      {/* 2. Full Screen Popup */}
      <FullScreenPortal isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
        <PDFInstance 
          file={file} 
          title={title} 
          isModal={true}
          onClose={() => setIsFullScreen(false)}
        />
      </FullScreenPortal>
    </>
  );
}