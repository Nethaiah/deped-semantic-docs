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
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getDynamicBadgeClasses } from "@/lib/badge-variants";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import ThesisActionButtons from "@/components/shared/thesis-action-buttons";
import NumberedPagination from "@/components/shared/numbered-pagination";
import { BookmarkResultsSkeleton } from "@/components/bookmarks/skeleton";
import { useTheme } from "@/components/theme-context";

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
  theses: BookmarkedThesis[];
  total: number;
  page: number;
  pageSize: number;
  currentQuery: string;
  currentSort: string;
};

export default function BookmarkResults({
  theses,
  total,
  page,
  pageSize,
  currentQuery,
  currentSort,
}: Props) {
  const { theme } = useTheme();
  const activeColor = theme.primary;
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
            <Card
              key={thesis.id}
              className="rounded-xl border-gray-200 p-3 sm:p-4 hover:shadow-md transition-all"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row justify-between gap-3 sm:gap-4">
                  {/* LEFT SECTION */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/view/${thesis.thesisId}`}
                      className="block group"
                    >
                      <h3
                        className="text-sm sm:text-base lg:text-lg font-semibold mb-1 group-hover:underline line-clamp-2"
                        style={{ color: activeColor }}
                      >
                        {thesis.title}
                      </h3>
                    </Link>

                    {/* Authors */}
                    {thesis.authors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 mb-1.5">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {thesis.authors.join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{thesis.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{thesis.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{thesis.college}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    {thesis.summary && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {thesis.summary}
                      </p>
                    )}

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                      {thesis.keywords.slice(0, 5).map((keyword) => (
                        <Badge
                          key={keyword}
                          size="md"
                          className={cn(getDynamicBadgeClasses(keyword), "max-w-full")}
                          title={keyword}
                        >
                          <span className="truncate">{keyword}</span>
                        </Badge>
                      ))}
                      {thesis.keywords.length > 5 && (
                        <Badge variant="outline" size="md" className="shrink-0 max-w-full">
                          <span className="truncate">+{thesis.keywords.length - 5} more</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS — right-aligned on mobile, column on desktop */}
                  <div className="flex justify-end lg:justify-start pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <ThesisActionButtons
                      thesisId={thesis.thesisId}
                      initialBookmarked={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-xl border-gray-200 p-12 text-center">
          <CardContent className="p-0 flex flex-col items-center">
            <div className="text-gray-400 mb-4">
              <SearchIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No theses found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search query or using different keywords
            </p>
          </CardContent>
        </Card>
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
