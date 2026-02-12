import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
  role,
  page,
  pageSize,
  q,
  sort,
}: {
  role: string;
  page: number;
  pageSize: number;
  q: string;
  sort: BookmarkSortOption;
}) {
  const { data: theses, total } = await getBookmarkedThesesPaginated(
    page,
    pageSize,
    q || undefined,
    sort
  );

  return (
    <BookmarkResults
      role={role}
      theses={theses}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      currentQuery={q || ""}
      currentSort={sort}
    />
  );
}

/* ── Page ── */
export default async function BookmarksPage({ searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userData?.role || "user";

  const { page, q, sort } = await bookmarkSearchParamsCache.parse(searchParams);
  const pageSize = 10;

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header — renders instantly */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Bookmarked Theses
        </h1>
        <p className="text-sm text-gray-600">
          Browse and manage your saved theses
        </p>
      </div>

      {/* Controls — render instantly (no data fetch needed) */}
      <BookmarkControls
        initialQuery={q || ""}
        initialSort={sort as string}
      />

      {/* Results — streams in after data fetch */}
      <Suspense fallback={<BookmarkResultsSkeleton />}>
        <ResultsSection
          role={role}
          page={page}
          pageSize={pageSize}
          q={q || ""}
          sort={sort as BookmarkSortOption}
        />
      </Suspense>
    </div>
  );
}