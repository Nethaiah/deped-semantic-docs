import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/reset-password";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function ResetPasswordContent() {
  // Check if user has a valid session (from password reset link)
  const { isAuth } = await verifySession();

  // If no user, redirect to forgot-password page
  // User needs to click the reset link in their email first
  if (!isAuth) {
    redirect("/forgot-password");
  }

  // If user exists, they came from the reset link - show the form
  return <ResetPasswordForm />;
}

function ResetSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}