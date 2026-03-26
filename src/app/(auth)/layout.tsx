import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Back / Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#278fb6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo & App Name */}
        <div className="hidden sm:flex items-center gap-3 mb-2">
          <img
            src="/Logo.png"
            alt="Doculens Logo"
            className="w-10 h-10 object-contain invert"
          />
          <span className="text-xl font-bold text-gray-900">Doculens</span>
        </div>
        <p className="hidden sm:block text-center text-sm text-gray-500 mb-8">
          Process Smarter. Extract Faster. Understand More.
        </p>

        {children}
      </div>
    </div>
  );
}
