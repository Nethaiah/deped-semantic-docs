"use client";

import AdminDocuments from "@/components/admin/admin-page";
import UserDocuments from "@/components/user/user-page";
import { useUserRole } from "@/hooks/useUserRole";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DocumentsPage() {
  const { role, loading, error } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !role && !error) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [role, loading, error, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8"/>
      </div>
    );
  }

  return role === "admin" ? <AdminDocuments /> : <UserDocuments />;
}
