import { Suspense } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { ThemeProvider } from "@/components/theme-context";
import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";

import { PageTransition } from "@/components/page-transition";
import { Skeleton } from "@/components/ui/skeleton";

/* ── Async layout shell that needs auth data ── */
async function AuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session.isAuth) {
    redirect("/login");
  }

  const userRole = await getCurrentUserRole();
  const role = userRole?.role || "user";

  return (
    <ThemeProvider role={role}>
      <SidebarProvider>
        <Header variant="main" />
        <Sidebar>
          <PageTransition>
            {children}
          </PageTransition>
        </Sidebar>
      </SidebarProvider>
    </ThemeProvider>
  );
}

/* ── Skeleton fallback for the layout while auth resolves ── */
function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header placeholder */}
      <div className="fixed top-0 z-[1220] w-full h-12 bg-muted border-b border-gray-200" />
      {/* Content area placeholder */}
      <div className="pt-12" />
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  );
}
