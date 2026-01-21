"use client";

import { useState, useRef } from "react";
import TableUpload from "@/components/upload/file-upload";
import { toast } from "sonner";
import { type FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Upload as UploadIcon } from "lucide-react";

export default function UploadFile() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const clearFilesRef = useRef<(() => void) | null>(null);

  const handleSubmit = () => {
    // For now, we just show a confirmation. Hook this to a server action/API when ready.
    console.log('Files to upload:', files);
    toast.success("Files uploaded successfully!", { duration: 5000, position: "bottom-right" });
    setSubmitted(true);
    
    // Clear all files after successful upload
    setTimeout(() => {
      clearFilesRef.current?.();
      setFiles([]);
      setSubmitted(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Title & helper text */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Upload Document(s)</h2>
        <p className="text-sm text-muted-foreground">
          Choose one or multiple DepEd Orders or Memoranda in PDF or DOCX
          format, then confirm the upload.
        </p>
      </div>

      {/* Batch upload UI */}
      <TableUpload
        accept=".pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
        maxFiles={20}
        maxSize={50 * 1024 * 1024}
        simulateUpload
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
            <span>Text extraction with OCR for scanned PDFs.</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              2
            </Badge>
            <span>Cleaning to remove headers, footers, and noise.</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              3
            </Badge>
            <span>Metadata extraction (title, date, and related details).</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              4
            </Badge>
            <span>Store the extracted text and metadata in the database.</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="shrink-0">
              5
            </Badge>
            <span>
              Prepare for embeddings, categorization, and summarization.
            </span>
          </li>
        </ul>
      </div>

      {/* Submit/confirm */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          PDF or DOCX only. You can add up to 20 files per batch.
        </p>
        <Button onClick={handleSubmit} disabled={files.length === 0}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm upload
        </Button>
      </div>

      {/* If needed, surface errors to the user (placeholder) */}
      {files.length === 0 && (
        <div className="sr-only" aria-live="polite">No files selected</div>
      )}
    </div>
  );
}
