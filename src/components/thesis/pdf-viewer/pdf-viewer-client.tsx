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
// 2. Custom Portal (Modal)
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
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------------------------------
// 3. The Viewer Component
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
  const [documentKey] = useState(() => `${file}-${Date.now()}`);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy().catch(() => {});
        pdfDocRef.current = null;
      }
    };
  }, []);

  // Measure Width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width - 40);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isModal]);

  // Scroll Observer
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.getAttribute("data-page-number") || "1");
          setCurrentPage(pageNum);
        }
      });
    }, options);

    const pages = document.querySelectorAll(`[data-instance-id="${isModal ? 'modal' : 'preview'}"] .pdf-page-wrapper`);
    pages.forEach((page) => observerRef.current?.observe(page));
  }, [numPages, isModal]);

  useEffect(() => {
    if (numPages > 0) setTimeout(setupIntersectionObserver, 500);
    return () => observerRef.current?.disconnect();
  }, [numPages, setupIntersectionObserver]);

  // Scroll to Page
  const scrollToPage = (pageNumber: number) => {
    const targetPage = pageNumber;
    if (targetPage < 1 || targetPage > numPages) return;

    const pageId = `pdf-page-${isModal ? 'modal' : 'preview'}-${targetPage}`;
    const element = document.getElementById(pageId);
    const container = containerRef.current;
    
    if (element && container) {
        const topPos = element.offsetTop - 24; 
        container.scrollTo({ top: topPos, behavior: 'smooth' });
        setCurrentPage(targetPage);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${isModal ? 'overflow-hidden' : ''}`} data-instance-id={isModal ? 'modal' : 'preview'}>
      
      {/* --- TOOLBAR --- */}
      {/* 
          LAYOUT LOGIC:
          - If Modal: Use 'sm:flex-row' to go side-by-side on desktop.
          - If Preview: ALWAYS use 'flex-col' to Stack (Title Top, Buttons Bottom) so title doesn't crush.
      */}
      <div className={`
        flex gap-3 p-3 border-b bg-white z-10 shadow-sm shrink-0
        ${isModal ? 'flex-col sm:flex-row sm:items-center justify-between' : 'flex-col justify-start'}
      `}>
        
        {/* Title Section */}
        <div className={`min-w-0 ${isModal ? 'flex-1 mr-4' : 'w-full mb-1'}`} title={title}>
            <p className="text-sm font-semibold text-gray-700 leading-snug whitespace-normal break-words">
              {title || "Untitled Document"}
            </p>
        </div>
        
        {/* Controls Section */}
        <div className={`flex items-center gap-2 flex-wrap shrink-0 ${!isModal ? 'justify-between w-full' : ''}`}>
          
          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600"/>
            </button>
            <div className="flex items-center justify-center min-w-[3.5rem] px-2 h-8 border border-gray-200 rounded-md bg-gray-50">
              <span className="text-xs text-gray-600 font-medium whitespace-nowrap"> 
                <span className="text-gray-900">{currentPage}</span> / {numPages || "-"}
              </span>
            </div>
            <button
              onClick={() => scrollToPage(currentPage + 1)}
              disabled={numPages === 0 || currentPage >= numPages}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600"/>
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center justify-center w-12 h-8 border border-gray-200 rounded-md bg-gray-50">
               <span className="text-xs text-gray-700 font-medium">{Math.round(scale * 100)}%</span>
            </div>
            <button
              onClick={() => setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Hide Reset button on small Preview cards to save space if needed, otherwise keep it */}
            <button
              onClick={() => setScale(1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Actions */}
          {(onMaximize || onClose) && (
            <>
               <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
               <div className="flex items-center gap-1">
                  {onMaximize && (
                      <button
                        onClick={onMaximize}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600"
                        title="Full Screen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                  )}
                  {onClose && (
                      <button
                        onClick={onClose}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                  )}
               </div>
            </>
          )}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden p-0 bg-gray-50 relative">
        <div ref={containerRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4">
           <Document
              key={documentKey}
              file={file}
              onLoadSuccess={(pdf) => {
                pdfDocRef.current = pdf;
                setNumPages(pdf.numPages);
              }}
              loading={
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400 gap-2">
                   <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                   <span className="text-sm">Loading PDF...</span>
                </div>
              }
              error={
                <div className="mt-20 text-red-500 font-medium text-sm text-center">Unable to load document.</div>
              }
              className="flex flex-col items-center gap-6"
           >
              {Array.from(new Array(numPages), (el, index) => (
                <div 
                    key={`page_${index + 1}`}
                    id={`pdf-page-${isModal ? 'modal' : 'preview'}-${index + 1}`}
                    data-page-number={index + 1}
                    className="pdf-page-wrapper shadow-lg"
                >
                    <Page 
                        pageNumber={index + 1} 
                        width={isModal && containerWidth ? containerWidth : undefined}
                        scale={isModal ? undefined : scale} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="bg-white"
                        loading={
                            <div className="bg-white h-[600px] w-full flex items-center justify-center text-gray-300">
                                <Loader2 className="h-8 w-8 animate-spin" />
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
      <PDFInstance 
        file={file} 
        title={title} 
        initialScale={initialScale} 
        onMaximize={() => setIsFullScreen(true)}
      />

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