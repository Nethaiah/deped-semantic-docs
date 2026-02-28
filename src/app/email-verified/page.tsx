import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EmailVerifiedPage({ searchParams }: { searchParams: Promise<{ verified?: string }> }) {
  const params = await searchParams;
  
  if (params?.verified !== "true") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-12 text-center">
        
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-50 text-[#087830] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Email Verified!
          </h1>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-[15px] mb-8 leading-relaxed px-2">
          Your account has been successfully verified. You are now securely logged into the LU Semantic Search system.
        </p>

        <div className="bg-blue-50 text-blue-800 text-sm font-medium px-4 py-3 rounded-lg mb-8 inline-block select-none">
          You can safely close this browser tab.
        </div>
      </div>
    </div>
  );
}
