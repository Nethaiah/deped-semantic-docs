"use client";

import { usePathname } from "next/navigation";

// Auth pages that should not show Header
const authPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

type ConditionalHeaderProps = {
  children: React.ReactNode;
};

export default function ConditionalHeader({ children }: ConditionalHeaderProps) {
  const pathname = usePathname();
  const isAuthPage = authPages.some((page) => pathname?.includes(page));

  // Don't show Header on auth pages
  if (isAuthPage) {
    return null;
  }

  return <>{children}</>;
}

