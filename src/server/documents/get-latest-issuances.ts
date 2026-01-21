"use server";

import { createClient } from "@/lib/supabase/server";

type IssuanceFilters = {
  fromDate?: string;
  toDate?: string;
  issuer?: string;
  issuerLevel?: "Central" | "Division";
  code?: string;
  title?: string;
  docType?: "Order" | "Memorandum";
  tags?: string[];
};

export async function getLatestIssuances(
  page: number = 1,
  limit: number = 10,
  filters: IssuanceFilters = {}
) {
  const supabase = await createClient();

  const offset = (page - 1) * limit;

  // Build count query with filters
  let countQuery = supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .not("date_issued", "is", null);

  if (filters.fromDate) {
    countQuery = countQuery.gte("date_issued", filters.fromDate);
  }
  if (filters.toDate) {
    const d = new Date(filters.toDate);
    d.setDate(d.getDate() + 1);
    const nextDay = d.toISOString().slice(0, 10);
    countQuery = countQuery.lt("date_issued", nextDay);
  }
  if (filters.issuer && filters.issuer.trim()) {
    countQuery = countQuery.ilike("issuer", `%${filters.issuer.trim()}%`);
  }
  if (filters.issuerLevel) {
    countQuery = countQuery.ilike("issuer", `%${filters.issuerLevel}%`);
  }
  if (filters.code && filters.code.trim()) {
    countQuery = countQuery.ilike("doc_number", `%${filters.code.trim()}%`);
  }
  if (filters.title && filters.title.trim()) {
    countQuery = countQuery.ilike("title", `%${filters.title.trim()}%`);
  }
  if (filters.docType) {
    countQuery = countQuery.ilike("doc_type", `%${filters.docType}%`);
  }
  if (filters.tags && filters.tags.length > 0) {
    countQuery = countQuery.contains("categories", filters.tags);
  }

  const { count } = await countQuery;

  // Get paginated data ordered by date_issued descending (newest first)
  let dataQuery = supabase
    .from("documents")
    .select("doc_id, title, doc_number, issuer, doc_type, date_issued, categories")
    .not("date_issued", "is", null);

  if (filters.fromDate) {
    dataQuery = dataQuery.gte("date_issued", filters.fromDate);
  }
  if (filters.toDate) {
    const d = new Date(filters.toDate);
    d.setDate(d.getDate() + 1);
    const nextDay = d.toISOString().slice(0, 10);
    dataQuery = dataQuery.lt("date_issued", nextDay);
  }
  if (filters.issuer && filters.issuer.trim()) {
    dataQuery = dataQuery.ilike("issuer", `%${filters.issuer.trim()}%`);
  }
  if (filters.issuerLevel) {
    dataQuery = dataQuery.ilike("issuer", `%${filters.issuerLevel}%`);
  }
  if (filters.code && filters.code.trim()) {
    dataQuery = dataQuery.ilike("doc_number", `%${filters.code.trim()}%`);
  }
  if (filters.title && filters.title.trim()) {
    dataQuery = dataQuery.ilike("title", `%${filters.title.trim()}%`);
  }
  if (filters.docType) {
    dataQuery = dataQuery.ilike("doc_type", `%${filters.docType}%`);
  }
  if (filters.tags && filters.tags.length > 0) {
    dataQuery = dataQuery.contains("categories", filters.tags);
  }

  const { data, error } = await dataQuery
    .order("date_issued", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching latest issuances:", error);
    return { data: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

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