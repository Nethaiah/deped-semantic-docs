"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TAXONOMY_CACHE_TAG } from "./taxonomy";

/**
 * Admin server actions for managing the colleges/departments taxonomy.
 *
 * Every action runs the same admin check used in user-management:
 *   1. Resolve the current Supabase session.
 *   2. Verify the caller's row in ``users`` has ``role = 'admin'``.
 *   3. Mutate the ``colleges`` / ``departments`` table.
 *   4. Invalidate the ``colleges-taxonomy`` cache tag so dependent UIs
 *      (categories grid, filter dialogs, upload review) see the change
 *      on the next render.
 *
 * Supabase RLS provides defence-in-depth — even if one of these checks
 * is bypassed, the policy ``colleges_admin_all`` / ``departments_admin_all``
 * will reject the mutation.
 */

type ActionResult<T = undefined> = T extends undefined
  ? { error: string } | { success: true }
  : { error: string } | ({ success: true } & T);

async function getAdminSupabase() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "Unauthorized" as const };
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRow?.role !== "admin") {
    return { supabase: null, error: "Forbidden: Admin access required" as const };
  }

  return { supabase, error: null };
}

function bumpTaxonomyCache() {
  updateTag(TAXONOMY_CACHE_TAG);
  // Theses filter dropdowns also derive from this list.
  updateTag("filter-options");
}

function normaliseCode(code: string): string {
  return code.trim().toUpperCase();
}

function cleanKeywords(keywords: string[] | undefined): string[] {
  if (!keywords) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of keywords) {
    const kw = (raw || "").trim().toLowerCase();
    if (kw && !seen.has(kw)) {
      seen.add(kw);
      out.push(kw);
    }
  }
  return out;
}

// ── COLLEGES ────────────────────────────────────────────────────────────────

export async function createCollege(input: {
  code: string;
  fullName: string;
  description?: string;
  sortOrder?: number;
}): Promise<ActionResult<{ code: string }>> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const code = normaliseCode(input.code);
  const fullName = (input.fullName || "").trim();

  if (!/^[A-Z][A-Z0-9]{1,11}$/.test(code)) {
    return {
      error: "Code must be 2–12 characters, uppercase letters/numbers only.",
    };
  }
  if (fullName.length < 2) {
    return { error: "Full name is too short." };
  }

  const { error: insertError } = await supabase!
    .from("colleges")
    .insert({
      code,
      full_name: fullName,
      description: input.description?.trim() || null,
      sort_order: input.sortOrder ?? 0,
    });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: `College '${code}' already exists.` };
    }
    console.error("Failed to create college:", insertError);
    return { error: "Failed to create college." };
  }

  bumpTaxonomyCache();
  return { success: true, code };
}

export async function updateCollege(input: {
  code: string;
  fullName?: string;
  description?: string | null;
  sortOrder?: number;
}): Promise<ActionResult> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const code = normaliseCode(input.code);
  const update: Record<string, unknown> = {};

  if (input.fullName !== undefined) {
    const trimmed = input.fullName.trim();
    if (trimmed.length < 2) return { error: "Full name is too short." };
    update.full_name = trimmed;
  }
  if (input.description !== undefined) {
    update.description = input.description?.trim() || null;
  }
  if (input.sortOrder !== undefined) {
    update.sort_order = input.sortOrder;
  }

  if (Object.keys(update).length === 0) {
    return { error: "No fields provided to update." };
  }

  const { error: updateError } = await supabase!
    .from("colleges")
    .update(update)
    .eq("code", code);

  if (updateError) {
    console.error("Failed to update college:", updateError);
    return { error: "Failed to update college." };
  }

  bumpTaxonomyCache();
  return { success: true };
}

export async function deleteCollege(input: {
  code: string;
}): Promise<ActionResult> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const code = normaliseCode(input.code);

  const { count, error: countError } = await supabase!
    .from("theses")
    .select("thesis_id", { count: "exact", head: true })
    .eq("college", code);

  if (countError) {
    console.error("Failed to check thesis usage:", countError);
    return { error: "Failed to verify college usage." };
  }

  if ((count ?? 0) > 0) {
    return {
      error: `Cannot delete '${code}' — ${count} thesis record(s) still reference this college.`,
    };
  }

  const { error: deleteError } = await supabase!
    .from("colleges")
    .delete()
    .eq("code", code);

  if (deleteError) {
    console.error("Failed to delete college:", deleteError);
    return { error: "Failed to delete college." };
  }

  bumpTaxonomyCache();
  return { success: true };
}

// ── DEPARTMENTS ─────────────────────────────────────────────────────────────

export async function createDepartment(input: {
  collegeCode: string;
  name: string;
  keywords?: string[];
  sortOrder?: number;
}): Promise<ActionResult<{ id: string }>> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const collegeCode = normaliseCode(input.collegeCode);
  const name = (input.name || "").trim();

  if (name.length < 2) return { error: "Department name is too short." };

  const { data: insertData, error: insertError } = await supabase!
    .from("departments")
    .insert({
      college_code: collegeCode,
      name,
      keywords: cleanKeywords(input.keywords),
      sort_order: input.sortOrder ?? 0,
    })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: `'${name}' already exists in ${collegeCode}.` };
    }
    if (insertError.code === "23503") {
      return { error: `College '${collegeCode}' does not exist.` };
    }
    console.error("Failed to create department:", insertError);
    return { error: "Failed to create department." };
  }

  bumpTaxonomyCache();
  return { success: true, id: String(insertData.id) };
}

export async function updateDepartment(input: {
  id: string;
  name?: string;
  keywords?: string[];
  sortOrder?: number;
}): Promise<ActionResult> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const update: Record<string, unknown> = {};

  if (input.name !== undefined) {
    const trimmed = input.name.trim();
    if (trimmed.length < 2) return { error: "Department name is too short." };
    update.name = trimmed;
  }
  if (input.keywords !== undefined) {
    update.keywords = cleanKeywords(input.keywords);
  }
  if (input.sortOrder !== undefined) {
    update.sort_order = input.sortOrder;
  }

  if (Object.keys(update).length === 0) {
    return { error: "No fields provided to update." };
  }

  const { error: updateError } = await supabase!
    .from("departments")
    .update(update)
    .eq("id", input.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "A department with that name already exists in this college." };
    }
    console.error("Failed to update department:", updateError);
    return { error: "Failed to update department." };
  }

  bumpTaxonomyCache();
  return { success: true };
}

export async function deleteDepartment(input: {
  id: string;
}): Promise<ActionResult> {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { error };

  const { data: dept, error: lookupError } = await supabase!
    .from("departments")
    .select("college_code, name")
    .eq("id", input.id)
    .single();

  if (lookupError || !dept) {
    return { error: "Department not found." };
  }

  const { count, error: countError } = await supabase!
    .from("theses")
    .select("thesis_id", { count: "exact", head: true })
    .eq("college", dept.college_code)
    .eq("department", dept.name);

  if (countError) {
    console.error("Failed to check department usage:", countError);
    return { error: "Failed to verify department usage." };
  }

  if ((count ?? 0) > 0) {
    return {
      error: `Cannot delete '${dept.name}' — ${count} thesis record(s) still reference this department.`,
    };
  }

  const { error: deleteError } = await supabase!
    .from("departments")
    .delete()
    .eq("id", input.id);

  if (deleteError) {
    console.error("Failed to delete department:", deleteError);
    return { error: "Failed to delete department." };
  }

  bumpTaxonomyCache();
  return { success: true };
}
