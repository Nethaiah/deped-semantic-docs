import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import MainHeader from "@/components/main-header";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { ThemeProvider } from "@/components/theme-context";
import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";

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

/* ── Async content shell that needs auth data ── */
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
        <MainHeader />
        <Sidebar>
          {children}
        </Sidebar>
      </SidebarProvider>
    </ThemeProvider>
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
