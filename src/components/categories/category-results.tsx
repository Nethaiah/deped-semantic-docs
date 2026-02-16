"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { CollegeThesis } from "@/server/categories/actions";
import ThesisActionButtons from "@/components/shared/thesis-action-buttons";
import { getDynamicBadgeClasses } from "@/lib/badge-variants";
import { SearchIcon, Users, Calendar, Building } from "lucide-react";
import NumberedPagination from "@/components/shared/numbered-pagination";

type Props = {
  theses: CollegeThesis[];
  bookmarks: Record<string, boolean>;
  total: number;
  page: number;
  pageSize: number;
  collegeCode: string;
  currentFilters: { yearFrom: string; yearTo: string; department: string };
  currentQuery: string;
  currentSort: string;
};

export default function CategoryResults({
  theses,
  bookmarks,
  total,
  page,
  pageSize,
  collegeCode,
  currentFilters,
  currentQuery,
  currentSort,
}: Props) {
  const activeColor = "#3a7c94";
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasAny = total > 0;

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (currentQuery?.trim()) params.set("q", currentQuery.trim());
    if (currentFilters.yearFrom)
      params.set("yearFrom", currentFilters.yearFrom);
    if (currentFilters.yearTo) params.set("yearTo", currentFilters.yearTo);
    if (currentFilters.department)
      params.set("department", currentFilters.department);
    if (currentSort && currentSort !== "year_desc")
      params.set("sort", currentSort);
    return `/categories/${encodeURIComponent(collegeCode)}?${params.toString()}`;
  };

  return (
    <>
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {hasAny ? (
          <span>
            Showing {(page - 1) * pageSize + 1} –{" "}
            {Math.min(page * pageSize, total)} of {total} thesis papers
            {currentFilters.department && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold">
                  {currentFilters.department}
                </span>
              </>
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
                  <Link
                    href={`/view/${thesis.thesis_id}`}
                    className="block group"
                  >
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
                    {thesis.keywords
                      ?.slice(0, 5)
                      .map((keyword: string) => (
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
            onPageChange={() => {}}
          />
        </div>
      )}
    </>
  );
}
