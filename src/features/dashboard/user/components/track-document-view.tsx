"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackDocumentView } from "@/features/shared/server/track-document-view";

type Props = {
  documentId: string;
};

/**
 * Client component that tracks document views and refreshes the page cache
 * This ensures Recently Viewed updates immediately when navigating back
 */
export default function TrackDocumentView({ documentId }: Props) {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const track = async () => {
      try {
        await trackDocumentView(documentId);
        
        // Refresh the router cache so dashboard/homepage shows updated Recently Viewed
        if (isActive) {
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to track document view:", error);
      }
    };

    track();

    return () => {
      isActive = false;
    };
  }, [documentId, router]);

  // This component doesn't render anything
  return null;
}