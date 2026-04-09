import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { getThemeForRole } from "@/lib/theme-config";
import UserMenu from "./user-menu";
import NotificationDropdown from "./notification-dropdown";
import MobileMenuButton from "./mobile-header";

interface HeaderProps {
  variant?: "main" | "public";
}

export default async function Header({ variant = "public" }: HeaderProps) {
  const session = await verifySession();
  const isAuthenticated = session.isAuth;
  const user = session.user;

  const isMain = variant === "main";

  // Cached — won't trigger a second DB call if layout already called it
  const userRole = await getCurrentUserRole();
  const role = userRole?.role || "user";
  const theme = getThemeForRole(role);
  const headerBgColor = isMain ? theme.primaryBgClass : "bg-[#087830]";

  return (
    <nav
      className={`fixed top-0 z-[1220] w-full border-b border-gray-200 ${headerBgColor} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Left section: Hamburger (mobile) + Logo (desktop) */}
        <div className="flex items-center gap-2">
          {/* Hamburger - only visible on mobile when in main layout */}
          {isAuthenticated && isMain && <MobileMenuButton />}

          {/* Logo - visible on desktop always, visible on mobile ONLY if not in main layout */}
          <div className={`${isAuthenticated && isMain ? 'hidden lg:flex' : 'flex'} items-center gap-2`}>
            <Image
              src="/Logo.png"
              alt="DocuLens Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="text-base font-bold tracking-tight text-[#f3f3f3]">
              DocuLens
            </span>
          </div>
        </div>

        {/* Center section: Logo (mobile only, only in main layout) */}
        {isAuthenticated && isMain && (
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Image
              src="/Logo.png"
              alt="DocuLens Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
            <span className="text-base font-bold tracking-tight text-[#f3f3f3]">
              DocuLens
            </span>
          </div>
        )}

        {/* Right section: Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer">
          {isMain && isAuthenticated ? (
            <>
              {/* <NotificationDropdown /> */}
              <UserMenu
                name={userRole?.fullName}
                email={user!.user_metadata.email}
                image={user!.user_metadata.avatar_url}
              />
            </>
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-[#333] hover:bg-gray-200 transition"
            >
              Back to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#333] hover:bg-gray-200 transition"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}