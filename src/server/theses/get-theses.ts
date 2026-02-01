"use server";

import { createClient } from "@/lib/supabase/server";

type ThesesFilters = {
  yearFrom?: number;
  yearTo?: number;
  department?: string;
  college?: string;
  title?: string;
};

export type Thesis = {
  id: string;
  title: string;
  year: number;
  department: string;
  college: string;
  keywords: string[];
};

export async function getTheses(
  page: number = 1,
  limit: number = 10,
  filters: ThesesFilters = {}
) {
  const supabase = await createClient();

  const offset = (page - 1) * limit;

  // Build count query with filters
  let countQuery = supabase
    .from("theses")
    .select("*", { count: "exact", head: true });

  if (filters.yearFrom) {
    countQuery = countQuery.gte("year", filters.yearFrom);
  }
  if (filters.yearTo) {
    countQuery = countQuery.lte("year", filters.yearTo);
  }
  if (filters.department && filters.department.trim()) {
    countQuery = countQuery.eq("department", filters.department.trim());
  }
  if (filters.college && filters.college.trim()) {
    countQuery = countQuery.eq("college", filters.college.trim());
  }
  if (filters.title && filters.title.trim()) {
    countQuery = countQuery.ilike("title", `%${filters.title.trim()}%`);
  }

  const { count } = await countQuery;

  // Build data query - order by year descending (newest first)
  let dataQuery = supabase
    .from("theses")
    .select("thesis_id, title, year, department, college, keywords");

  if (filters.yearFrom) {
    dataQuery = dataQuery.gte("year", filters.yearFrom);
  }
  if (filters.yearTo) {
    dataQuery = dataQuery.lte("year", filters.yearTo);
  }
  if (filters.department && filters.department.trim()) {
    dataQuery = dataQuery.eq("department", filters.department.trim());
  }
  if (filters.college && filters.college.trim()) {
    dataQuery = dataQuery.eq("college", filters.college.trim());
  }
  if (filters.title && filters.title.trim()) {
    dataQuery = dataQuery.ilike("title", `%${filters.title.trim()}%`);
  }

  const { data, error } = await dataQuery
    .order("year", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching theses:", error);
    return { data: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data.map((thesis) => ({
      id: thesis.thesis_id,
      title: thesis.title,
      year: thesis.year,
      department: thesis.department,
      college: thesis.college,
      keywords: thesis.keywords ?? [],
    })),
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}
