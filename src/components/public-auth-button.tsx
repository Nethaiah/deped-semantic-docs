"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side auth button for the public header.
 *
 * Renders instantly with "Log in" by default, then checks
 * Supabase auth state on mount. If the user is already
 * authenticated it swaps to "Back to Dashboard".
 *
 * This avoids making the public header async (which would
 * require Suspense and cause the header bar to flash).
 */
export default function PublicAuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setIsAuthenticated(true);
    });
  }, []);

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
      >
        Back to Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full bg-[#1c402e] px-5 py-2 text-sm font-medium text-white hover:bg-[#1c402e]/95 transition-colors"
    >
      Log in
    </Link>
  );
}
