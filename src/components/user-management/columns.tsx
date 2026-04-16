"use client";

import { ColumnDef, type Table } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Check, X, Copy, ShieldCheck, User, Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { updateUserRole } from "@/server/user-management/update-user-role";

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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/components/theme-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type UserStatus = "pending" | "approved" | "rejected";
export type UserRole = "admin" | "user";

import type { UserRecord } from "@/server/user-management/get-users";
export type { UserRecord };

const statusConfig: Record<
  UserStatus,
  { label: string; variant: "warning" | "success" | "destructive"; appearance: "light" }
> = {
  pending: { label: "Pending", variant: "warning", appearance: "light" },
  approved: { label: "Approved", variant: "success", appearance: "light" },
  rejected: { label: "Rejected", variant: "destructive", appearance: "light" },
};

function RoleCell({ row }: { row: { original: UserRecord } }) {
  const originalRole = row.original.role as UserRole;
  const [role, setRole] = useState<UserRole>(originalRole);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRoleChange = (val: UserRole) => {
    if (val === role) return;
    setPendingRole(val);
    setDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (!pendingRole) return;
    const targetRole = pendingRole;
    
    setRole(targetRole);
    startTransition(async () => {
      const result = await updateUserRole({ userId: row.original.id, role: targetRole });
      if (result.error) {
        toast.error(result.error);
        setRole(originalRole); // Revert on failure
      } else {
        toast.success(`Role updated successfully to ${targetRole}`);
      }
    });
  };

  const cancelRoleChange = () => {
    setPendingRole(null);
  };

  return (
    <>
      <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
        <SelectTrigger size="sm" className="w-[110px] border-gray-200 text-xs">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin text-gray-500" />
              <span className="text-gray-500">Updating...</span>
            </div>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-gray-500" />
              User
            </span>
          </SelectItem>
          <SelectItem value="admin">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#008c8b]" />
              Admin
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) cancelRoleChange();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s role to <strong>{pendingRole}</strong>?
              {pendingRole === "admin" && " This will grant them full administrative access to DocuLens."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} className="bg-[#008c8b] hover:bg-[#008c8b]/90 border-none text-white">
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ThemedCheckbox({
  checked,
  onCheckedChange,
  ariaLabel,
  disabled,
}: {
  checked: boolean | "indeterminate";
  onCheckedChange: (value: boolean | "indeterminate") => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  const isChecked = checked === true || checked === "indeterminate";
  
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${isChecked && !disabled ? "border-transparent" : "border-gray-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={
        isChecked && !disabled
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : undefined
      }
    />
  );
}

// ── Select-all header (extracted to avoid state reads during render) ────────

function SelectAllHeader({ table }: { table: Table<UserRecord> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const checked = mounted
    ? table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    : false;

  return (
    <ThemedCheckbox
      checked={checked}
      onCheckedChange={(value: boolean | "indeterminate") =>
        table.toggleAllPageRowsSelected(!!value)
      }
      ariaLabel="Select all"
    />
  );
}

export const columns: ColumnDef<UserRecord>[] = [
  // ── Row Selection ────────────────────────────────────────────────────────────
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => (
      <ThemedCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        disabled={!row.getCanSelect()}
        ariaLabel="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ── Student ID ───────────────────────────────────────────────────────────
  {
    accessorKey: "student_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student ID
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-gray-800">
        {row.getValue("student_id") || "—"}
      </span>
    ),
  },

  // ── Full Name ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">{row.getValue("full_name") || "—"}</span>
    ),
  },

  // ── Email ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.getValue("email") || "—"}</span>
    ),
  },

  // ── Role ─────────────────────────────────────────────────────────────────────
  {
    accessorKey: "role",
    header: () => (
      <span className="text-xs font-semibold text-gray-600">Role</span>
    ),
    cell: ({ row }) => <RoleCell row={row} />,
    enableSorting: false,
  },

  // ── Status ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      const cfg = statusConfig[status];
      return (
        <Badge variant={cfg.variant} appearance={cfg.appearance} size="md" shape="circle">
          {cfg.label}
        </Badge>
      );
    },
  },

  // ── Created At ───────────────────────────────────────────────────────────────
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Joined
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      if (!date) return <span className="text-sm text-gray-400">—</span>;
      return (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  // ── Actions ──────────────────────────────────────────────────────────────────
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;
      // Access the onAction callback from table meta
      const meta = table.options.meta as { onAction?: (userIds: string[], status: "approved" | "rejected") => void } | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-gray-500">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer text-green-700 focus:text-green-700 focus:bg-green-50"
              onClick={() => meta?.onAction?.([user.id], "approved")}
            >
              <Check className="h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => meta?.onAction?.([user.id], "rejected")}
            >
              <X className="h-4 w-4" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer"
              onClick={() => navigator.clipboard.writeText(user.email || "")}
            >
              <Copy className="h-4 w-4" />
              Copy Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
