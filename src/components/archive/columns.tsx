"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TruncatedText } from "@/components/ui/truncated-text";
import { ArchiveActionsCell } from "./archive-actions-cell";
import type { ArchivedThesisRecord } from "@/server/archive/actions";
import { useTheme } from "@/components/theme-context";

// ── Helper ──────────────────────────────────────────────────────────────────

function ThemedCheckbox({
  checked,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean | "indeterminate";
  onCheckedChange: (value: boolean | "indeterminate") => void;
  ariaLabel: string;
}) {
  const { theme } = useTheme();
  const isChecked = checked === true || checked === "indeterminate";
  
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
      className={isChecked ? "border-transparent" : "border-gray-300"}
      style={
        isChecked
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : undefined
      }
    />
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Column Definitions ──────────────────────────────────────────────────────

export const archiveColumns: ColumnDef<ArchivedThesisRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <ThemedCheckbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value)
        }
        ariaLabel="Select all"
      />
    ),
    cell: ({ row }) => (
      <ThemedCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") =>
          row.toggleSelected(!!value)
        }
        ariaLabel="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ── Title ──
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <TruncatedText 
          text={row.getValue("title")} 
          className="text-sm font-normal text-gray-900 line-clamp-2 text-left" 
        />
      </div>
    ),
  },

  // ── Authors ──
  {
    accessorKey: "authors",
    header: () => (
      <span className="text-xs font-semibold text-gray-600">Authors</span>
    ),
    cell: ({ row }) => {
      const authors = row.getValue("authors") as string[] | null;
      const display = authors?.join(", ") || "—";
      return (
        <span className="text-sm text-gray-700 line-clamp-1 max-w-[200px] block">
          {display}
        </span>
      );
    },
    enableSorting: false,
  },

  // ── College ──
  {
    accessorKey: "college",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        College
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {row.getValue("college") || "—"}
      </span>
    ),
  },

  // ── Year ──
  {
    accessorKey: "year",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-mono text-gray-800">
        {row.getValue("year") ?? "—"}
      </span>
    ),
  },

  // ── Archived At ──
  {
    accessorKey: "archived_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Archived On
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {formatDate(row.getValue("archived_at"))}
      </span>
    ),
  },

  // ── Reason ──
  {
    accessorKey: "archive_reason",
    header: () => (
      <span className="text-xs font-semibold text-gray-600">Reason</span>
    ),
    cell: ({ row }) => {
      const reason = row.getValue("archive_reason") as string | null;
      return (
        <span className="text-sm text-gray-500 italic line-clamp-1 max-w-[150px] block">
          {reason || "—"}
        </span>
      );
    },
    enableSorting: false,
  },

  // ── Actions ──
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ArchiveActionsCell record={row.original} />,
  },
];
