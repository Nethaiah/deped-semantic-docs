"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBookmarkedDocuments() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user)
      return { data: [], error: "User not authenticated" };

    const { data, error } = await supabase
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

    if (error) return { data: [], error: error.message };

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
