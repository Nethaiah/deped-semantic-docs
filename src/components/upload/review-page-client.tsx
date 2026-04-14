"use client";

import { useSearchParams } from "next/navigation";
import UploadReview from "@/components/upload/upload-review";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReviewPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uploadId = searchParams.get("id");

  if (!uploadId) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-3" />
        <p className="text-sm text-destructive mb-1 font-medium">
          Missing upload ID
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          No upload ID was provided in the URL. Please select an upload to
          review from the status page.
        </p>
        <Button variant="outline" onClick={() => router.push("/upload")}>
          Back to Uploads
        </Button>
      </div>
    );
  }

  return <UploadReview uploadId={uploadId} />;
}