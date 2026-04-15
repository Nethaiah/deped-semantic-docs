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

export type ArchiveStats = {
  totalArchived: number;
  archivedThisMonth: number;
  topCollege: string | null;
};

/**
 * Get aggregate stats for the archive page stat cards.
 * Returns total count, archived-this-month count, and the top college.
 * Cached with 'hours' — archive data rarely changes.
 */
export async function getArchiveStats(): Promise<ArchiveStats> {
  "use cache";
  cacheTag("archived-theses");
  cacheLife("hours");

  const empty: ArchiveStats = {
    totalArchived: 0,
    archivedThisMonth: 0,
    topCollege: null,
  };

  try {
    const supabase = supabaseStatic;

    // 1. Total archived count
    const { count: totalCount, error: countErr } = await supabase
      .from("archived_theses")
      .select("*", { count: "exact", head: true });

    if (countErr) {
      console.error("Error counting archived theses:", countErr);
      return empty;
    }

    // 2. Archived this month
    const now = new Date();
    const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00`;

    const { count: monthCount, error: monthErr } = await supabase
      .from("archived_theses")
      .select("*", { count: "exact", head: true })
      .gte("archived_at", firstOfMonth);

    if (monthErr) {
      console.error("Error counting monthly archived:", monthErr);
    }

    // 3. Top college — fetch all college values and count client-side
    //    (Supabase JS doesn't support GROUP BY, so we select the column)
    const { data: collegeRows, error: collegeErr } = await supabase
      .from("archived_theses")
      .select("college");

    let topCollege: string | null = null;

    if (!collegeErr && collegeRows && collegeRows.length > 0) {
      const counts: Record<string, number> = {};
      for (const row of collegeRows) {
        const c = row.college;
        if (c) {
          counts[c] = (counts[c] || 0) + 1;
        }
      }
      const entries = Object.entries(counts);
      if (entries.length > 0) {
        entries.sort((a, b) => b[1] - a[1]);
        topCollege = entries[0][0];
      }
    }

    return {
      totalArchived: totalCount || 0,
      archivedThisMonth: monthCount || 0,
      topCollege,
    };
  } catch (error) {
    console.error("Error in getArchiveStats:", error);
    return empty;
  }
}
