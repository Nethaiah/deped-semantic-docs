import { createClient } from "@/lib/supabase/server";
import Category from "../../../features/categories/categories-name/components/category";
import { redirect } from "next/navigation";
import { getDocumentsByCategoryPaginated } from "@/features/categories/server/actions";
import { getBookmarkStatusesForDocuments } from "@/features/categories/categories-name/server/actions";

type Props = {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { categoryName } = await params;
  const decodedCategoryName = decodeURIComponent(categoryName);
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 10;

  const { data: documents, total } = await getDocumentsByCategoryPaginated(decodedCategoryName, page, pageSize);

  // Batch fetch bookmarks for all documents in a single query
  const bookmarkStatuses: Record<string, boolean> =
    documents && documents.length > 0
      ? await getBookmarkStatusesForDocuments(
          user.id,
          documents.map((d) => d.doc_id)
        )
      : {};

  return (
    <Category
      categoryName={decodedCategoryName}
      initialDocuments={documents || []}
      initialBookmarks={bookmarkStatuses}
      total={total || 0}
      page={page}
      pageSize={pageSize}
    />
  );
}