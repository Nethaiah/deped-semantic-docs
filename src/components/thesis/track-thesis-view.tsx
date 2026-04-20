"use client";

import { useEffect } from "react";
import { trackThesisView } from "@/server/theses/track-thesis-view";

type Props = {
  thesisId: string;
};

/**
 * Client component that tracks thesis views.
 * Avoid forcing a router refresh here because it can invalidate preserved
 * route state and cause a visible scroll jump when navigating back.
 */
export default function TrackThesisView({ thesisId }: Props) {
  useEffect(() => {
    let isActive = true;

    const track = async () => {
      try {
        await trackThesisView(thesisId);
      } catch (error) {
        if (isActive) {
          console.error("Failed to track thesis view:", error);
        }
      }
    };

    track();

    return () => {
      isActive = false;
    };
  }, [thesisId]);

  // This component doesn't render anything
  return null;
}
