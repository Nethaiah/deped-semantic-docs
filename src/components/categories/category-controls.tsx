"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { debounce } from "nuqs";

import { Button } from "@/components/ui/button";
import { SearchIcon, Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CollegeFilterDialog, {
  type CollegeFilterFormValues,
} from "./category-filter-dialog";

type Props = {
  collegeCode: string;
  departments: string[];
  initialQuery?: string;
  initialFilters?: CollegeFilterFormValues;
  initialSort?: string;
};

export default function CategoryControls({
  collegeCode,
  departments,
  initialQuery = "",
  initialFilters,
  initialSort = "year_desc",
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<CollegeFilterFormValues>(
    initialFilters ?? { yearFrom: "", yearTo: "", department: "" }
  );

  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(initialQuery).withOptions({ shallow: false })
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault(initialSort).withOptions({ shallow: false })
  );

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

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setSortBy(newSort);
      const params = buildQueryString(1, newSort, filters, query || "");
      router.push(
        `/categories/${encodeURIComponent(collegeCode)}?${params}`
      );
    });
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    startTransition(() => {
      const params = buildQueryString(
        1,
        sortBy || "year_desc",
        filters,
        query || ""
      );
      router.push(
        `/categories/${encodeURIComponent(collegeCode)}?${params}`
      );
    });
  };

  const handleResetFilters = () => {
    const resetFilters = { yearFrom: "", yearTo: "", department: "" };
    setFilters(resetFilters);
    setIsFilterOpen(false);
    startTransition(() => {
      const params = buildQueryString(
        1,
        sortBy || "year_desc",
        resetFilters,
        query || ""
      );
      router.push(
        `/categories/${encodeURIComponent(collegeCode)}?${params}`
      );
    });
  };

  return (
    <>
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
                  limitUrlUpdates:
                    e.target.value === "" ? undefined : debounce(500),
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
          <Select
            value={sortBy || "year_desc"}
            onValueChange={handleSortChange}
          >
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
    </>
  );
}
