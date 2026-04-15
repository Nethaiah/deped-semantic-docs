"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import {
  pageNavigationPlugin,
} from "@react-pdf-viewer/page-navigation";

import {
  zoomPlugin,
} from "@react-pdf-viewer/zoom";

import {
  Maximize,
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import "@react-pdf-viewer/core/lib/styles/index.css";

// Worker (same as yours)
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type PDFViewerClientProps = {
  file: string;
  title?: string;
};

type PDFInstanceProps = {
  file: string;
  title?: string;
  onMaximize?: () => void;
  onClose?: () => void;
  isModal?: boolean;
};

// ---------------------------------------------------------------------------
// FULLSCREEN MODAL (UNCHANGED BEHAVIOR)
// ---------------------------------------------------------------------------

const FullScreenPortal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

// ---------------------------------------------------------------------------
// PDF INSTANCE (CUSTOM TOOLBAR + VIEWER)
// ---------------------------------------------------------------------------

function PDFInstance({
  file,
  title,
  onMaximize,
  onClose,
  isModal = false,
}: PDFInstanceProps) {
  // Plugins (logic only)
  const pageNav = pageNavigationPlugin();
  const zoom = zoomPlugin();

  const {
    GoToPreviousPage,
    GoToNextPage,
    CurrentPageLabel,
    NumberOfPages,
  } = pageNav;

  const { ZoomIn, ZoomOut, Zoom } = zoom;

  return (
    <Worker workerUrl={WORKER_URL}>
      <div className="flex flex-col h-full bg-white">
        
        {/* ---------------- TOOLBAR ---------------- */}
        <div
          className={`
            flex gap-3 p-3 border-b bg-white shadow-sm shrink-0
            ${isModal ? "flex-col sm:flex-row sm:items-center justify-between" : "flex-col"}
          `}
        >
          {/* TITLE */}
          <div className={`min-w-0 ${isModal ? "flex-1 mr-4" : "w-full"}`}>
            <p className="text-sm font-semibold text-gray-700 break-words">
              {title || "Untitled Document"}
            </p>
          </div>

          {/* CONTROLS */}
          <div
            className={`flex items-center gap-2 flex-wrap ${
              !isModal ? "justify-between w-full" : ""
            }`}
          >
            {/* PAGINATION */}
            <div className="flex items-center gap-1">
              <button className="btn">
                <GoToPreviousPage>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(props: any) => (
                    <ChevronLeft
                      onClick={props.onClick}
                      className="w-4 h-4 text-gray-600 cursor-pointer"
                    />
                  )}
                </GoToPreviousPage>
              </button>

              <div className="flex items-center justify-center min-w-[3.5rem] px-2 h-8 border border-gray-200 rounded-md bg-gray-50">
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  <CurrentPageLabel /> / <NumberOfPages />
                </span>
              </div>

              <button className="btn">
                <GoToNextPage>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(props: any) => (
                    <ChevronRight
                      onClick={props.onClick}
                      className="w-4 h-4 text-gray-600 cursor-pointer"
                    />
                  )}
                </GoToNextPage>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />

            {/* ZOOM */}
            <div className="flex items-center gap-1">
              <ZoomOut>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(props: any) => (
                  <button className="btn" onClick={props.onClick}>
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </ZoomOut>

              <div className="flex items-center justify-center w-12 h-8 border rounded bg-gray-50">
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  <Zoom>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(props: any) => <>{Math.round(props.scale * 100)}%</>}
                  </Zoom>
                </span>
              </div>

              <ZoomIn>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(props: any) => (
                  <button className="btn" onClick={props.onClick}>
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </ZoomIn>
            </div>

            {/* ACTIONS */}
            {(onMaximize || onClose) && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
                <div className="flex items-center gap-1">
                  {onMaximize && (
                    <button
                      onClick={onMaximize}
                      className="btn"
                      title="Full Screen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  )}

                  {onClose && (
                    <button
                      onClick={onClose}
                      className="btn hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------------- VIEWER ---------------- */}
        <div className="flex-1 bg-gray-50 overflow-hidden">
          <Viewer
            key={file}
            fileUrl={file}
            plugins={[pageNav, zoom]}
          />
        </div>
      </div>
    </Worker>
  );
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export default function PDFViewerClient({
  file,
  title,
}: PDFViewerClientProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <PDFInstance
        file={file}
        title={title}
        onMaximize={() => setIsFullScreen(true)}
      />

      <FullScreenPortal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      >
        <PDFInstance
          file={file}
          title={title}
          isModal
          onClose={() => setIsFullScreen(false)}
        />
      </FullScreenPortal>
    </>
  );
}

// ---------------------------------------------------------------------------
// SHARED BUTTON STYLE (TAILWIND)
// ---------------------------------------------------------------------------

const styles = `
.btn {
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}
.btn:hover {
  background: #f3f4f6;
}
`;