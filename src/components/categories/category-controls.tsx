"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { debounce } from "nuqs";

import { Button } from "@/components/ui/button";
import { SearchIcon, Funnel, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  <div className="flex flex-row gap-2 mb-6 w-full">
    {/* SEARCH */}
    <div className="relative flex-1 min-w-0">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by title or abstract..."
        value={query || ""}
        onChange={(e) =>
          setQuery(e.target.value, {
            limitUrlUpdates:
              e.target.value === "" ? undefined : debounce(500),
          })
        }
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-base md:text-sm"
      />
    </div>

    {/* FILTER + SORT (Right aligned, side-by-side) */}
    <div className="flex gap-2 shrink-0">
      {/* FILTER */}
      <Button
        variant="outline"
        onClick={() => setIsFilterOpen(true)}
        className="h-10 w-10 p-0 sm:w-auto sm:px-4 relative shrink-0"
      >
        <Funnel className="h-4 w-4 sm:mr-2 shrink-0" />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-[6px] -right-[6px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* SORT */}
      <Select
        value={sortBy || "year_desc"}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="!h-10 w-10 sm:w-40 lg:w-48 p-0 sm:px-3 flex items-center justify-center sm:justify-between shrink-0 [&>svg:last-child]:hidden sm:[&>svg:last-child]:block bg-white">
          <ArrowUpDown className="h-4 w-4 sm:hidden shrink-0 text-muted-foreground m-auto" />
          <span className="hidden sm:inline-block truncate text-left w-full">
            <SelectValue placeholder="Sort by" />
          </span>
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
