"use server";

import { verifySession } from "@/lib/dal";
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
};

/**
 * Get all colleges with their thesis counts
 */
export async function getAllColleges(): Promise<CollegeWithCount[]> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      return [];
    }

    // Get counts for each college
    const colleges: CollegeWithCount[] = [];

    for (const [code, fullName] of Object.entries(COLLEGE_FULL_NAMES)) {
      const { count, error } = await supabase
        .from("theses")
        .select("*", { count: "exact", head: true })
        .eq("college", code);

      if (!error) {
        colleges.push({
          name: code,
          fullName,
          count: count || 0,
        });
      }
    }

    return colleges;
  } catch (error) {
    console.error("Error in getAllColleges:", error);
    return [];
  }
}

export type CollegeFilters = {
  query?: string;
  yearFrom?: string;
  yearTo?: string;
  department?: string;
};

export async function getThesesByCollegePaginated(
  collegeCode: string,
  page: number,
  pageSize: number,
  filters: CollegeFilters = {},
  sort: "year_desc" | "year_asc" | "title_asc" | "title_desc" = "year_desc"
): Promise<{ data: CollegeThesis[]; total: number; error: string | null }> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      return { data: [], total: 0, error: "Unauthorized" };
    }

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

    return { data: data || [], total: count || 0, error: null };
  } catch (error) {
    console.error("Error in getThesesByCollegePaginated:", error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
