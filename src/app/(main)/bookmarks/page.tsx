import Bookmarks from "@/components/bookmarks/bookmark";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBookmarkedThesesPaginated } from "@/server/bookmarks/get-bookmark";
import { bookmarkSearchParamsCache, type BookmarkSortOption } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function BookmarksPage({ searchParams }: Props) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get role on the server to avoid client flash
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = userData?.role || "user";

  // Parse search params with nuqs cache
  const { page, q, sort } = await bookmarkSearchParamsCache.parse(searchParams);
  const pageSize = 10;

  const { data: theses, total } = await getBookmarkedThesesPaginated(
    page,
    pageSize,
    q || undefined,
    sort as BookmarkSortOption
  );

  return (
    <Bookmarks
      role={role}
      theses={theses}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      initialQuery={q || ""}
      initialSort={sort as BookmarkSortOption}
    />
  );
}