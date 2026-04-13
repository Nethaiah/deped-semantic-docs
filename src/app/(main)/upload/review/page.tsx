import { Suspense } from "react";
import { getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewPageClient from "@/components/upload/review-page-client";

async function ReviewContent() {
  const userRole = await getCurrentUserRole();
  if (!userRole?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      <ReviewPageClient />
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-8 h-8 rounded" />
        <div>
          <Skeleton className="w-48 h-6 rounded mb-1" />
          <Skeleton className="w-72 h-4 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[600px] rounded-lg" />
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ReviewSkeleton />}>
      <ReviewContent />
    </Suspense>
  );
}
