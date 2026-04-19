import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import {
  bookmarkSearchParamsCache,
  type BookmarkSortOption,
} from "@/lib/search-params";
import { getBookmarkedThesesPaginated } from "@/server/bookmarks/get-bookmark";

import BookmarkControls from "@/components/bookmarks/bookmark-controls";
import BookmarkResults from "@/components/bookmarks/bookmark-results";
import { BookmarkResultsSkeleton } from "@/components/bookmarks/skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};

/* ── Async data-fetching section (only results need server data) ── */
async function ResultsSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, sort } = await bookmarkSearchParamsCache.parse(searchParams);
  const pageSize = 10;

  const { data: theses, total } = await getBookmarkedThesesPaginated(
    page,
    pageSize,
    q || undefined,
    sort as BookmarkSortOption
  );

  return (
    <BookmarkResults
      theses={theses}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      currentQuery={q || ""}
      currentSort={sort as BookmarkSortOption}
    />
  );
}

/* ── Page ── */
export default function BookmarksPage({ searchParams }: Props) {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header — renders instantly (Part of Static Shell) */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Bookmarked Theses
        </h1>
        <p className="text-sm text-gray-600">
          Browse and manage your saved theses
        </p>
      </div>

      {/* Controls — wraps useSearchParams in Suspense to preserve static shell */}
      <Suspense fallback={<div className="h-10 mb-6 bg-gray-100 rounded-lg animate-pulse w-full"></div>}>
        <BookmarkControls />
      </Suspense>

      {/* Results — streams in after data fetch */}
      <Suspense fallback={<BookmarkResultsSkeleton />}>
        <ResultsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
