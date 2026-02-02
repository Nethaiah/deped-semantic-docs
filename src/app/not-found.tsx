"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NotFound() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleGoHome = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="inline-block px-6 py-3 bg-[#087830] text-white rounded-lg hover:bg-[#065a24] transition-colors font-medium cursor-pointer"
          >
            {isAuthenticated ? "Go to Dashboard" : "Go Home"}
          </button>
          {!isAuthenticated && (
            <div className="text-sm text-gray-500">
              Or try <Link href="/login" className="text-[#087830] hover:underline">logging in</Link>
            </div>
          )}
        </div>        
      </div>
    </div>
  );
}
