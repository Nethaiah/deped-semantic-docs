"use client";

import { useState, useRef } from "react";
import TableUpload from "@/components/upload/file-upload";
import { toast } from "sonner";
import { type FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Upload as UploadIcon,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { UploadApiService } from "@/lib/api/rag-api";

export default function UploadFile() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const clearFilesRef = useRef<(() => void) | null>(null);

  const resetForm = () => {
    clearFilesRef.current?.();
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsUploading(true);

    try {
      const fileItem = files[0];
      const file = fileItem.file as File;

      await UploadApiService.uploadThesis(file);

      toast.success(`Uploaded: ${file.name}`, {
        description:
          "Processing has started. Switch to the Status & Review tab to track progress.",
        duration: 5000,
        position: "bottom-right",
      });

      // Reset after successful upload
      setTimeout(() => {
        resetForm();
      }, 500);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Upload failed", {
        description: msg,
        duration: 8000,
        position: "bottom-right",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & helper text */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Upload Thesis Document
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload a thesis PDF. The AI will automatically extract the title,
          authors, abstract, and all metadata — no manual entry needed.
        </p>
      </div>

      {/* File upload UI */}
      <TableUpload
        accept=".pdf,application/pdf"
        multiple={false}
        maxFiles={1}
        maxSize={100 * 1024 * 1024}
        simulateUpload={false}
        disableDefaultFiles
        onFilesChange={setFiles}
        onClear={(clearFn) => {
          clearFilesRef.current = clearFn;
        }}
        className=""
      />

      {/* What happens next */}
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <UploadIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">
            What happens after you upload
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              1
            </Badge>
            <span>PDF is stored securely in cloud storage (Cloudflare R2).</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              2
            </Badge>
            <span>
              AI extracts text page-by-page using Gemini Vision (handles
              scanned documents).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              3
            </Badge>
            <span>
              Title, authors, department, keywords, and abstract are
              automatically detected.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              4
            </Badge>
            <span>
              You review the extracted text side-by-side with the PDF, make
              corrections, then approve.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              5
            </Badge>
            <span>
              EmbeddingGemma generates vector embeddings for AI-powered
              semantic search and Q&A.
            </span>
          </li>
        </ul>
      </div>

      {/* Submit/confirm */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          PDF only • Max 100MB • AI processing takes 2-5 minutes
        </p>
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Upload & Process
            </>
          )}
        </Button>
      </div>

      {/* Accessibility */}
      {files.length === 0 && (
        <div className="sr-only" aria-live="polite">
          No files selected
        </div>
      )}
    </div>
  );
}
