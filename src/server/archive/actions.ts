import { supabaseStatic } from "@/lib/supabase/static";
import { cacheLife, cacheTag } from "next/cache";

// ── Types ────────────────────────────────────────────────────────────────────

export type ArchivedThesisRecord = {
  id: string;
  thesis_id: string;
  title: string;
  year: number | null;
  department: string | null;
  college: string | null;
  advisor: string | null;
  keywords: string[] | null;
  abstract: string | null;
  summary: string | null;
  source_path: string | null;
  total_pages: number | null;
  authors: string[] | null;
  archived_by: string | null;
  archive_reason: string | null;
  archived_at: string;
  created_at: string;
};

export type ArchiveFilters = {
  query?: string;
  college?: string;
};

export type ArchiveSortOption =
  | "archived_desc"
  | "archived_asc"
  | "title_asc"
  | "title_desc"
  | "year_desc"
  | "year_asc";

// ── Cached Reads (use cache + supabaseStatic) ────────────────────────────────

/**
 * Get paginated archived theses with optional filters and sorting.
 * Cached with 'hours' — archive data rarely changes. Mutations call
 * updateTag("archived-theses") to invalidate immediately when needed.
 */
export async function getArchivedThesesPaginated(
  page: number,
  pageSize: number,
  filters: ArchiveFilters = {},
  sort: ArchiveSortOption = "archived_desc"
): Promise<{ data: ArchivedThesisRecord[]; total: number; error: string | null }> {
  "use cache";
  cacheTag("archived-theses");
  cacheLife("hours");

  try {
    const supabase = supabaseStatic;
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let queryBuilder = supabase
      .from("archived_theses")
      .select("*", { count: "exact" });

    // ── Filters ──
    if (filters.college && filters.college.trim()) {
      queryBuilder = queryBuilder.eq("college", filters.college.trim());
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim();
      const pattern = `%${q}%`;
      queryBuilder = queryBuilder.or(
        [`title.ilike.${pattern}`, `abstract.ilike.${pattern}`].join(",")
      );
    }

    // ── Sorting ──
    switch (sort) {
      case "archived_asc":
        queryBuilder = queryBuilder.order("archived_at", { ascending: true });
        break;
      case "title_asc":
        queryBuilder = queryBuilder.order("title", { ascending: true });
        break;
      case "title_desc":
        queryBuilder = queryBuilder.order("title", { ascending: false });
        break;
      case "year_asc":
        queryBuilder = queryBuilder.order("year", {
          ascending: true,
          nullsFirst: false,
        });
        break;
      case "year_desc":
        queryBuilder = queryBuilder.order("year", {
          ascending: false,
          nullsFirst: false,
        });
        break;
      case "archived_desc":
      default:
        queryBuilder = queryBuilder.order("archived_at", { ascending: false });
        break;
    }

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      console.error("Error fetching archived theses:", error);
      return { data: [], total: 0, error: error.message };
    }

    return {
      data: (data as ArchivedThesisRecord[]) || [],
      total: count || 0,
      error: null,
    };
  } catch (error) {
    console.error("Error in getArchivedThesesPaginated:", error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get total count of archived theses for stat cards.
 * Cached with 'hours' — same rationale as above.
 */
export async function getArchivedThesesCount(): Promise<number> {
  "use cache";
  cacheTag("archived-theses");
  cacheLife("hours");

  try {
    const { count, error } = await supabaseStatic
      .from("archived_theses")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error counting archived theses:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getArchivedThesesCount:", error);
    return 0;
  }
}
