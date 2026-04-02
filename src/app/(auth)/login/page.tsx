import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import LoginForm from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function LoginContent({ searchParams }: { searchParams: Promise<{ auth_error?: string }> }) {
  const params = await searchParams;

  if (params?.auth_error) {
    throw new Error(decodeURIComponent(params.auth_error));
  }

  const { isAuth } = await verifySession();
  if (isAuth) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export default function Login({ searchParams }: { searchParams: Promise<{ auth_error?: string }> }) {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}