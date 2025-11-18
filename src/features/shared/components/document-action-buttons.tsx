"use client";

import { Eye, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBookmark } from "@/features/shared/server/toggle-bookmark";

type Props = {
  docId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (docId: string, bookmarked: boolean) => void;
};

export default function DocumentActionButtons({ docId, initialBookmarked = false, onBookmarkChange }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmarkToggle = () => {
    startTransition(async () => {
      const result = await toggleBookmark(docId);

      if (result.error) {
        toast.error(result.error, { duration: 5000, position: "bottom-right" });
      } else {
        setIsBookmarked(result.bookmarked || false);
        if (onBookmarkChange) {
          onBookmarkChange(docId, result.bookmarked || false);
        }
        toast.success(
          result.bookmarked
            ? "Document added to your bookmarks"
            : "Document removed from your bookmarks",
          { duration: 5000, position: "bottom-right" }
        );
      }
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/view/${docId}`;
    const shareText = "Check out this document";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Document Viewer",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user canceled or failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="flex flex-col items-end justify-between">
      <div className="flex items-center gap-2">
        {/* View Document */}
        <Link
          href={`/view/${docId}`}
          className="bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors"
          title="View document"
        >
          <Eye className="h-4 w-4" />
        </Link>

        {/* Bookmark Toggle */}
        <button
          onClick={handleBookmarkToggle}
          disabled={isPending}
          className={`bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isBookmarked ? "text-blue-600" : ""
          }`}
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
