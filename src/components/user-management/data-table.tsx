"use client";

import * as React from "react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { BatchActionBar } from "@/components/ui/batch-action-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRecord } from "./columns";
import { useTheme } from "@/components/theme-context";
import { updateUserStatus, type StatusAction } from "@/server/user-management/update-user-status";
import { reactivateUser } from "@/server/user-management/reactivate-user";
import { Spinner } from "@/components/ui/spinner";
import type { UserStats } from "@/server/user-management/get-users";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  currentQuery: string;
  currentStatus: string;
  currentLifecycle: string;
  currentSort: string;
  stats: UserStats;
}

export function UserDataTable<TData, TValue>({
  columns,
  data,
  total,
  page,
  pageSize,
  currentQuery,
  currentStatus,
  currentLifecycle,
  currentSort,
  stats,
}: DataTableProps<TData, TValue>) {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState(currentQuery);

  // Batch action state
  const [isPending, startTransition] = useTransition();
  const [batchApproveOpen, setBatchApproveOpen] = React.useState(false);
  const [batchRejectOpen, setBatchRejectOpen] = React.useState(false);
  const [reactivateTarget, setReactivateTarget] = React.useState<UserRecord | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // ── URL-based navigation helpers ──
  const updateParams = React.useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Skip the first render to avoid updating state before mount
  const hasMounted = React.useRef(false);

  // Debounce search input
  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      if (searchValue !== currentQuery) {
        updateParams({ q: searchValue, page: "1" });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, currentQuery, updateParams]);


  // Compute current sorting state for React Table headers from URL param
  const sortState = React.useMemo(() => {
    if (!currentSort) return [];
    const isDesc = currentSort.endsWith("_desc");
    const id = currentSort.replace(/_(asc|desc)$/, "");
    return [{ id, desc: isDesc }];
  }, [currentSort]);

  // Handle header sorting clicks
  const handleSortingChange = React.useCallback((updater: unknown) => {
    // TanStack exposes an updater function or direct state. We resolve it:
    const newSorting = typeof updater === "function" ? (updater as (old: typeof sortState) => typeof sortState)(sortState) : updater as typeof sortState;
    if (newSorting && newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      const newSortStr = `${id}_${desc ? "desc" : "asc"}`;
      updateParams({ sort: newSortStr, page: "1" });
    } else {
      updateParams({ sort: "created_at_desc", page: "1" });
    }
  }, [sortState, updateParams]);


  // ── Single/batch action handler ──
  const handleStatusAction = React.useCallback(async (userIds: string[], status: StatusAction) => {
    setIsProcessing(true);
    startTransition(async () => {
      try {
        const result = await updateUserStatus({ userIds, status });
        if (result.error) {
          toast.error(result.error, { duration: 5000 });
        } else {
          const count = result.updated ?? userIds.length;
          toast.success(
            `${count} ${count === 1 ? "user" : "users"} ${status}`,
            {
              description: result.failedEmails
                ? `${result.failedEmails} email notification(s) failed to send.`
                : "Email notification sent successfully.",
            }
          );
          setRowSelection({});
          router.refresh();
        }
      } catch {
        toast.error("An unexpected error occurred", { duration: 5000 });
      } finally {
        setIsProcessing(false);
        setBatchApproveOpen(false);
        setBatchRejectOpen(false);
      }
    });
  }, [router]);

  const handleReactivate = React.useCallback(async (user: UserRecord) => {
    setIsProcessing(true);
    startTransition(async () => {
      try {
        const result = await reactivateUser({ userId: user.id });
        if (result.error) {
          toast.error(result.error, { duration: 5000 });
        } else {
          toast.success("Account reactivated", {
            description: result.failedEmails
              ? "The account was restored, but the reactivation email failed to send."
              : "The user can sign in again and a reactivation email was sent.",
          });
          router.refresh();
        }
      } catch {
        toast.error("An unexpected error occurred", { duration: 5000 });
      } finally {
        setIsProcessing(false);
        setReactivateTarget(null);
      }
    });
  }, [router]);

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, rowSelection, sorting: sortState },
    manualSorting: true,
    onSortingChange: handleSortingChange,
    enableRowSelection: (row) => (row.original as Record<string, unknown>).status === "pending",
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onAction: handleStatusAction,
      onReactivate: setReactivateTarget,
    },
  });

  // ── Batch action helpers ──
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const getSelectedUserIds = (): string[] =>
    selectedRows.map((row) => (row.original as UserRecord).id);

  return (
    <div className="w-full">
      {/* ── Toolbar: Search + Status Filter + Column Visibility ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, student ID..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 bg-white border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 text-sm"
          />
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto">
          {/* Status Filter */}
          <Select
            value={currentStatus}
            onValueChange={(val) => {
              updateParams({ status: val === "all" ? "" : val, page: "1" });
              setRowSelection({});
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-[160px] border-gray-200 text-xs"
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({stats.total})</SelectItem>
              <SelectItem value="pending">Pending ({stats.pending})</SelectItem>
              <SelectItem value="approved">Approved ({stats.approved})</SelectItem>
              <SelectItem value="rejected">Rejected ({stats.rejected})</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentLifecycle}
            onValueChange={(val) => {
              updateParams({ lifecycle: val === "all" ? "" : val, page: "1" });
              setRowSelection({});
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-[160px] border-gray-200 text-xs"
            >
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts ({stats.total})</SelectItem>
              <SelectItem value="active">Active ({stats.total - stats.deactivated})</SelectItem>
              <SelectItem value="deleted">Deleted ({stats.deactivated})</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs text-gray-500">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize text-sm cursor-pointer"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id === "student_id"
                      ? "Student ID"
                      : col.id === "full_name"
                      ? "Full Name"
                      : col.id === "account_state"
                      ? "Account"
                      : col.id === "created_at"
                      ? "Joined"
                      : col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Batch Action Bar ── */}
      <BatchActionBar
        selectedCount={selectedCount}
        onDeselectAll={() => setRowSelection({})}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBatchApproveOpen(true)}
          disabled={isProcessing}
          className="gap-2 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800"
        >
          <Check className="h-3.5 w-3.5" />
          Approve ({selectedCount})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBatchRejectOpen(true)}
          disabled={isProcessing}
          className="gap-2 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
        >
          <X className="h-3.5 w-3.5" />
          Reject ({selectedCount})
        </Button>
      </BatchActionBar>

      {/* ── Table ── */}
      <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity transition-duration-300" }>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      border-b border-gray-100 transition-colors duration-100
                      hover:bg-gray-50
                      data-[state=selected]:bg-gray-100
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm font-medium">No users found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Footer: Selection Count + Pagination ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* Selected count */}
        <p className="text-sm text-gray-500">
          {selectedCount > 0 ? (
            <>
              <span className="font-semibold" style={{ color: theme.primary }}>
                {selectedCount}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {total}
              </span>{" "}
              row(s) selected
            </>
          ) : (
            <>
              <span className="font-medium">
                {total}
              </span>{" "}
              {total === 1 ? "user" : "users"} total
            </>
          )}
        </p>

        {/* Page controls */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
              disabled={page <= 1}
              className="h-8 w-8 p-0 border-gray-200 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page number pills */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const distance = Math.abs(pageNum - page);
              // Only show nearby pages + first/last
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                distance <= 1
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateParams({ page: String(pageNum) })}
                    className={`h-8 w-8 p-0 text-xs
                      ${
                        pageNum === page
                          ? `${theme.primaryBgClass} ${theme.primaryHoverBgClass} border-transparent text-white`
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    {pageNum}
                  </Button>
                );
              }
              if (distance === 2) {
                return (
                  <span key={`ellipsis-${pageNum}`} className="text-gray-400 text-sm">
                    &hellip;
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) })}
              disabled={page >= totalPages}
              className="h-8 w-8 p-0 border-gray-200 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Batch Approve Confirmation ── */}
      <AlertDialog open={batchApproveOpen} onOpenChange={setBatchApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve {selectedCount} {selectedCount === 1 ? "User" : "Users"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve{" "}
              <span className="font-semibold text-gray-900">
                {selectedCount} {selectedCount === 1 ? "user" : "users"}
              </span>
              ? They will be granted access to DocuLens and notified via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusAction(getSelectedUserIds(), "approved")}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Processing...
                </div>
              ) : (
                `Approve ${selectedCount}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Batch Reject Confirmation ── */}
      <AlertDialog open={batchRejectOpen} onOpenChange={setBatchRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {selectedCount} {selectedCount === 1 ? "User" : "Users"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject{" "}
              <span className="font-semibold text-gray-900">
                {selectedCount} {selectedCount === 1 ? "user" : "users"}
              </span>
              ? Their access requests will be denied and they will be notified via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusAction(getSelectedUserIds(), "rejected")}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Processing...
                </div>
              ) : (
                `Reject ${selectedCount}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!reactivateTarget} onOpenChange={(open) => !open && setReactivateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Account</AlertDialogTitle>
            <AlertDialogDescription>
              Restore <span className="font-semibold text-gray-900">{reactivateTarget?.full_name || reactivateTarget?.email || "this user"}</span> and allow them to sign in again. A reactivation email will be sent automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reactivateTarget && handleReactivate(reactivateTarget)}
              disabled={isProcessing}
              className="bg-[#008c8b] hover:bg-[#008c8b]/90 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Restoring...
                </div>
              ) : (
                "Reactivate account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
