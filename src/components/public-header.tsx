import Image from "next/image";
import PublicAuthButton from "./public-auth-button";

/**
 * Dedicated header for the (public) layout.
 *
 * This is a SYNCHRONOUS server component — no async data fetching,
 * no Suspense needed. It renders instantly on the first byte.
 *
 * The only auth-dependent part (Log in / Back to Dashboard button)
 * is handled client-side by <PublicAuthButton />.
 */
export default function PublicHeader() {
  return (
    <nav className="fixed top-0 z-[1220] w-full border-b border-gray-200 bg-[#087830] backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Left section: Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="DocuLens Logo"
            width={32}
            height={32}
            className="object-contain"
            priority
            loading="eager"
          />
          <span className="text-base font-bold tracking-tight text-[#f3f3f3]">
            DocuLens
          </span>
        </div>

        {/* Right section: Auth action */}
        <div className="flex items-center gap-3 sm:gap-4">
          <PublicAuthButton />
        </div>
      </div>
    </nav>
  );
}
