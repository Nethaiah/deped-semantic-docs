"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2, MoreHorizontal, Copy, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  restoreThesis,
  deleteArchivedThesisPermanently,
} from "@/server/archive/mutations";
import type { ArchivedThesisRecord } from "@/server/archive/actions";

interface ArchiveActionsCellProps {
  record: ArchivedThesisRecord;
}

export function ArchiveActionsCell({ record }: ArchiveActionsCellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreThesis(record.id);
      if (result.success) {
        toast.success("Thesis restored successfully", {
          description: `"${record.title}" has been moved back to the active repository.`,
        });
        router.refresh();
      } else {
        toast.error("Failed to restore thesis", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreOpen(false);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteArchivedThesisPermanently(record.id);
      if (result.success) {
        toast.success("Thesis permanently deleted", {
          description: `"${record.title}" has been permanently removed.`,
        });
        router.refresh();
      } else {
        toast.error("Failed to delete thesis", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteOpen(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-gray-500">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(record.title)
            }
          >
            <Copy className="h-4 w-4" />
            Copy Title
          </DropdownMenuItem>
          {record.abstract && (
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(record.abstract!)
              }
            >
              <FileText className="h-4 w-4" />
              Copy Abstract
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer text-green-700 focus:text-green-700 focus:bg-green-50"
            onClick={() => setRestoreOpen(true)}
          >
            <RotateCcw className="h-4 w-4" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Restore Confirmation ── */}
      <AlertDialog open={restoreOpen} onOpenChange={setRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Thesis</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-semibold text-gray-900">
                &ldquo;{record.title}&rdquo;
              </span>
              ? It will be moved back to the active repository and become
              searchable again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? "Restoring…" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Permanently Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              This action is <span className="font-semibold text-red-600">irreversible</span>.
              The thesis{" "}
              <span className="font-semibold text-gray-900">
                &ldquo;{record.title}&rdquo;
              </span>{" "}
              and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting…" : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
