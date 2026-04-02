import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { ThemeProvider } from "@/components/theme-context";
import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function MainLayout({
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
        <Sidebar>{children}</Sidebar>
      </SidebarProvider>
    </ThemeProvider>
  );
}
