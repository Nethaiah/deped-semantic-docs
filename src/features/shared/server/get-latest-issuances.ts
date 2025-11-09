"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLatestIssuances() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("doc_id, title, doc_number, issuer, date_issued, categories")
    .order("date_issued", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching latest issuances:", error);
    return [];
  }

  return data.map((doc) => ({
    id: doc.doc_id,
    title: doc.title,
    code: doc.doc_number,
    office: doc.issuer,
    issuedDate: new Date(doc.date_issued).toLocaleDateString(),
    tags: doc.categories ?? [],
    slug: doc.doc_id, // or generate your own slug logic
  }));
}
