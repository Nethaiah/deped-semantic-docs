import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { getThemeForRole } from "@/lib/theme-config";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userData?.role || "user";
  const theme = getThemeForRole(role);

  return (
    <div style={{ "--theme-color": theme.primary } as React.CSSProperties} className="h-full">
      <SidebarProvider>
        <Header showMobileMenu={true} />
        <Sidebar role={role}>{children}</Sidebar>
      </SidebarProvider>
    </div>
  );
}
