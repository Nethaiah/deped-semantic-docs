"use client";

import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "@/components/theme-context";

export default function MainLoading() {
  const { theme } = useTheme();
  
  return (
    <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-muted-foreground animate-in fade-in duration-300">
        {/* Using the user's primary theme color for the spinner if available */}
        <Spinner className={`size-8 ${theme.primaryTextClass || 'text-[#278fb6]'}`} />
        <p className="text-sm font-medium">Loading content...</p>
      </div>
    </div>
  );
}
