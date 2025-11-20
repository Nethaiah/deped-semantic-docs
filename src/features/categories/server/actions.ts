"use server";

import { createClient } from "@/lib/supabase/server";

export type CategoryWithCount = {
  name: string;
  count: number;
};

export type CategoryDocument = {
  doc_id: string;
  title: string;
  doc_number: string | null;
  doc_type: string | null;
  issuer: string | null;
  date_issued: string | null;
  summary: string | null;
  categories: string[] | null;
  source_path: string | null;
};

/**
 * Get all unique categories with their document counts
 */
export async function getAllCategories(): Promise<CategoryWithCount[]> {
  try {
    const supabase = await createClient();
    // Try RPC for efficient aggregation if available
    const rpc = await supabase.rpc("category_counts");
    if (!rpc.error && Array.isArray(rpc.data)) {
      const rows = rpc.data as Array<{ name: string; count: number } | { category: string; count: number }>;
      const categories = rows
        .map((r: any) => ({ name: r.name ?? r.category, count: Number(r.count) }))
        .filter((r) => !!r.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      return categories;
    }

    // Fallback: fetch and count in app
    const { data: documents, error } = await supabase.from("documents").select("categories");
    if (error) return [];
    const categoryCounts: Record<string, number> = {};
    documents?.forEach((doc) => {
      if (doc.categories && Array.isArray(doc.categories)) {
        doc.categories.forEach((category) => {
          if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        });
      }
    });
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return categories;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}

/**
 * Get all documents that have a specific category
 */
export async function getDocumentsByCategory(
  categoryName: string
): Promise<{ data: CategoryDocument[]; error: string | null }> {
  try {
    const supabase = await createClient();

    // Query documents where categories array contains the categoryName
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .contains("categories", [categoryName])
      .order("date_issued", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching documents by category:", error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getDocumentsByCategory:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export type CategoryFilters = {
  query?: string;
  fromDate?: string;
  toDate?: string;
  issuerLevel?: string;
  docType?: string;
};

export async function getDocumentsByCategoryPaginated(
  categoryName: string,
  page: number,
  pageSize: number,
  filters: CategoryFilters = {},
  sort: "date_desc" | "date_asc" | "title_asc" | "title_desc" = "date_desc"
): Promise<{ data: CategoryDocument[]; total: number; error: string | null }> {
  try {
    const supabase = await createClient();
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let queryBuilder = supabase
      .from("documents")
      .select("*", { count: "exact" })
      .contains("categories", [categoryName]);

    // --- Filters ---
    if (filters.fromDate) {
      queryBuilder = queryBuilder.gte("date_issued", filters.fromDate);
    }
    if (filters.toDate) {
      queryBuilder = queryBuilder.lte("date_issued", filters.toDate);
    }
    if (filters.issuerLevel) {
      queryBuilder = queryBuilder.ilike("issuer", `%${filters.issuerLevel}%`);
    }
    if (filters.docType) {
      queryBuilder = queryBuilder.ilike("doc_type", `%${filters.docType}%`);
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim();
      const pattern = `%${q}%`;
      queryBuilder = queryBuilder.or(
        [
          `title.ilike.${pattern}`,
          `doc_number.ilike.${pattern}`,
          `issuer.ilike.${pattern}`,
          `summary.ilike.${pattern}`,
        ].join(",")
      );
    }

    // --- Server-Side Sorting ---
    switch (sort) {
      case "date_asc":
        queryBuilder = queryBuilder.order("date_issued", { ascending: true, nullsFirst: false });
        break;
      case "title_asc":
        queryBuilder = queryBuilder.order("title", { ascending: true, nullsFirst: false });
        break;
      case "title_desc":
        queryBuilder = queryBuilder.order("title", { ascending: false, nullsFirst: false });
        break;
      case "date_desc":
      default:
        queryBuilder = queryBuilder.order("date_issued", { ascending: false, nullsFirst: false });
        break;
    }

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      console.error("Error fetching paginated documents by category:", error);
      return { data: [], total: 0, error: error.message };
    }

    return { data: data || [], total: count || 0, error: null };
  } catch (error) {
    console.error("Error in getDocumentsByCategoryPaginated:", error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
