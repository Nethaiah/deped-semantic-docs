"use cache";

import { supabaseStatic } from "@/lib/supabase/static";
import { cacheLife, cacheTag } from "next/cache";

export type FilterOptions = {
  departments: string[];
  colleges: string[];
};

/**
 * Fetch unique departments and colleges from the theses table for filter dropdowns.
 * Cached with 'hours' profile — filter options rarely change.
 */
export async function getThesesFilterOptions(): Promise<FilterOptions> {
  cacheTag("filter-options");
  cacheLife("hours");

  const supabase = supabaseStatic;

  // Fetch unique departments
  const { data: deptData } = await supabase
    .from("theses")
    .select("department")
    .order("department", { ascending: true });

  // Fetch unique colleges
  const { data: collegeData } = await supabase
    .from("theses")
    .select("college")
    .order("college", { ascending: true });

  // Extract unique values
  const departments = [...new Set((deptData || []).map((d) => d.department))].filter(Boolean);
  const colleges = [...new Set((collegeData || []).map((c) => c.college))].filter(Boolean);

  return { departments, colleges };
}
