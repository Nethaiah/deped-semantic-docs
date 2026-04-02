import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import { Skeleton } from "@/components/ui/skeleton";

async function RegisterContent() {
  const { isAuth } = await verifySession();
  if (isAuth) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}

function RegisterSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}
