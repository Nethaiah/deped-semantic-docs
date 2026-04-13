import { Suspense } from "react";
import UploadPageClient from "@/components/upload/upload-page-client";
import { getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function UploadContent() {
  const userRole = await getCurrentUserRole();
  if (!userRole?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Upload Research Document
        </h1>
        <p className="text-sm text-gray-600">
          Submit theses to the repository. Upload a PDF, let the AI extract
          text, then review and approve before publishing.
        </p>
      </div>

      {/* Client-side tabbed content */}
      <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm">
        <UploadPageClient />
      </div>
    </div>
  );
}

function UploadSkeleton() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 lg:mb-8">
        <Skeleton className="w-64 h-8 rounded mb-2" />
        <Skeleton className="w-96 h-4 rounded" />
      </div>
      <Skeleton className="w-full h-96 rounded-lg" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<UploadSkeleton />}>
      <UploadContent />
    </Suspense>
  );
}
