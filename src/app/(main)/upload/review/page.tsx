import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewPageClient from "@/components/upload/review-page-client";

function ReviewSkeleton() {
  return (
    <div className="p-4 md:p-5 lg:p-8 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md border flex items-center justify-center bg-transparent">
             {/* Simple visual placeholder for the back button */}
             <div className="w-4 h-4 bg-muted-foreground/30 mask mask-arrow-left" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Review Thesis Upload</h2>
            <p className="text-sm text-muted-foreground">
              Compare the PDF with extracted text and metadata, then approve or
              reject.
            </p>
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[500px] lg:h-[700px] rounded-lg" />
        <Skeleton className="h-[500px] lg:h-[700px] rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Review page — admin guard handled by `(admin)/layout.tsx`.
 *
 * Static shell renders instantly, ReviewPageClient hydrates independently.
 */
export default function ReviewPage() {
  return (
    <div className="p-4 md:p-5 lg:p-8 bg-gray-50 min-h-full">
      <Suspense fallback={<ReviewSkeleton />}>
        <ReviewPageClient />
      </Suspense>
    </div>
  );
}
