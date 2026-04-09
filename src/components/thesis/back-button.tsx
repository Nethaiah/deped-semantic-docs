"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/components/theme-context";

export default function BackButton() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleBack = () => {
    // Navigate to search page - state will be restored from sessionStorage
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center gap-2 text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 border-gray-300 border-1 px-5 py-1 rounded-sm"
      style={{ color: theme.primary }}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}
