"use client";

import Link from "next/link";
import { useTransition } from "react";
import { SearchIcon, Users, Calendar, Building, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDynamicBadgeClasses } from "@/lib/badge-variants";
import ThesisActionButtons from "../shared/thesis-action-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import NumberedPagination from "@/components/shared/numbered-pagination";

type BookmarkedThesis = {
  id: string;
  thesisId: string;
  title: string;
  year: number;
  department: string;
  college: string;
  advisor?: string;
  keywords: string[];
  abstract?: string;
  summary?: string;
  sourcePath: string;
  totalPages: number;
  authors: string[];
  bookmarkedAt: string;
};

type Props = {
  role: string;
  theses: BookmarkedThesis[];
  total?: number;
  page?: number;
  pageSize?: number;
  initialQuery?: string;
  initialSort?: "date_desc" | "date_asc" | "title_asc" | "title_desc" | "year_desc" | "year_asc";
};

export default function Bookmarks({
  role,
  theses,
  total = 0,
  page = 1,
  pageSize = 10,
  initialQuery = "",
  initialSort = "date_desc",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Nuqs state for URL params
  const [query, setQuery] = useQueryState("q", { defaultValue: initialQuery, shallow: false });
  const [sortBy, setSortBy] = useQueryState("sort", { defaultValue: initialSort, shallow: false });

  const activeColor =
    String(role).toLowerCase() === "admin" ? "#008c8b" : "#3a7c94";

  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (query?.trim()) params.set("q", query.trim());
    if (sortBy && sortBy !== "date_desc") params.set("sort", sortBy);
    return `/bookmarks?${params.toString()}`;
  };

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("page", "1");
      if (query?.trim()) params.set("q", query.trim());
      if (sortBy && sortBy !== "date_desc") params.set("sort", sortBy);
      router.push(`/bookmarks?${params.toString()}`);
    });
  };

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setSortBy(newSort);
      const params = new URLSearchParams();
      params.set("page", "1");
      if (query?.trim()) params.set("q", query.trim());
      if (newSort !== "date_desc") params.set("sort", newSort);
      router.push(`/bookmarks?${params.toString()}`);
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Bookmarked Theses
        </h1>
        <p className="text-sm text-gray-600">
          Browse and manage your saved theses
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, department, college, advisor..."
              value={query || ""}
              onChange={(e) => setQuery(e.target.value || null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isPending}
            style={{ backgroundColor: activeColor }}
            className="text-white px-6 py-6"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>

          {/* Sort Dropdown */}
          <Select value={sortBy || "date_desc"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full lg:w-48 py-6">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
              <SelectItem value="title_desc">Title Z-A</SelectItem>
              <SelectItem value="year_desc">Year (Newest)</SelectItem>
              <SelectItem value="year_asc">Year (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                {Math.min(page * pageSize, total)} of {total} bookmarked theses
              </span>
            ) : (
              <span>No bookmarked theses found</span>
            )}
          </div>

          {/* Thesis List */}
          {hasAny ? (
            <div className="space-y-4">
              {theses.map((thesis) => (
                <div
                  key={thesis.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT SECTION */}
                    <div className="flex-1">
                      <Link href={`/view/${thesis.thesisId}`} className="block group">
                        <h3
                          className="text-md lg:text-xl font-semibold mb-2 group-hover:underline line-clamp-2"
                          style={{ color: activeColor }}
                        >
                          {thesis.title}
                        </h3>
                      </Link>

                      {/* Authors */}
                      {thesis.authors.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Users className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {thesis.authors.join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Metadata Row */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{thesis.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{thesis.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>{thesis.college}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      {thesis.summary && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {thesis.summary}
                        </p>
                      )}

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5">
                        {thesis.keywords.slice(0, 5).map((keyword) => (
                          <Badge
                            key={keyword}
                            size="md"
                            className={getDynamicBadgeClasses(keyword)}
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {thesis.keywords.length > 5 && (
                          <Badge variant="outline" size="md">
                            +{thesis.keywords.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <ThesisActionButtons
                      thesisId={thesis.thesisId}
                      initialBookmarked={true}
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
                No theses found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search query or using different keywords
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
