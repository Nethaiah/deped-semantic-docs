"use client";

import { Eye, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBookmark } from "@/features/shared/server/toggle-bookmark";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ShareDialog from "./share-dialog";

type Props = {
  docId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (docId: string, bookmarked: boolean) => void;
};

export default function DocumentActionButtons({
  docId,
  initialBookmarked = false,
  onBookmarkChange,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [showUnbookmarkDialog, setShowUnbookmarkDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      setShowUnbookmarkDialog(true);
      return;
    }
    performBookmarkToggle();
  };

  const performBookmarkToggle = () => {
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

  const handleConfirmUnbookmark = () => {
    setShowUnbookmarkDialog(false);
    performBookmarkToggle();
  };

  const handleShare = () => {
    setShowShareDialog(true);
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
          className={`bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isBookmarked ? "text-blue-600" : ""
          }`}
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors cursor-pointer"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Unbookmark Confirmation Dialog */}
      <AlertDialog
        open={showUnbookmarkDialog}
        onOpenChange={setShowUnbookmarkDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this document from your bookmarks?
              You can always bookmark it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUnbookmark}
              disabled={isPending}
              className="bg-[#278fb6] hover:bg-[#278fb6] focus:ring-[#278fb6] cursor-pointer"
            >
              {isPending ? "Removing..." : "Remove Bookmark"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        docId={docId}
      />
    </div>
  );
}
