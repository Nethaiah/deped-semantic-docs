"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackThesisView } from "@/server/theses/track-thesis-view";

type Props = {
  thesisId: string;
};

/**
 * Client component that tracks thesis views and refreshes the page cache
 * This ensures Recently Viewed updates immediately when navigating back
 */
export default function TrackThesisView({ thesisId }: Props) {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const track = async () => {
      try {
        await trackThesisView(thesisId);
        
        // Refresh the router cache so dashboard/homepage shows updated Recently Viewed
        if (isActive) {
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to track thesis view:", error);
      }
    };

    track();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesisId]); // router is intentionally omitted - it's stable and including it causes infinite refresh loop

  // This component doesn't render anything
  return null;
}
