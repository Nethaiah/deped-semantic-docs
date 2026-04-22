"use client";

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
  function refreshLandingPage() {
    if (window.scrollY > 12) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (window.location.pathname === "/" && window.location.hash === "") {
      window.location.reload();
      return;
    }

    window.location.assign("/");
  }

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav className="fixed top-0 z-[1220] w-full border-b border-[#b8dcc5] bg-[#dff3e6]">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Left section: Logo */}
        <button
          type="button"
          onClick={refreshLandingPage}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Image
            src="/newlogo.png"
            alt="DocuLens Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="text-xl font-black tracking-tighter text-[#123a29] drop-shadow-sm">
            DocuLens
          </span>
        </button>

        {/* Center section: Navigation (Absolutely Centered) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 px-4">
          <button
            type="button"
            onClick={refreshLandingPage}
            className="cursor-pointer text-sm font-medium text-[#123a29] transition-colors hover:text-[#0d2d20]"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="cursor-pointer text-sm font-medium text-[#123a29] transition-colors hover:text-[#0d2d20]"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="cursor-pointer text-sm font-medium text-[#123a29] transition-colors hover:text-[#0d2d20]"
          >
            Features
          </button>
        </div>

        {/* Right section: Auth action */}
        <div className="flex items-center gap-4 shrink-0">
          <PublicAuthButton />
        </div>
      </div>
    </nav>
  );
}
