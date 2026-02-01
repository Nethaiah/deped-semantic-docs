"use client";

import { Bookmark, Share2, FileDown } from "lucide-react";
import Link from "next/link";
import { toggleBookmark } from "@/server/bookmarks/toggle-bookmark";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ShareDialog from "@/components/shared/share-dialog";
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

type Props = {
  sourcePath?: string;
  thesisId: string;
  initialBookmarked?: boolean;
};

export default function ThesisActions({ 
  sourcePath, 
  thesisId, 
  initialBookmarked = false 
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showUnbookmarkDialog, setShowUnbookmarkDialog] = useState(false);

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
    <>
      <div className="mt-6 border-t pt-4 space-y-2">
        <button 
          onClick={handleBookmarkToggle}
          disabled={isPending}
          className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} /> 
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        
        <button 
          onClick={handleShare} 
          className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        
        {sourcePath && (
          <Link
            href={sourcePath} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Download PDF
          </Link>
        )}
      </div>

      {/* Unbookmark Confirmation Dialog */}
      <AlertDialog open={showUnbookmarkDialog} onOpenChange={setShowUnbookmarkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this thesis from your bookmarks? 
              You can always bookmark it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
    </>
  );
}
