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
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Archive,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-context";
import type { ArchiveSortOption } from "@/lib/search-params";

// ── Types ────────────────────────────────────────────────────────────────────

interface ArchiveDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  currentQuery: string;
  currentSort: ArchiveSortOption;
  currentCollege: string;
  colleges: string[];
}

const SORT_LABELS: Record<ArchiveSortOption, string> = {
  archived_desc: "Newest Archived",
  archived_asc: "Oldest Archived",
  title_asc: "Title A → Z",
  title_desc: "Title Z → A",
  year_desc: "Year (Newest)",
  year_asc: "Year (Oldest)",
};

// ── Component ────────────────────────────────────────────────────────────────

export function ArchiveDataTable<TData, TValue>({
  columns,
  data,
  total,
  page,
  pageSize,
  currentQuery,
  currentSort,
  currentCollege,
  colleges,
}: ArchiveDataTableProps<TData, TValue>) {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState(currentQuery);

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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* ── Toolbar: Search + Sort + College Filter + Column Visibility ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search archived theses…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 bg-white border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* College filter */}
          {colleges.length > 0 && (
            <Select
              value={currentCollege || "__all__"}
              onValueChange={(val) =>
                updateParams({
                  college: val === "__all__" ? "" : val,
                  page: "1",
                })
              }
            >
              <SelectTrigger
                size="sm"
                className="w-[160px] border-gray-200 text-xs"
              >
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Colleges</SelectItem>
                {colleges.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select
            value={currentSort}
            onValueChange={(val) =>
              updateParams({ sort: val, page: "1" })
            }
          >
            <SelectTrigger
              size="sm"
              className="w-[170px] border-gray-200 text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Column visibility */}
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
                    {col.id === "archived_at"
                      ? "Archived On"
                      : col.id === "archive_reason"
                      ? "Reason"
                      : col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                    <Archive className="h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">No archived theses</p>
                    <p className="text-xs">
                      Archived theses will appear here
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Footer: Selection Count + Server-side Pagination ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        {/* Selected / total count */}
        <p className="text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <>
              <span
                className="font-semibold"
                style={{ color: theme.primary }}
              >
                {table.getFilteredSelectedRowModel().rows.length}
              </span>{" "}
              of <span className="font-medium">{total}</span> row(s)
              selected
            </>
          ) : (
            <>
              <span className="font-medium">{total}</span>{" "}
              {total === 1 ? "thesis" : "theses"} archived
            </>
          )}
        </p>

        {/* Page controls */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">{page}</span> of{" "}
            <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateParams({ page: String(Math.max(1, page - 1)) })
              }
              disabled={page <= 1}
              className="h-8 w-8 p-0 border-gray-200 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page pills — show first, last, and nearby */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const distance = Math.abs(pageNum - page);
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
                      onClick={() =>
                        updateParams({ page: String(pageNum) })
                      }
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
                    <span
                      key={`ellipsis-${pageNum}`}
                      className="text-gray-400 text-sm"
                    >
                      &hellip;
                    </span>
                  );
                }
                return null;
              }
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateParams({
                  page: String(Math.min(totalPages, page + 1)),
                })
              }
              disabled={page >= totalPages}
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
