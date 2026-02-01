"use server";

import { createClient } from "@/lib/supabase/server";

export type FilterOptions = {
  departments: string[];
  colleges: string[];
};

/**
 * Fetch unique departments and colleges from the theses table for filter dropdowns
 */
export async function getThesesFilterOptions(): Promise<FilterOptions> {
  const supabase = await createClient();

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
