"use server";

import { verifySession } from "@/lib/dal";

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
 * 
 * Approach:
 * 1. Get all bookmark records for user with thesis_id and created_at
 * 2. Query theses table with search/sort/pagination applied
 * 3. Filter to only include bookmarked thesis_ids
 * 4. For date sorting, do post-processing sort by bookmark created_at
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

    // Step 1: Get all bookmarked thesis IDs for this user
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

    // Create a map of thesis_id to bookmark created_at for date sorting
    const bookmarkDates: Record<string, string> = {};
    (bookmarkData || []).forEach((r: any) => {
      bookmarkDates[r.thesis_id] = r.created_at;
    });

    // Step 2: Query theses table with search filter
    let thesisQuery = supabase
      .from("theses")
      .select("*", { count: "exact" })
      .in("thesis_id", thesisIds);

    // Apply search filter
    if (query && query.trim()) {
      const q = query.trim();
      const pattern = `%${q}%`;
      thesisQuery = thesisQuery.or(
        [
          `title.ilike.${pattern}`,
          `department.ilike.${pattern}`,
          `college.ilike.${pattern}`,
          `advisor.ilike.${pattern}`,
          `summary.ilike.${pattern}`,
          `abstract.ilike.${pattern}`,
        ].join(",")
      );
    }

    // Step 3: For date sorting, we need to fetch all matching theses first, then sort by bookmark date
    const isDateSort = sort === "date_desc" || sort === "date_asc";

    if (isDateSort) {
      // Fetch all matching theses (without pagination yet)
      const { data: allTheses, error: thesisError, count } = await thesisQuery;

      if (thesisError) {
        return { data: [], total: 0, error: thesisError.message };
      }

      // Sort by bookmark created_at
      const sortedTheses = (allTheses || []).sort((a: any, b: any) => {
        const dateA = new Date(bookmarkDates[a.thesis_id] || 0).getTime();
        const dateB = new Date(bookmarkDates[b.thesis_id] || 0).getTime();
        return sort === "date_asc" ? dateA - dateB : dateB - dateA;
      });

      // Apply pagination
      const from = Math.max(0, (page - 1) * pageSize);
      const paginatedTheses = sortedTheses.slice(from, from + pageSize);

      // Fetch authors for these theses
      const resultThesisIds = paginatedTheses.map((t: any) => t.thesis_id);
      const { data: allAuthors } = await supabase
        .from("thesis_authors")
        .select("thesis_id, author_name, author_order")
        .in("thesis_id", resultThesisIds)
        .order("author_order", { ascending: true });

      const authorsByThesis: Record<string, string[]> = {};
      (allAuthors || []).forEach((author: any) => {
        if (!authorsByThesis[author.thesis_id]) {
          authorsByThesis[author.thesis_id] = [];
        }
        authorsByThesis[author.thesis_id].push(author.author_name);
      });

      const theses: BookmarkedThesis[] = paginatedTheses.map((d: any) => ({
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

      return { data: theses, total: count || sortedTheses.length, error: null };
    }

    // Step 4: For non-date sorting, apply sorting and pagination directly in the query
    switch (sort) {
      case "title_asc":
        thesisQuery = thesisQuery.order("title", { ascending: true, nullsFirst: false });
        break;
      case "title_desc":
        thesisQuery = thesisQuery.order("title", { ascending: false, nullsFirst: false });
        break;
      case "year_asc":
        thesisQuery = thesisQuery.order("year", { ascending: true, nullsFirst: false });
        break;
      case "year_desc":
        thesisQuery = thesisQuery.order("year", { ascending: false, nullsFirst: false });
        break;
      default:
        thesisQuery = thesisQuery.order("title", { ascending: true, nullsFirst: false });
        break;
    }

    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    const { data, error: dbError, count } = await thesisQuery.range(from, to);

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
