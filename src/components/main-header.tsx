import Image from "next/image";
import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { getThemeForRole } from "@/lib/theme-config";
import UserMenu from "./user-menu";
import MobileMenuButton from "./mobile-header";

/**
 * Dedicated header for the (main) layout.
 *
 * This is an async Server Component that fetches auth + role data.
 * It lives in its OWN <Suspense> boundary in the layout, so it
 * never unmounts when the content area re-suspends.
 */
export default async function MainHeader() {
  const session = await verifySession();
  const user = session.user;

  const userRole = await getCurrentUserRole();
  const role = userRole?.role || "user";
  const theme = getThemeForRole(role);

  return (
    <nav
      className={`fixed top-0 z-[1220] w-full border-b border-gray-200 ${theme.primaryBgClass} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Left section: Hamburger (mobile) + Logo (desktop) */}
        <div className="flex items-center gap-2">
          <MobileMenuButton />
          <div className="hidden lg:flex items-center gap-2">
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

        {/* Center section: Logo (mobile only) */}
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

        {/* Right section: User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <UserMenu
            name={userRole?.fullName}
            email={user!.user_metadata.email}
            image={user!.user_metadata.avatar_url}
          />
        </div>
      </div>
    </nav>
  );
}
