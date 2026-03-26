import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileQuestion, Home, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotFound() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-md w-full border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        <CardContent className="p-8 sm:p-10 text-center flex flex-col items-center">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <FileQuestion className="h-10 w-10 text-theme" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-[280px]">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          <div className="w-full flex flex-col gap-3">
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-theme text-white rounded-xl hover:bg-[#065a24] transition-all font-semibold shadow-sm focus:ring-2 focus:ring-theme focus:ring-offset-1"
            >
              {user ? (
                <>
                  <LayoutDashboard className="h-5 w-5" />
                  Return to Dashboard
                </>
              ) : (
                <>
                  <Home className="h-5 w-5" />
                  Return Home
                </>
              )}
            </Link>

            {!user && (
              <div className="text-sm font-medium text-gray-500 mt-2">
                Have an account?{" "}
                <Link href="/login" className="text-theme hover:text-[#065a24] hover:underline transition-colors">
                  Log in here
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
