import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    <nav className="fixed top-0 z-[1220] w-full border-b border-white/20 bg-white/40 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 max-w-7xl mx-auto relative">
        {/* Left section: Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
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
        </Link>
        
        {/* Center section: Navigation (Absolutely Centered) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 px-4">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors drop-shadow-sm">
            Home
          </Link>
          <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors drop-shadow-sm">
            About
          </Link>
          <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors drop-shadow-sm">
            Features
          </Link>
        </div>

        {/* Right section: Auth action */}
        <div className="flex items-center gap-4 shrink-0">
          <Link 
            href="#demo" 
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 bg-white/60 text-sm font-semibold text-[#1c402e] hover:bg-white hover:shadow-sm transition-all"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Demo
          </Link>
          <PublicAuthButton />
        </div>
      </div>
    </nav>
  );
}
