"use server";

import { createClient } from "@/lib/supabase/server";

// Type for thesis author
export type ThesisAuthor = {
  authorId: string;
  authorName: string;
  authorOrder: number;
  email?: string;
};

// Type for thesis data matching the theses schema
export type ThesisData = {
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
  authors: ThesisAuthor[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Fetches a thesis by its ID along with its authors
 */
export async function getThesisById(thesisId: string) {
  const supabase = await createClient();

  // Fetch thesis data
  const { data: thesis, error: thesisError } = await supabase
    .from("theses")
    .select("*")
    .eq("thesis_id", thesisId)
    .single();

  if (thesisError || !thesis) {
    return { error: "Thesis not found", data: null };
  }

  // Fetch authors for this thesis
  const { data: authors, error: authorsError } = await supabase
    .from("thesis_authors")
    .select("*")
    .eq("thesis_id", thesisId)
    .order("author_order", { ascending: true });

  if (authorsError) {
    console.error("Error fetching thesis authors:", authorsError);
  }

  // Transform authors data
  const transformedAuthors: ThesisAuthor[] = (authors || []).map((author) => ({
    authorId: author.author_id,
    authorName: author.author_name,
    authorOrder: author.author_order,
    email: author.email || undefined,
  }));

  // Transform thesis data
  const transformedThesis: ThesisData = {
    thesisId: thesis.thesis_id,
    title: thesis.title,
    year: thesis.year,
    department: thesis.department,
    college: thesis.college,
    advisor: thesis.advisor || undefined,
    keywords: thesis.keywords || [],
    abstract: thesis.abstract || undefined,
    summary: thesis.summary || undefined,
    sourcePath: thesis.source_path,
    totalPages: thesis.total_pages || 0,
    authors: transformedAuthors,
    createdAt: thesis.created_at,
    updatedAt: thesis.updated_at,
  };

  return { data: transformedThesis, error: null };
}

/**
 * Fetches similar theses based on keywords or department
 * For now, this returns theses from the same department or with similar keywords
 */
export async function getSimilarTheses(thesisId: string, limit: number = 3) {
  try {
    const supabase = await createClient();

    // First get the current thesis to find its keywords and department
    const { data: currentThesis, error: currentError } = await supabase
      .from("theses")
      .select("keywords, department, college")
      .eq("thesis_id", thesisId)
      .single();

    if (currentError || !currentThesis) {
      return [];
    }

    // Find theses in the same department, excluding the current one
    const { data: similarTheses, error: similarError } = await supabase
      .from("theses")
      .select(`
        thesis_id,
        title,
        year,
        department,
        college,
        keywords,
        thesis_authors!inner(author_name, author_order)
      `)
      .neq("thesis_id", thesisId)
      .eq("department", currentThesis.department)
      .order("year", { ascending: false })
      .limit(limit);

    if (similarError) {
      console.error("Error fetching similar theses:", similarError);
      return [];
    }

    // Transform the data
    const transformed = (similarTheses || []).map((thesis: any) => {
      // Get authors sorted by order
      const authors = (thesis.thesis_authors || [])
        .sort((a: any, b: any) => a.author_order - b.author_order)
        .map((a: any) => a.author_name);

      return {
        thesisId: thesis.thesis_id,
        title: thesis.title,
        year: thesis.year,
        department: thesis.department,
        college: thesis.college,
        keywords: thesis.keywords || [],
        authors,
      };
    });

    return transformed;
  } catch (error) {
    console.error("Error fetching similar theses:", error);
    return [];
  }
}
