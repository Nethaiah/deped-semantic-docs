"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Funnel, FileText, Calendar, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ThesesFilterDialog from "@/components/dashboard/theses-filter-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import NumberedPagination from "@/components/shared/numbered-pagination";
import type { Thesis } from "@/server/theses/get-theses";
import type { FilterOptions } from "@/server/theses/get-filter-options";

type Props = {
  initialData: Thesis[];
  initialTotalPages?: number;
  initialPage?: number;
  initialFilters?: {
    yearFrom: string;
    yearTo: string;
    department: string;
    college: string;
    title: string;
  };
  filterOptions?: FilterOptions;
  accentColor?: string;
};

export default function ThesesTable({
  initialData,
  initialTotalPages = 1,
  initialPage = 1,
  initialFilters = { yearFrom: "", yearTo: "", department: "", college: "", title: "" },
  filterOptions = { departments: [], colleges: [] },
  accentColor = "#278fb6",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // URL state with nuqs
  const [page, setPage] = useQueryState("page", { defaultValue: String(initialPage), shallow: false });
  const [yearFrom, setYearFrom] = useQueryState("yearFrom", { defaultValue: initialFilters.yearFrom, shallow: false });
  const [yearTo, setYearTo] = useQueryState("yearTo", { defaultValue: initialFilters.yearTo, shallow: false });
  const [department, setDepartment] = useQueryState("department", { defaultValue: initialFilters.department, shallow: false });
  const [college, setCollege] = useQueryState("college", { defaultValue: initialFilters.college, shallow: false });
  const [title, setTitle] = useQueryState("title", { defaultValue: initialFilters.title, shallow: false });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Temporary form values for dialog (before applying)
  const [formFilters, setFormFilters] = useState({
    yearFrom: yearFrom || "",
    yearTo: yearTo || "",
    department: department || "",
    college: college || "",
    title: title || "",
  });

  const onApplyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("page", "1");
      if (formFilters.yearFrom) params.set("yearFrom", formFilters.yearFrom);
      if (formFilters.yearTo) params.set("yearTo", formFilters.yearTo);
      if (formFilters.department) params.set("department", formFilters.department);
      if (formFilters.college) params.set("college", formFilters.college);
      if (formFilters.title) params.set("title", formFilters.title);
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
      setIsFilterOpen(false);
    });
  };

  const onResetFilters = () => {
    startTransition(() => {
      setFormFilters({ yearFrom: "", yearTo: "", department: "", college: "", title: "" });
      router.push("/dashboard", { scroll: false });
      setIsFilterOpen(false);
    });
  };

  const activeFilterCount = [
    yearFrom,
    yearTo,
    department,
    college,
    title,
  ].filter(Boolean).length;

  // Sync form filters when URL changes
  useEffect(() => {
    setFormFilters({
      yearFrom: yearFrom || "",
      yearTo: yearTo || "",
      department: department || "",
      college: college || "",
      title: title || "",
    });
  }, [yearFrom, yearTo, department, college, title]);

  const currentPage = parseInt(page || "1");
  const totalPages = initialTotalPages;

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (yearTo) params.set("yearTo", yearTo);
    if (department) params.set("department", department);
    if (college) params.set("college", college);
    if (title) params.set("title", title);
    return `/dashboard?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(buildHref(newPage), { scroll: false });
    });
  };


  return (
    <Card className={`bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden p-0 gap-0 transition-opacity duration-200 ${isPending ? "pointer-events-none" : ""}`}>
      <CardHeader className="flex flex-row justify-between items-center px-4 lg:px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-0">
        <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-2 m-0">
          Theses
        </CardTitle>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="text-xs font-semibold text-slate-600 px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              {activeFilterCount} active
            </span>
          )}
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Funnel className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <ThesesFilterDialog
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            values={formFilters}
            onValuesChange={setFormFilters}
            onApply={onApplyFilters}
            onReset={onResetFilters}
            departments={filterOptions.departments}
            colleges={filterOptions.colleges}
          />
        </div>
      </CardHeader>

      <div className="p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-100 border-b border-slate-200">
              <TableRow className="hover:bg-slate-100">
                <TableHead className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide h-auto target">
                  Year
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide h-auto">
                  Title
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide h-auto">
                  Department
                </TableHead>
                <TableHead className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide h-auto">
                  College
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
            {isPending ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell className="py-4 px-4 align-top w-[10%]">
                    <Skeleton className="h-5 w-14 rounded" />
                  </TableCell>
                  <TableCell className="py-4 px-4 align-top w-[50%]">
                    <Skeleton className="h-5 w-full max-w-[280px] rounded" />
                  </TableCell>
                  <TableCell className="py-4 px-4 align-top w-[20%]">
                    <Skeleton className="h-4 w-32 rounded" />
                  </TableCell>
                  <TableCell className="py-4 px-4 align-top w-[20%]">
                    <Skeleton className="h-4 w-28 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : initialData.length > 0 ? (
              initialData.map((thesis) => (
                <TableRow
                  key={thesis.id}
                  onClick={() => router.push(`/view/${thesis.id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <TableCell className="py-4 px-4 text-md text-slate-600 font-semibold align-top">
                    <span style={{ color: accentColor }}>{thesis.year}</span>
                  </TableCell>

                  <TableCell className="py-4 px-4 text-md text-slate-900 max-w-[300px] align-top">
                    <Link
                      href={`/view/${thesis.id}`}
                      className="block hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="truncate"
                        title={thesis.title}
                      >
                        <span className="text-slate-900">{thesis.title}</span>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="py-4 px-4 text-md text-slate-600 align-top max-w-[200px] truncate" title={thesis.department}>
                    <span className="text-slate-600 text-sm">
                      {thesis.department}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 px-4 text-md text-slate-600 align-top max-w-[200px] truncate" title={thesis.college}>
                    <span className="text-slate-500 text-sm">
                      {thesis.college}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                  No theses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden">
          {isPending ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={`mob-skeleton-${i}`} className="p-4 border-b border-slate-100">
                <div className="mb-2">
                  <Skeleton className="h-5 w-14 rounded" />
                </div>
                <Skeleton className="h-5 w-full max-w-[280px] rounded mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </div>
            ))
          ) : initialData.length > 0 ? (
            initialData.map((thesis, index) => (
              <div
                key={thesis.id}
                onClick={() => router.push(`/view/${thesis.id}`)}
                className={`p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                  index !== initialData.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-bold px-2 py-1 rounded bg-slate-100"
                      style={{ color: accentColor }}
                    >
                      {thesis.year}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-800 mb-3 line-clamp-2 leading-tight">
                  {thesis.title}
                </h3>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{thesis.department}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{thesis.college}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500">
               No theses found
            </div>
          )}
        </div>
      </div>

      {/* Numbered Pagination */}
      <CardFooter className="px-4 lg:px-6 py-4 pb-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
        <div className="w-full">
          <NumberedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildHref}
            onPageChange={handlePageChange}
            isLoading={isPending}
            siblings={1}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

