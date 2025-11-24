"use server";

import { verifySession } from "@/lib/dal";

export async function getBookmarkedDocuments() {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user)
      return { data: [], error };

    const { data, error: dbError } = await supabase
      .from("bookmarks")
      .select(`
        id,
        created_at,
        documents (
          doc_id,
          title,
          doc_number,
          doc_type,
          issuer,
          date_issued,
          source_path,
          summary,
          categories
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) return { data: [], error: dbError.message };

    const bookmarkedDocs = data.map((bookmark: any) => ({
      id: bookmark.documents.doc_id,
      title: bookmark.documents.title,
      docNumber: bookmark.documents.doc_number,
      docType: bookmark.documents.doc_type,
      issuer: bookmark.documents.issuer,
      dateIssued: bookmark.documents.date_issued,
      sourcePath: bookmark.documents.source_path,
      summary: bookmark.documents.summary,
      categories: bookmark.documents.categories || [],
      bookmarkedAt: bookmark.created_at,
    }));

    return { data: bookmarkedDocs, error: null };
  } catch {
    return { data: [], error: "Failed to fetch bookmarks" };
  }

}

export async function getBookmarkedDocumentsPaginated(
  page: number,
  pageSize: number,
  query?: string,
  sort: "date_desc" | "date_asc" | "title_asc" | "title_desc" = "date_desc"
): Promise<{ data: Array<{
  id: string;
  title?: string | null;
  docNumber?: string | null;
  docType?: string | null;
  issuer?: string | null;
  dateIssued?: string | null;
  summary?: string | null;
  categories?: string[] | null;
}>; total: number; error: string | null }> {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user) {
      return { data: [], total: 0, error: error || "Unauthorized" };
    }

    // Get all bookmarked doc IDs for this user
    const { data: bmIds, error: bmError } = await supabase
      .from("bookmarks")
      .select("doc_id")
      .eq("user_id", user.id);

    if (bmError) {
      return { data: [], total: 0, error: bmError.message };
    }

    const ids = (bmIds || []).map((r: any) => r.doc_id).filter(Boolean);
    if (!ids.length) {
      return { data: [], total: 0, error: null };
    }

    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let qb = supabase
      .from("documents")
      .select("*", { count: "exact" })
      .in("doc_id", ids);

    // Apply Search Query
    if (query && query.trim()) {
      const q = query.trim();
      const pattern = `%${q}%`;
      qb = qb.or(
        [
          `title.ilike.${pattern}`,
          `doc_number.ilike.${pattern}`,
          `issuer.ilike.${pattern}`,
          `summary.ilike.${pattern}`,
        ].join(",")
      );
    }

    // Apply Server-Side Sorting
    switch (sort) {
      case "date_asc":
        qb = qb.order("date_issued", { ascending: true, nullsFirst: false });
        break;
      case "title_asc":
        qb = qb.order("title", { ascending: true, nullsFirst: false });
        break;
      case "title_desc":
        qb = qb.order("title", { ascending: false, nullsFirst: false });
        break;
      case "date_desc":
      default:
        qb = qb.order("date_issued", { ascending: false, nullsFirst: false });
        break;
    }

    const { data, error: dbError, count } = await qb.range(from, to);

    if (dbError) {
      return { data: [], total: 0, error: dbError.message };
    }

    const docs = (data || []).map((d: any) => ({
      id: d.doc_id,
      title: d.title,
      docNumber: d.doc_number,
      docType: d.doc_type,
      issuer: d.issuer,
      dateIssued: d.date_issued,
      summary: d.summary,
      categories: (d.categories as string[]) || [],
    }));

    return { data: docs, total: count || 0, error: null };
  } catch (e) {
    return {
      data: [],
      total: 0,
      error: e instanceof Error ? e.message : "Failed to fetch paginated bookmarks",
    };
  }
}
