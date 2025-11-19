"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to search page - state will be restored from sessionStorage
    router.push("/search");
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center gap-2 text-sm text-[#278fb6] cursor-pointer bg-gray-200 hover:bg-gray-300 border-gray-300 border-1 px-5 py-1 rounded-sm"
    >
      <ChevronLeft className="h-4 w-4 text-[#278fb6]" />
      Back
    </button>
  );
}
