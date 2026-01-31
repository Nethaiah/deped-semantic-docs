"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/lib/badge-variants";
import { getTheses, type Thesis } from "@/server/documents/get-theses";
import { Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThesesFilterDialog from "@/components/dashboard/theses-filter-dialog";
import NumberedPagination from "@/components/shared/numbered-pagination";

export default function ThesesTable({
  initialData,
  initialTotalPages = 1,
  accentColor = "#278fb6",
}: {
  initialData: Thesis[];
  initialTotalPages?: number;
  accentColor?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formFilters, setFormFilters] = useState({
    yearFrom: "",
    yearTo: "",
    department: "",
    college: "",
    title: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<{
    yearFrom?: number;
    yearTo?: number;
    department?: string;
    college?: string;
    title?: string;
  }>({});

  const loadPage = async (
    page: number,
    overrideFilters?: {
      yearFrom?: number;
      yearTo?: number;
      department?: string;
      college?: string;
      title?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const result = await getTheses(
        page,
        10,
        overrideFilters ?? appliedFilters
      );
      setData(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onApplyFilters = async () => {
    const nextApplied: {
      yearFrom?: number;
      yearTo?: number;
      department?: string;
      college?: string;
      title?: string;
    } = {
      yearFrom: formFilters.yearFrom ? parseInt(formFilters.yearFrom) : undefined,
      yearTo: formFilters.yearTo ? parseInt(formFilters.yearTo) : undefined,
      department: formFilters.department || undefined,
      college: formFilters.college || undefined,
      title: formFilters.title || undefined,
    };
    setAppliedFilters(nextApplied);
    setIsFilterOpen(false);
    await loadPage(1, nextApplied);
  };

  const onResetFilters = async () => {
    setFormFilters({
      yearFrom: "",
      yearTo: "",
      department: "",
      college: "",
      title: "",
    });
    setAppliedFilters({});
    setIsFilterOpen(false);
    await loadPage(1, {});
  };

  const activeFilterCount = [
    appliedFilters.yearFrom,
    appliedFilters.yearTo,
    appliedFilters.department,
    appliedFilters.college,
    appliedFilters.title,
  ].filter(Boolean).length;

  // For numbered pagination - we don't use actual URLs, just trigger loadPage
  const buildHref = (page: number) => {
    return "#"; // Dummy href since we handle navigation programmatically
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
  };

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md border border-slate-200 overflow-scroll">
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-2">
          Theses
        </h2>
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
          />
        </div>
      </div>

      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Year
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Title
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Department
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                College
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((thesis, index) => (
                <tr
                  key={thesis.id}
                  onClick={() => router.push(`/view/${thesis.id}`)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    index !== data.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-md text-slate-600 font-semibold">
                    <span style={{ color: accentColor }}>{thesis.year}</span>
                  </td>

                  <td className="py-4 px-4 text-md text-slate-900 max-w-[300px]">
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
                  </td>

                  <td className="py-4 px-4 text-md text-slate-600">
                    <span className="text-slate-600 text-sm">
                      {thesis.department}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-md text-slate-600">
                    <span className="text-slate-500 text-sm">
                      {thesis.college}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No theses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Numbered Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <NumberedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildHref}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
