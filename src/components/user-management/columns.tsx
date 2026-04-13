"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Check, X, Copy, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

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

export type UserRecord = {
  id: string;
  studentNumber: string;
  username: string;
  email: string;
  role: UserRole;
  college: string;
  status: UserStatus;
};

const statusConfig: Record<
  UserStatus,
  { label: string; variant: "warning" | "success" | "destructive"; appearance: "light" }
> = {
  pending: { label: "Pending", variant: "warning", appearance: "light" },
  approved: { label: "Approved", variant: "success", appearance: "light" },
  rejected: { label: "Rejected", variant: "destructive", appearance: "light" },
};

function RoleCell({ row }: { row: { original: UserRecord } }) {
  const [role, setRole] = useState<UserRole>(row.original.role);

  return (
    <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
      <SelectTrigger size="sm" className="w-[110px] border-gray-200 text-xs">
        <SelectValue />
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
  );
}

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

export const columns: ColumnDef<UserRecord>[] = [
  // ── Row Selection ────────────────────────────────────────────────────────────
  {
    id: "select",
    header: ({ table }) => (
      <ThemedCheckbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
        ariaLabel="Select all"
      />
    ),
    cell: ({ row }) => (
      <ThemedCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        ariaLabel="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ── Student Number ───────────────────────────────────────────────────────────
  {
    accessorKey: "studentNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student No.
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-gray-800">
        {row.getValue("studentNumber")}
      </span>
    ),
  },

  // ── Username ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-800">{row.getValue("username")}</span>
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
      <span className="text-sm text-gray-600">{row.getValue("email")}</span>
    ),
  },

  // ── College / Department ─────────────────────────────────────────────────────
  {
    accessorKey: "college",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        College / Dept.
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("college")}</span>
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

  // ── Actions ──────────────────────────────────────────────────────────────────
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => console.log("Approve:", user.id)}
            >
              <Check className="h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => console.log("Reject:", user.id)}
            >
              <X className="h-4 w-4" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer"
              onClick={() => navigator.clipboard.writeText(user.email)}
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
