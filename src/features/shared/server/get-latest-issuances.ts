"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLatestIssuances(page: number = 1, limit: number = 10) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  // Get total count
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  // Get paginated data ordered by date_issued descending (newest first)
  const { data, error } = await supabase
    .from("documents")
    .select("doc_id, title, doc_number, issuer, date_issued, categories")
    .not("date_issued", "is", null) // Filter out null dates
    .order("date_issued", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching latest issuances:", error);
    return { data: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  console.log("First document date:", data[0]?.date_issued); // Debug log

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data.map((doc) => ({
      id: doc.doc_id,
      title: doc.title,
      code: doc.doc_number,
      office: doc.issuer,
      issuedDate: doc.date_issued, // Keep as ISO string, format on client
      tags: doc.categories ?? [],
      slug: doc.doc_id,
    })),
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}