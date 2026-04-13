import { Suspense } from "react";
import UploadForm from "@/components/upload/upload-file";
import { Skeleton } from "@/components/ui/skeleton";

function UploadFormSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-full h-10 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-48 h-4 rounded" />
        <Skeleton className="w-full h-40 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-full h-10 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-28 h-4 rounded" />
          <Skeleton className="w-full h-10 rounded" />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Skeleton className="w-32 h-10 rounded" />
      </div>
    </div>
  );
}

/**
 * Upload page — admin guard handled by `(admin)/layout.tsx`.
 *
 * Static header renders instantly (synchronous default export).
 * The form section is client-side, so it hydrates independently.
 */
export default function UploadPage() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section — static, renders instantly */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Upload Research Document</h1>
        <p className="text-sm text-gray-600">
          Submit theses, IMRADS, or abstracts to the RDC repository for indexing and semantic search.
        </p>
      </div>

      {/* Form Section */}
      <Suspense fallback={<UploadFormSkeleton />}>
        <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm">
          <UploadForm />
        </div>
      </Suspense>
    </div>
  );
}
