"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { debounce } from "nuqs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollegeThesis } from "@/server/categories/actions";
import ThesisActionButtons from "@/components/shared/thesis-action-buttons";
import { getDynamicBadgeClasses } from "@/lib/badge-variants";
import {
  ChevronLeft,
  SearchIcon,
  Users,
  Calendar,
  Building,
  Loader2,
  Funnel,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NumberedPagination from "@/components/shared/numbered-pagination";
import CollegeFilterDialog, { type CollegeFilterFormValues } from "./category-filter-dialog";

type Props = {
  collegeCode: string;
  collegeName: string;
  initialTheses: CollegeThesis[];
  initialBookmarks: Record<string, boolean>;
  departments: string[];
  total?: number;
  page?: number;
  pageSize?: number;
  initialQuery?: string;
  initialFilters?: CollegeFilterFormValues;
  initialSort?: "year_desc" | "year_asc" | "title_asc" | "title_desc";
};

export default function Category({
  collegeCode,
  collegeName,
  initialTheses,
  initialBookmarks,
  departments,
  total = 0,
  page = 1,
  pageSize = 10,
  initialQuery = "",
  initialFilters,
  initialSort = "year_desc",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<CollegeFilterFormValues>(
    initialFilters ?? {
      yearFrom: "",
      yearTo: "",
      department: "",
    }
  );

  // Nuqs state for URL params
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(initialQuery).withOptions({ shallow: false })
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault(initialSort).withOptions({ shallow: false })
  );

  const theses = initialTheses;
  const bookmarks = initialBookmarks;
  const activeColor = "#3a7c94";

  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));

  const activeFilterCount = [
    filters.yearFrom,
    filters.yearTo,
    filters.department,
  ].filter(Boolean).length;

  const buildQueryString = (
    targetPage: number,
    targetSort?: string,
    targetFilters?: CollegeFilterFormValues,
    targetQuery?: string
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));

    const trimmedQuery = (targetQuery ?? query)?.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);

    const useFilters = targetFilters ?? filters;
    if (useFilters.yearFrom) params.set("yearFrom", useFilters.yearFrom);
    if (useFilters.yearTo) params.set("yearTo", useFilters.yearTo);
    if (useFilters.department) params.set("department", useFilters.department);

    const useSort = targetSort ?? sortBy;
    if (useSort && useSort !== "year_desc") params.set("sort", useSort);

    return params.toString();
  };

  const buildHref = (targetPage: number) => {
    return `/categories/${encodeURIComponent(collegeCode)}?${buildQueryString(targetPage)}`;
  };

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setSortBy(newSort);
      const params = buildQueryString(1, newSort, filters, query || "");
      router.push(`/categories/${encodeURIComponent(collegeCode)}?${params}`);
    });
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    startTransition(() => {
      const params = buildQueryString(1, sortBy || "year_desc", filters, query || "");
      router.push(`/categories/${encodeURIComponent(collegeCode)}?${params}`);
    });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      yearFrom: "",
      yearTo: "",
      department: "",
    };
    setFilters(resetFilters);
    setIsFilterOpen(false);
    startTransition(() => {
      const params = buildQueryString(1, sortBy || "year_desc", resetFilters, query || "");
      router.push(`/categories/${encodeURIComponent(collegeCode)}?${params}`);
    });
  };

  const handlePageChange = () => {
    startTransition(() => {});
  };

  const hasAny = (total || 0) > 0;

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-4">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 text-sm text-[#278fb6] cursor-pointer bg-gray-200 hover:bg-gray-300 border-gray-300 border-1 px-5 py-1 rounded-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Colleges
          </Link>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {collegeCode}
        </h1>
        <p className="text-sm text-gray-600">
          {collegeName}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or abstract..."
              value={query || ""}
              onChange={(e) =>
                setQuery(e.target.value, {
                  // Send immediate update if resetting, otherwise debounce at 500ms
                  limitUrlUpdates: e.target.value === "" ? undefined : debounce(500)
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="cursor-pointer px-4 py-6 text-md relative"
          >
            <Funnel className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <Select value={sortBy || "year_desc"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full lg:w-48 py-6">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year_desc">Year (Newest)</SelectItem>
              <SelectItem value="year_asc">Year (Oldest)</SelectItem>
              <SelectItem value="title_asc">Title (A–Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z–A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Dialog */}
      <CollegeFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        values={filters}
        onValuesChange={setFilters}
        departments={departments}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Loading Overlay */}
      {isPending && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* Results */}
      {!isPending && (
        <>
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {hasAny ? (
              <span>
                Showing {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, total)} of {total} thesis papers
                {filters.department && (
                  <> in <span className="font-semibold">{filters.department}</span></>
                )}
              </span>
            ) : (
              <span>No thesis papers found</span>
            )}
          </div>

          {/* Thesis List */}
          {hasAny ? (
            <div className="space-y-4">
              {theses.map((thesis) => (
                <div
                  key={thesis.thesis_id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT SECTION */}
                    <div className="flex-1">
                      <Link href={`/view/${thesis.thesis_id}`} className="block group">
                        <h3
                          className="text-md lg:text-xl font-semibold mb-2 group-hover:underline line-clamp-2"
                          style={{ color: activeColor }}
                        >
                          {thesis.title}
                        </h3>
                      </Link>

                      {/* Authors */}
                      {thesis.authors && thesis.authors.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Users className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {thesis.authors.join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Metadata Row */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        {thesis.year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{thesis.year}</span>
                          </div>
                        )}
                        {thesis.department && (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{thesis.department}</span>
                          </div>
                        )}
                      </div>

                      {/* Abstract */}
                      {thesis.abstract && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {thesis.abstract}
                        </p>
                      )}

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5">
                        {thesis.keywords &&
                          thesis.keywords.slice(0, 5).map((keyword: string) => (
                            <Badge
                              key={keyword}
                              size="md"
                              className={getDynamicBadgeClasses(keyword)}
                            >
                              {keyword}
                            </Badge>
                          ))}
                        {thesis.keywords && thesis.keywords.length > 5 && (
                          <Badge variant="outline" size="md">
                            +{thesis.keywords.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <ThesisActionButtons
                      thesisId={thesis.thesis_id}
                      initialBookmarked={bookmarks[thesis.thesis_id]}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <SearchIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No thesis papers found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search query or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <NumberedPagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={buildHref}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
