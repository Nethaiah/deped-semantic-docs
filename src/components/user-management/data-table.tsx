"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Users } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { UserStatus } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const STATUS_TABS: { label: string; value: UserStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_COUNTS_COLORS: Record<
  UserStatus | "all",
  { bg: string; text: string; activeBg: string; activeText: string }
> = {
  all: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    activeBg: "bg-[#008c8b]",
    activeText: "text-white",
  },
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    activeBg: "bg-yellow-500",
    activeText: "text-white",
  },
  approved: {
    bg: "bg-green-50",
    text: "text-green-700",
    activeBg: "bg-green-600",
    activeText: "text-white",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    activeBg: "bg-red-600",
    activeText: "text-white",
  },
};

export function UserDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeStatus, setActiveStatus] = React.useState<UserStatus | "all">("all");

  // Filter data by status tab
  const filteredByStatus = React.useMemo(() => {
    if (activeStatus === "all") return data;
    return data.filter(
      (row) => (row as Record<string, unknown>)["status"] === activeStatus
    );
  }, [data, activeStatus]);

  // Count per status
  const counts = React.useMemo(() => {
    const all = data.length;
    const counts = { all, pending: 0, approved: 0, rejected: 0 };
    data.forEach((row) => {
      const s = (row as Record<string, unknown>)["status"] as UserStatus;
      if (s in counts) counts[s]++;
    });
    return counts;
  }, [data]);

  const table = useReactTable({
    data: filteredByStatus,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-4">
      {/* ── Status Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          const colors = STATUS_COUNTS_COLORS[tab.value];
          return (
            <button
              key={tab.value}
              onClick={() => {
                setActiveStatus(tab.value);
                setRowSelection({});
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer border
                ${
                  isActive
                    ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-sm`
                    : `bg-white ${colors.text} border-gray-200 hover:border-gray-300 hover:bg-gray-50`
                }`}
            >
              {tab.label}
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : `${colors.bg} ${colors.text}`
                  }`}
              >
                {counts[tab.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar: Search + Column Visibility ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, student no..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-white border-gray-200 focus:border-[#008c8b] focus:ring-[#008c8b]/20 text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
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
                  {col.id === "studentNumber"
                    ? "Student No."
                    : col.id === "college"
                    ? "College / Dept."
                    : col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-b border-gray-100 transition-colors duration-100
                    hover:bg-[#008c8b]/5
                    data-[state=selected]:bg-[#008c8b]/10
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

      {/* ── Footer: Selection Count + Pagination ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* Selected count */}
        <p className="text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <>
              <span className="font-semibold text-[#008c8b]">
                {table.getFilteredSelectedRowModel().rows.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              row(s) selected
            </>
          ) : (
            <>
              <span className="font-medium">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              {table.getFilteredRowModel().rows.length === 1 ? "user" : "users"} total
            </>
          )}
        </p>

        {/* Page controls */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {table.getPageCount() || 1}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 border-gray-200 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page number pills */}
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((page) => {
              const current = table.getState().pagination.pageIndex;
              const distance = Math.abs(page - current);
              // Only show nearby pages + first/last
              if (
                page === 0 ||
                page === table.getPageCount() - 1 ||
                distance <= 1
              ) {
                return (
                  <Button
                    key={page}
                    variant={page === current ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className={`h-8 w-8 p-0 text-xs
                      ${
                        page === current
                          ? "bg-[#008c8b] hover:bg-[#007a78] border-[#008c8b] text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    {page + 1}
                  </Button>
                );
              }
              if (distance === 2) {
                return (
                  <span key={`ellipsis-${page}`} className="text-gray-400 text-sm">
                    &hellip;
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 border-gray-200 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
