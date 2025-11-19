"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to search page - state will be restored from sessionStorage
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}

