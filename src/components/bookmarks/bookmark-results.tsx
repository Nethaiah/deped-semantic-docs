"use client";

import Link from "next/link";
import {
  SearchIcon,
  Users,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDynamicBadgeClasses } from "@/lib/badge-variants";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import ThesisActionButtons from "@/components/shared/thesis-action-buttons";
import NumberedPagination from "@/components/shared/numbered-pagination";
import { BookmarkResultsSkeleton } from "@/components/bookmarks/skeleton";

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
  total: number;
  page: number;
  pageSize: number;
  currentQuery: string;
  currentSort: string;
};

export default function BookmarkResults({
  role,
  theses,
  total,
  page,
  pageSize,
  currentQuery,
  currentSort,
}: Props) {
  const activeColor =
    String(role).toLowerCase() === "admin" ? "#008c8b" : "#3a7c94";
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasAny = total > 0;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(buildHref(newPage));
    });
  };

  if (isPending) {
    return <BookmarkResultsSkeleton />;
  }

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (currentQuery?.trim()) params.set("q", currentQuery.trim());
    if (currentSort && currentSort !== "date_desc")
      params.set("sort", currentSort);
    return `/bookmarks?${params.toString()}`;
  };

  return (
    <>
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {hasAny ? (
          <span>
            Showing {(page - 1) * pageSize + 1} –{" "}
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
                  <Link
                    href={`/view/${thesis.thesisId}`}
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
  );
}
