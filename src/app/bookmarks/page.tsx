import Bookmarks from "@/components/bookmarks/bookmark";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBookmarkedDocumentsPaginated } from "@/server/bookmarks/get-bookmark";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DocumentsPage({ searchParams }: Props) {
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

  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 10;
  const qParam = Array.isArray(sp.q) ? sp.q[0] : sp.q;

  // Extract Sort Parameter
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const validSorts = ["date_desc", "date_asc", "title_asc", "title_desc"];
  const sort = (validSorts.includes(sortParam || "") ? sortParam : "date_desc") as "date_desc" | "date_asc" | "title_asc" | "title_desc";

  const { data: docs, total } = await getBookmarkedDocumentsPaginated(page, pageSize, qParam || undefined, sort);

  return (
    <Bookmarks
      role={role}
      docs={docs}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      initialQuery={qParam || ""}
      initialSort={sort}
    />
  );
}