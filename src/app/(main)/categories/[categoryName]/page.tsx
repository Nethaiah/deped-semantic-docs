import { createClient } from "@/lib/supabase/server";
import Category from "@/components/categories/category";
import { redirect } from "next/navigation";
import { getDocumentsByCategoryPaginated, type CategoryFilters } from "@/server/categories/actions";
import { getBookmarkStatusesForDocuments } from "@/server/categories/category-name-actions";

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

  // Extract filters
  const qParam = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const fromDate = Array.isArray(sp.fromDate) ? sp.fromDate[0] : sp.fromDate;
  const toDate = Array.isArray(sp.toDate) ? sp.toDate[0] : sp.toDate;
  const issuerLevel = Array.isArray(sp.issuerLevel) ? sp.issuerLevel[0] : sp.issuerLevel;
  const docType = Array.isArray(sp.docType) ? sp.docType[0] : sp.docType;
  
  // Extract Sort
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const validSorts = ["date_desc", "date_asc", "title_asc", "title_desc"];
  const sort = (validSorts.includes(sortParam || "") ? sortParam : "date_desc") as "date_desc" | "date_asc" | "title_asc" | "title_desc";

  const filters: CategoryFilters = {
    query: qParam || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    issuerLevel: issuerLevel || undefined,
    docType: docType || undefined,
  };

  // Pass 'sort' to the server action
  const { data: documents, total } = await getDocumentsByCategoryPaginated(
    decodedCategoryName, 
    page, 
    pageSize, 
    filters,
    sort
  );

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
      initialQuery={qParam || ""}
      initialFilters={{
        fromDate: fromDate || "",
        toDate: toDate || "",
        issuerLevel: issuerLevel || "",
        docType: docType || "",
      }}
      initialSort={sort}
    />
  );
}