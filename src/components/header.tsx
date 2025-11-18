import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "./user-menu";
import NotificationDropdown from "./notification-dropdown";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Get role on the server to avoid client flash
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = userData?.role || "user";

  // Determine header background color based on role
  const headerBgColor = role === "admin" ? "bg-[#008c8b]" : "bg-[#278fb6]";

  const containerClass = isAuthenticated
    ? "flex items-center justify-between px-6 py-4"
    : "mx-auto flex max-w-5xl items-center justify-between px-6 py-3";

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-gray-200 ${headerBgColor} backdrop-blur-sm`}
    >
      <div className={containerClass}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="DocuLens Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-[#f3f3f3]">
            DocuLens
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notification Dropdown */}
              <NotificationDropdown />

              <UserMenu
                name={user.user_metadata.full_name}
                email={user.user_metadata.email}
                image={user.user_metadata.avatar_url}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white hover:text-gray-100 transition"
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
