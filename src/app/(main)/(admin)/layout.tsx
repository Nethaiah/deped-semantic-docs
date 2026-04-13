import { getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";

/**
 * Shared admin layout — checks admin role once for all admin routes.
 *
 * Since `getCurrentUserRole()` uses React `cache()`, and the parent
 * `(main)/layout.tsx` already calls it, this is essentially free
 * (no extra DB call within the same request).
 *
 * Route group `(admin)` does NOT add a URL segment, so URLs remain:
 * /upload, /user-management, /archive
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getCurrentUserRole();
  if (!userRole?.isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
