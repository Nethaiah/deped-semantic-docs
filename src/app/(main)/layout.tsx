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

import { Spinner } from "@/components/ui/spinner";

/* ── Skeleton fallback for the layout while auth resolves ── */
function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Spinner className="size-8 text-[#278fb6]" />
        <p className="text-sm font-medium">Validating session...</p>
      </div>
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
