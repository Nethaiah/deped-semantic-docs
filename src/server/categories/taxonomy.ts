"use cache";

import { supabaseStatic } from "@/lib/supabase/static";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Single source of truth for the colleges/departments taxonomy on the
 * frontend.  Replaces the previously hardcoded ``COLLEGE_FULL_NAMES`` /
 * ``COLLEGE_DEPARTMENTS`` maps so admins can add/remove colleges without
 * a code change.
 *
 * The data is mirrored in the FastAPI backend's ``app/colleges.py`` —
 * both read from the same Supabase tables, keeping the AI metadata
 * extraction prompt and the UI in lock-step automatically.
 */

export type DepartmentRow = {
  id: string;
  name: string;
  keywords: string[];
  sort_order: number;
};

export type CollegeRow = {
  code: string;
  full_name: string;
  description: string | null;
  sort_order: number;
  departments: DepartmentRow[];
};

const TAXONOMY_TAG = "colleges-taxonomy";

/**
 * Fetch every college with its departments, sorted by ``sort_order``.
 *
 * Uses the ``"use cache"`` directive so server components share a single
 * snapshot per request.  Mutating server actions revalidate this tag via
 * ``revalidateTag('colleges-taxonomy')``.
 */
export async function getTaxonomy(): Promise<CollegeRow[]> {
  cacheTag(TAXONOMY_TAG);
  cacheLife("minutes");

  const supabase = supabaseStatic;

  const { data: colleges, error: collegesError } = await supabase
    .from("colleges")
    .select("code, full_name, description, sort_order")
    .order("sort_order", { ascending: true })
    .order("code", { ascending: true });

  if (collegesError) {
    console.error("Failed to fetch colleges:", collegesError);
    return [];
  }

  const codes = (colleges || []).map((c) => c.code);
  if (codes.length === 0) return [];

  const { data: departments, error: deptError } = await supabase
    .from("departments")
    .select("id, college_code, name, keywords, sort_order")
    .in("college_code", codes)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (deptError) {
    console.error("Failed to fetch departments:", deptError);
  }

  const byCollege = new Map<string, DepartmentRow[]>();
  for (const d of departments || []) {
    const list = byCollege.get(d.college_code) || [];
    list.push({
      id: String(d.id),
      name: d.name,
      keywords: Array.isArray(d.keywords) ? d.keywords : [],
      sort_order: typeof d.sort_order === "number" ? d.sort_order : 0,
    });
    byCollege.set(d.college_code, list);
  }

  return (colleges || []).map((c) => ({
    code: c.code,
    full_name: c.full_name,
    description: c.description ?? null,
    sort_order: typeof c.sort_order === "number" ? c.sort_order : 0,
    departments: byCollege.get(c.code) || [],
  }));
}

/**
 * Convenience: ``code → full_name`` map (replaces ``COLLEGE_FULL_NAMES``).
 */
export async function getCollegeFullNames(): Promise<Record<string, string>> {
  const taxonomy = await getTaxonomy();
  return taxonomy.reduce<Record<string, string>>((acc, c) => {
    acc[c.code] = c.full_name;
    return acc;
  }, {});
}

/**
 * Convenience: ``code → [department names]`` map
 * (replaces ``COLLEGE_DEPARTMENTS``).
 */
export async function getCollegeDepartments(): Promise<Record<string, string[]>> {
  const taxonomy = await getTaxonomy();
  return taxonomy.reduce<Record<string, string[]>>((acc, c) => {
    acc[c.code] = c.departments.map((d) => d.name);
    return acc;
  }, {});
}

/**
 * Look up departments for a single college code.
 */
export async function getDepartmentsForCollege(
  collegeCode: string
): Promise<string[]> {
  const taxonomy = await getTaxonomy();
  const college = taxonomy.find((c) => c.code === collegeCode);
  return college ? college.departments.map((d) => d.name) : [];
}

export const TAXONOMY_CACHE_TAG = TAXONOMY_TAG;
