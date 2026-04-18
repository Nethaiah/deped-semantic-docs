"use client";

import { Sparkles } from "lucide-react";
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
    <nav className="fixed top-0 z-[1220] w-full border-b border-white/20 bg-white/40 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 max-w-7xl mx-auto relative">
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
          <span className="text-xl font-black tracking-tighter text-[#1c402e] drop-shadow-sm uppercase">
            DocuLens
          </span>
        </button>

        {/* Center section: Navigation (Absolutely Centered) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 px-4">
          <button
            type="button"
            onClick={refreshLandingPage}
            className="text-sm font-medium text-gray-700 transition-colors drop-shadow-sm hover:text-gray-900 cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium text-gray-700 transition-colors drop-shadow-sm hover:text-gray-900 cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-gray-700 transition-colors drop-shadow-sm hover:text-gray-900 cursor-pointer"
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
