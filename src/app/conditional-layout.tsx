"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Toaster } from "sonner";
import type { User } from "@supabase/supabase-js";

// Auth pages that should not show Header or Sidebar
const authPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

type ConditionalLayoutProps = {
  children: React.ReactNode;
  user: User | null;
  role: string;
};

export default function ConditionalLayout({ children, user, role }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = authPages.some((page) => pathname?.includes(page));

  // Don't show Sidebar on auth pages, even if user is authenticated
  const shouldShowSidebar = user && !isAuthPage;

  return (
    <>
      {shouldShowSidebar ? (
        <Sidebar role={role}>
          {children}
          <Toaster />
        </Sidebar>
      ) : (
        <>
          {children}
          <Toaster />
        </>
      )}
    </>
  );
}

