import { supabaseStatic } from "@/lib/supabase/static";
import { COLLEGE_FULL_NAMES } from "./constants";

export type CollegeWithCount = {
  name: string;
  fullName: string;
  count: number;
};

export type CollegeThesis = {
  thesis_id: string;
  title: string;
  year: number | null;
  department: string | null;
  college: string | null;
  keywords: string[] | null;
  advisor: string | null;
  abstract: string | null;
  summary: string | null;
  authors: string[] | null;
};

/**
 * Get all colleges with their thesis counts.
 * Fetch dynamically so counts always reflect the latest theses.
 */
export async function getAllColleges(): Promise<CollegeWithCount[]> {
  try {
    const supabase = supabaseStatic;
    const colleges = await Promise.all(
      Object.entries(COLLEGE_FULL_NAMES).map(async ([code, fullName]) => {
        const { count, error } = await supabase
          .from("theses")
          .select("*", { count: "exact", head: true })
          .eq("college", code);

        if (error) {
          console.error(`Error getting count for ${code}:`, error);
        }

        return {
          name: code,
          fullName,
          count: error ? 0 : count || 0,
        };
      })
    );

    return colleges;
  } catch (error) {
    console.error("Error in getAllColleges:", error);
    return [];
  }
}

/**
 * Get a live count for a specific college.
 */
export async function getCollegeCount(collegeCode: string): Promise<number> {
  try {
    const supabase = supabaseStatic;
    const { count, error } = await supabase
      .from("theses")
      .select("*", { count: "exact", head: true })
      .eq("college", collegeCode);

    if (error) {
      if (!isPrerenderAbortError(error)) {
        console.error(`Error getting count for ${collegeCode}:`, error);
      }
      return 0;
    }

    return count || 0;
  } catch (error) {
    if (!isPrerenderAbortError(error)) {
      console.error(`Error in getCollegeCount for ${collegeCode}:`, error);
    }
    return 0;
  }
}

export type CollegeFilters = {
  query?: string;
  yearFrom?: string;
  yearTo?: string;
  department?: string;
};

/**
 * Get paginated theses for a specific college with filters and sorting.
 * Fetch dynamically so result counts stay exact on every request.
 */
export async function getThesesByCollegePaginated(
  collegeCode: string,
  page: number,
  pageSize: number,
  filters: CollegeFilters = {},
  sort: "year_desc" | "year_asc" | "title_asc" | "title_desc" = "year_desc"
): Promise<{ data: CollegeThesis[]; total: number; error: string | null }> {
  try {
    const supabase = supabaseStatic;

    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let queryBuilder = supabase
      .from("theses")
      .select("thesis_id, title, year, department, college, keywords, advisor, abstract, summary", { count: "exact" })
      .eq("college", collegeCode);

    // --- Filters ---
    if (filters.yearFrom) {
      const yearFromNum = parseInt(filters.yearFrom);
      if (!isNaN(yearFromNum)) {
        queryBuilder = queryBuilder.gte("year", yearFromNum);
      }
    }
    if (filters.yearTo) {
      const yearToNum = parseInt(filters.yearTo);
      if (!isNaN(yearToNum)) {
        queryBuilder = queryBuilder.lte("year", yearToNum);
      }
    }
    if (filters.department && filters.department.trim()) {
      queryBuilder = queryBuilder.eq("department", filters.department.trim());
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim();
      const pattern = `%${q}%`;
      queryBuilder = queryBuilder.or(
        [
          `title.ilike.${pattern}`,
          `abstract.ilike.${pattern}`,
        ].join(",")
      );
    }

    // --- Server-Side Sorting ---
    switch (sort) {
      case "year_asc":
        queryBuilder = queryBuilder.order("year", { ascending: true, nullsFirst: false });
        break;
      case "title_asc":
        queryBuilder = queryBuilder.order("title", { ascending: true, nullsFirst: false });
        break;
      case "title_desc":
        queryBuilder = queryBuilder.order("title", { ascending: false, nullsFirst: false });
        break;
      case "year_desc":
      default:
        queryBuilder = queryBuilder.order("year", { ascending: false, nullsFirst: false });
        break;
    }

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      console.error("Error fetching paginated theses by college:", error);
      return { data: [], total: 0, error: error.message };
    }

    // Filter out null results if any
    const rawTheses = data || [];

    if (rawTheses.length === 0) {
      return { data: [], total: count || 0, error: null };
    }

    // Fetch authors for these theses
    const thesisIds = rawTheses.map((t) => t.thesis_id);
    const { data: allAuthors } = await supabase
      .from("thesis_authors")
      .select("thesis_id, author_name, author_order")
      .in("thesis_id", thesisIds)
      .order("author_order", { ascending: true });

    // Group authors by thesis_id
    const authorsByThesis: Record<string, string[]> = {};
    (allAuthors || []).forEach((author) => {
      if (!authorsByThesis[author.thesis_id]) {
        authorsByThesis[author.thesis_id] = [];
      }
      authorsByThesis[author.thesis_id].push(author.author_name);
    });

    // Map authors to theses
    const thesesWithAuthors: CollegeThesis[] = rawTheses.map((t) => ({
      ...t,
      authors: authorsByThesis[t.thesis_id] || [],
    }));

    return { data: thesesWithAuthors, total: count || 0, error: null };
  } catch (error) {
    console.error("Error in getThesesByCollegePaginated:", error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function isPrerenderAbortError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "";

  return (
    message.includes(
      "During prerendering, fetch() rejects when the prerender is complete"
    ) ||
    message.includes(
      "During prerendering, `cookies()` rejects when the prerender is complete"
    )
  );
}
