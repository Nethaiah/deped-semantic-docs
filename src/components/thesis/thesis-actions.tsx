"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Share2, FileDown, Archive } from "lucide-react";
import Link from "next/link";
import { toggleBookmark } from "@/server/bookmarks/toggle-bookmark";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ShareDialog from "@/components/shared/share-dialog";
import { RAGApiService } from "@/lib/api/rag-api";
import { useRouter } from "next/navigation";
import { archiveThesis } from "@/server/archive/mutations";
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
import { useTheme } from "@/components/theme-context";

type Props = {
  sourcePath?: string;
  thesisId: string;
  initialBookmarked?: boolean;
  isAdmin?: boolean;
};

export default function ThesisActions({ 
  sourcePath, 
  thesisId, 
  initialBookmarked = false,
  isAdmin = false,
}: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showUnbookmarkDialog, setShowUnbookmarkDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

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

  const handleConfirmArchive = () => {
    setShowArchiveDialog(false);
    startTransition(async () => {
      const result = await archiveThesis(thesisId, "Archived by admin from thesis view");
      if (result.success) {
        toast.success("Thesis Archived", {
          description: "This thesis has been moved to the archive.",
          duration: 5000,
        });
        router.push("/archive");
      } else {
        toast.error("Archive Failed", {
          description: result.error || "An unexpected error occurred.",
          duration: 5000,
        });
      }
    });
  };

  return (
    <>
      <Card className="rounded-xl border-gray-200 p-0 gap-0">
        <CardContent className="p-4 sm:p-5">
        <button 
          onClick={handleBookmarkToggle}
          disabled={isPending}
          className={`w-full mb-2 text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 ${!isBookmarked ? "text-slate-700" : ""} font-medium py-2.5 px-4 rounded-md flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          style={isBookmarked ? { color: theme.primary } : undefined}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} /> 
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        
        <button 
          onClick={handleShare} 
          className="w-full mb-2 text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-md flex items-center gap-3 transition-colors"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        
        {sourcePath && (
          <a
            href={RAGApiService.getDownloadPdfUrl(thesisId)} 
            className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-md flex items-center gap-3 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Download PDF
          </a>
        )}

        {isAdmin && (
          <button 
            onClick={() => setShowArchiveDialog(true)} 
            disabled={isPending}
            className="w-full mt-2 text-left bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 text-red-700 font-medium py-2.5 px-4 rounded-md flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Archive className="h-4 w-4" /> Archive Thesis
          </button>
        )}
      </CardContent>
    </Card>

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
              className={`${theme.primaryBgClass} ${theme.primaryHoverBgClass} focus:ring-gray-400 cursor-pointer`}
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

      {/* Archive Confirmation Dialog */}
      {isAdmin && (
        <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Thesis</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive this thesis? It will be removed from public search results and moved to the admin archive. You can restore it later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmArchive} 
                disabled={isPending} 
                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 cursor-pointer"
              >
                {isPending ? "Archiving..." : "Archive"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
