"use client";

import { Eye, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBookmark } from "@/server/bookmarks/toggle-bookmark";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ShareDialog from "./share-dialog";

type Props = {
  thesisId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (thesisId: string, bookmarked: boolean) => void;
};

export default function ThesisActionButtons({
  thesisId,
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
      const result = await toggleBookmark(thesisId);

      if (result.error) {
        toast.error(result.error, { duration: 5000, position: "bottom-right" });
      } else {
        setIsBookmarked(result.bookmarked || false);
        if (onBookmarkChange) {
          onBookmarkChange(thesisId, result.bookmarked || false);
        }
        toast.success(
          result.bookmarked
            ? "Thesis added to your bookmarks"
            : "Thesis removed from your bookmarks",
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
        <TooltipProvider delayDuration={150}>
          {/* View Thesis */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/view/${thesisId}`}
                className="bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View thesis</p>
            </TooltipContent>
          </Tooltip>

          {/* Bookmark Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleBookmarkToggle}
                disabled={isPending}
                className={`bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  isBookmarked ? "text-blue-600" : ""
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Share Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleShare}
                className="bg-slate-100 border border-gray-200 hover:bg-slate-200 text-slate-700 font-medium p-2 rounded-md flex items-center justify-center transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              Are you sure you want to remove this thesis from your bookmarks?
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
        docId={thesisId}
      />
    </div>
  );
}
