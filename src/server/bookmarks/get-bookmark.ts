"use server";

import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export type BookmarkedThesis = {
  id: string;
  thesisId: string;
  title: string;
  year: number;
  department: string;
  college: string;
  advisor?: string;
  keywords: string[];
  abstract?: string;
  summary?: string;
  sourcePath: string;
  totalPages: number;
  authors: string[];
  bookmarkedAt: string;
};

/**
 * Get all bookmarked theses for the current user
 */
export async function getBookmarkedTheses() {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user)
      return { data: [], error };

    const { data, error: dbError } = await supabase
      .from("bookmarks")
      .select(`
        id,
        created_at,
        theses (
          thesis_id,
          title,
          year,
          department,
          college,
          advisor,
          keywords,
          abstract,
          summary,
          source_path,
          total_pages
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) return { data: [], error: dbError.message };

    // Fetch authors for each thesis
    const thesisIds = data
      .filter((bookmark: any) => bookmark.theses)
      .map((bookmark: any) => bookmark.theses.thesis_id);

    const { data: allAuthors } = await supabase
      .from("thesis_authors")
      .select("thesis_id, author_name, author_order")
      .in("thesis_id", thesisIds)
      .order("author_order", { ascending: true });

    // Group authors by thesis_id
    const authorsByThesis: Record<string, string[]> = {};
    (allAuthors || []).forEach((author: any) => {
      if (!authorsByThesis[author.thesis_id]) {
        authorsByThesis[author.thesis_id] = [];
      }
      authorsByThesis[author.thesis_id].push(author.author_name);
    });

    const bookmarkedTheses: BookmarkedThesis[] = data
      .filter((bookmark: any) => bookmark.theses)
      .map((bookmark: any) => ({
        id: bookmark.id,
        thesisId: bookmark.theses.thesis_id,
        title: bookmark.theses.title,
        year: bookmark.theses.year,
        department: bookmark.theses.department,
        college: bookmark.theses.college,
        advisor: bookmark.theses.advisor || undefined,
        keywords: bookmark.theses.keywords || [],
        abstract: bookmark.theses.abstract || undefined,
        summary: bookmark.theses.summary || undefined,
        sourcePath: bookmark.theses.source_path,
        totalPages: bookmark.theses.total_pages || 0,
        authors: authorsByThesis[bookmark.theses.thesis_id] || [],
        bookmarkedAt: bookmark.created_at,
      }));

    return { data: bookmarkedTheses, error: null };
  } catch {
    return { data: [], error: "Failed to fetch bookmarks" };
  }
}

/**
 * Get paginated bookmarked theses with search and sort options
 */
export async function getBookmarkedThesesPaginated(
  page: number,
  pageSize: number,
  query?: string,
  sort: "date_desc" | "date_asc" | "title_asc" | "title_desc" | "year_desc" | "year_asc" = "date_desc"
): Promise<{ data: BookmarkedThesis[]; total: number; error: string | null }> {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user) {
      return { data: [], total: 0, error: error || "Unauthorized" };
    }

    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    // For date sorting (by bookmark creation date), we need a different approach
    const isDateSort = sort === "date_desc" || sort === "date_asc";

    if (isDateSort) {
      // Query bookmarks first, sorted by created_at, with thesis data joined
      let bookmarkQuery = supabase
        .from("bookmarks")
        .select(`
          id,
          thesis_id,
          created_at,
          theses!inner (
            thesis_id,
            title,
            year,
            department,
            college,
            advisor,
            keywords,
            abstract,
            summary,
            source_path,
            total_pages
          )
        `, { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: sort === "date_asc" });

      // Apply search filter if provided
      if (query && query.trim()) {
        const q = query.trim();
        const pattern = `%${q}%`;
        bookmarkQuery = bookmarkQuery.or(
          [
            `theses.title.ilike.${pattern}`,
            `theses.department.ilike.${pattern}`,
            `theses.college.ilike.${pattern}`,
            `theses.advisor.ilike.${pattern}`,
            `theses.summary.ilike.${pattern}`,
          ].join(",")
        );
      }

      const { data: bookmarkResults, error: bmError, count } = await bookmarkQuery.range(from, to);

      if (bmError) {
        return { data: [], total: 0, error: bmError.message };
      }

      // Get thesis IDs for author lookup
      const thesisIds = (bookmarkResults || [])
        .filter((b: any) => b.theses)
        .map((b: any) => b.theses.thesis_id);

      // Fetch authors
      const { data: allAuthors } = await supabase
        .from("thesis_authors")
        .select("thesis_id, author_name, author_order")
        .in("thesis_id", thesisIds)
        .order("author_order", { ascending: true });

      const authorsByThesis: Record<string, string[]> = {};
      (allAuthors || []).forEach((author: any) => {
        if (!authorsByThesis[author.thesis_id]) {
          authorsByThesis[author.thesis_id] = [];
        }
        authorsByThesis[author.thesis_id].push(author.author_name);
      });

      const theses: BookmarkedThesis[] = (bookmarkResults || [])
        .filter((b: any) => b.theses)
        .map((b: any) => ({
          id: b.id,
          thesisId: b.theses.thesis_id,
          title: b.theses.title,
          year: b.theses.year,
          department: b.theses.department,
          college: b.theses.college,
          advisor: b.theses.advisor || undefined,
          keywords: b.theses.keywords || [],
          abstract: b.theses.abstract || undefined,
          summary: b.theses.summary || undefined,
          sourcePath: b.theses.source_path,
          totalPages: b.theses.total_pages || 0,
          authors: authorsByThesis[b.theses.thesis_id] || [],
          bookmarkedAt: b.created_at,
        }));

      return { data: theses, total: count || 0, error: null };
    }

    // For non-date sorting (title, year), query theses table directly
    // First get all bookmarked thesis IDs
    const { data: bookmarkData, error: bmError } = await supabase
      .from("bookmarks")
      .select("thesis_id, created_at")
      .eq("user_id", user.id);

    if (bmError) {
      return { data: [], total: 0, error: bmError.message };
    }

    const thesisIds = (bookmarkData || []).map((r: any) => r.thesis_id).filter(Boolean);
    if (!thesisIds.length) {
      return { data: [], total: 0, error: null };
    }

    // Create a map of thesis_id to bookmark created_at
    const bookmarkDates: Record<string, string> = {};
    (bookmarkData || []).forEach((r: any) => {
      bookmarkDates[r.thesis_id] = r.created_at;
    });

    let qb = supabase
      .from("theses")
      .select("*", { count: "exact" })
      .in("thesis_id", thesisIds);

    // Apply Search Query
    if (query && query.trim()) {
      const q = query.trim();
      const pattern = `%${q}%`;
      qb = qb.or(
        [
          `title.ilike.${pattern}`,
          `department.ilike.${pattern}`,
          `college.ilike.${pattern}`,
          `advisor.ilike.${pattern}`,
          `summary.ilike.${pattern}`,
        ].join(",")
      );
    }

    // Apply Server-Side Sorting for non-date sorts
    switch (sort) {
      case "title_asc":
        qb = qb.order("title", { ascending: true, nullsFirst: false });
        break;
      case "title_desc":
        qb = qb.order("title", { ascending: false, nullsFirst: false });
        break;
      case "year_asc":
        qb = qb.order("year", { ascending: true, nullsFirst: false });
        break;
      case "year_desc":
        qb = qb.order("year", { ascending: false, nullsFirst: false });
        break;
      default:
        qb = qb.order("title", { ascending: true, nullsFirst: false });
        break;
    }

    const { data, error: dbError, count } = await qb.range(from, to);

    if (dbError) {
      return { data: [], total: 0, error: dbError.message };
    }

    // Fetch authors for these theses
    const resultThesisIds = (data || []).map((t: any) => t.thesis_id);
    const { data: allAuthors } = await supabase
      .from("thesis_authors")
      .select("thesis_id, author_name, author_order")
      .in("thesis_id", resultThesisIds)
      .order("author_order", { ascending: true });

    // Group authors by thesis_id
    const authorsByThesis: Record<string, string[]> = {};
    (allAuthors || []).forEach((author: any) => {
      if (!authorsByThesis[author.thesis_id]) {
        authorsByThesis[author.thesis_id] = [];
      }
      authorsByThesis[author.thesis_id].push(author.author_name);
    });

    const theses: BookmarkedThesis[] = (data || []).map((d: any) => ({
      id: d.thesis_id,
      thesisId: d.thesis_id,
      title: d.title,
      year: d.year,
      department: d.department,
      college: d.college,
      advisor: d.advisor || undefined,
      keywords: d.keywords || [],
      abstract: d.abstract || undefined,
      summary: d.summary || undefined,
      sourcePath: d.source_path,
      totalPages: d.total_pages || 0,
      authors: authorsByThesis[d.thesis_id] || [],
      bookmarkedAt: bookmarkDates[d.thesis_id] || d.created_at,
    }));

    return { data: theses, total: count || 0, error: null };
  } catch (e) {
    return {
      data: [],
      total: 0,
      error: e instanceof Error ? e.message : "Failed to fetch paginated bookmarks",
    };
  }
}
