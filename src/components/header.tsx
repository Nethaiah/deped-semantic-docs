"use client";

import Link from "next/link";
import { Network } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import UserMenu from "./user-menu";
import { Spinner } from "@/components/ui/spinner";

export default function Header() {
  const { role, loading } = useUserRole();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Network className="h-7 w-7 text-indigo-600" />
            <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400"></div>
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Naninani〜
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          { loading ? (
            <Spinner />
          ) : role ? (
            // User is authenticated - show user menu
            <UserMenu />
          ) : (
            // User is not authenticated - show auth links
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
              >
                Try it free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
