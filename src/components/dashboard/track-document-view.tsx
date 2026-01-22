"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackDocumentView } from "@/server/documents/track-document-view";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]); // router is intentionally omitted - it's stable and including it causes infinite refresh loop

  // This component doesn't render anything
  return null;
}