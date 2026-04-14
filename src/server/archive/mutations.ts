"use server";

import { verifySession, getCurrentUserRole } from "@/lib/dal";
import { updateTag } from "next/cache";

/**
 * Archive a thesis: copies from `theses` → `archived_theses`,
 * then deletes from `theses`, `thesis_authors`, `thesis_chunks`.
 */
export async function archiveThesis(
  thesisId: string,
  reason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = await getCurrentUserRole();
    if (!userRole?.isAdmin) {
      return { success: false, error: "Forbidden: Admin access required" };
    }

    const supabase = session.supabase;

    // 1. Fetch the thesis
    const { data: thesis, error: fetchError } = await supabase
      .from("theses")
      .select("*")
      .eq("thesis_id", thesisId)
      .single();

    if (fetchError || !thesis) {
      return {
        success: false,
        error: fetchError?.message || "Thesis not found",
      };
    }

    // 2. Fetch authors for denormalization
    const { data: authors } = await supabase
      .from("thesis_authors")
      .select("author_name, author_order")
      .eq("thesis_id", thesisId)
      .order("author_order", { ascending: true });

    const authorNames = (authors || []).map((a) => a.author_name);

    // 3. Insert into archived_theses
    const { error: insertError } = await supabase
      .from("archived_theses")
      .insert({
        thesis_id: thesisId,
        title: thesis.title,
        year: thesis.year,
        department: thesis.department,
        college: thesis.college,
        advisor: thesis.advisor,
        keywords: thesis.keywords,
        abstract: thesis.abstract,
        summary: thesis.summary,
        source_path: thesis.source_path,
        total_pages: thesis.total_pages,
        authors: authorNames,
        archived_by: session.user.id,
        archive_reason: reason || null,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 4. Delete related data in order (chunks → authors → bookmarks → views → thesis)
    await supabase.from("thesis_chunks").delete().eq("thesis_id", thesisId);
    await supabase.from("thesis_authors").delete().eq("thesis_id", thesisId);
    await supabase.from("bookmarks").delete().eq("thesis_id", thesisId);
    await supabase.from("recently_view").delete().eq("thesis_id", thesisId);

    const { error: deleteError } = await supabase
      .from("theses")
      .delete()
      .eq("thesis_id", thesisId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 5. Invalidate caches
    updateTag("archived-theses");
    updateTag("theses");
    updateTag("colleges");
    updateTag("dashboard-stats");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error archiving thesis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Restore a thesis from the archive back into the `theses` table.
 * Re-creates `thesis_authors` rows from the denormalized authors array.
 */
export async function restoreThesis(
  archiveId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = await getCurrentUserRole();
    if (!userRole?.isAdmin) {
      return { success: false, error: "Forbidden: Admin access required" };
    }

    const supabase = session.supabase;

    // 1. Fetch the archived record
    const { data: archived, error: fetchError } = await supabase
      .from("archived_theses")
      .select("*")
      .eq("id", archiveId)
      .single();

    if (fetchError || !archived) {
      return {
        success: false,
        error: fetchError?.message || "Archived thesis not found",
      };
    }

    // 2. Re-insert into theses
    const { error: insertError } = await supabase.from("theses").insert({
      thesis_id: archived.thesis_id,
      title: archived.title,
      year: archived.year,
      department: archived.department,
      college: archived.college,
      advisor: archived.advisor,
      keywords: archived.keywords,
      abstract: archived.abstract,
      summary: archived.summary,
      source_path: archived.source_path,
      total_pages: archived.total_pages,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 3. Re-create thesis_authors from denormalized array
    const restoredAuthors: string[] = archived.authors || [];
    if (restoredAuthors.length > 0) {
      const authorRows = restoredAuthors.map(
        (name: string, idx: number) => ({
          thesis_id: archived.thesis_id,
          author_name: name,
          author_order: idx + 1,
        })
      );

      await supabase.from("thesis_authors").insert(authorRows);
    }

    // 4. Delete from archived_theses
    const { error: deleteError } = await supabase
      .from("archived_theses")
      .delete()
      .eq("id", archiveId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 5. Invalidate caches
    updateTag("archived-theses");
    updateTag("theses");
    updateTag("colleges");
    updateTag("dashboard-stats");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error restoring thesis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Permanently delete an archived thesis. This is irreversible.
 */
export async function deleteArchivedThesisPermanently(
  archiveId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return { success: false, error: "Unauthorized" };
    }

    const userRole = await getCurrentUserRole();
    if (!userRole?.isAdmin) {
      return { success: false, error: "Forbidden: Admin access required" };
    }

    const { error } = await session.supabase
      .from("archived_theses")
      .delete()
      .eq("id", archiveId);

    if (error) {
      return { success: false, error: error.message };
    }

    updateTag("archived-theses");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error permanently deleting archived thesis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ── Batch Operations ──────────────────────────────────────────────────────────

type BatchResult = {
  success: boolean;
  completed: number;
  failed: number;
  error: string | null;
};

/**
 * Batch-restore multiple archived theses.
 * Delegates to the single `restoreThesis` for each ID so the full
 * copy-back logic (authors, cache tags) is preserved.
 */
export async function batchRestoreTheses(
  archiveIds: string[]
): Promise<BatchResult> {
  const session = await verifySession();
  if (!session.isAuth) {
    return { success: false, completed: 0, failed: archiveIds.length, error: "Unauthorized" };
  }

  const role = await getCurrentUserRole();
  if (!role?.isAdmin) {
    return { success: false, completed: 0, failed: archiveIds.length, error: "Forbidden: Admin access required" };
  }

  let completed = 0;
  let failed = 0;

  for (const id of archiveIds) {
    const result = await restoreThesis(id);
    if (result.success) {
      completed++;
    } else {
      failed++;
    }
  }

  return {
    success: failed === 0,
    completed,
    failed,
    error: failed > 0 ? `${failed} of ${archiveIds.length} failed to restore` : null,
  };
}

/**
 * Batch-delete multiple archived theses permanently.
 * Uses a single `.in()` query for efficiency since permanent deletes
 * are simple row deletions with no cascading copy logic.
 */
export async function batchDeleteArchivedThesesPermanently(
  archiveIds: string[]
): Promise<BatchResult> {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return { success: false, completed: 0, failed: archiveIds.length, error: "Unauthorized" };
    }

    const role = await getCurrentUserRole();
    if (!role?.isAdmin) {
      return { success: false, completed: 0, failed: archiveIds.length, error: "Forbidden: Admin access required" };
    }

    const { error } = await session.supabase
      .from("archived_theses")
      .delete()
      .in("id", archiveIds);

    if (error) {
      return { success: false, completed: 0, failed: archiveIds.length, error: error.message };
    }

    updateTag("archived-theses");

    return {
      success: true,
      completed: archiveIds.length,
      failed: 0,
      error: null,
    };
  } catch (error) {
    console.error("Error batch-deleting archived theses:", error);
    return {
      success: false,
      completed: 0,
      failed: archiveIds.length,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
