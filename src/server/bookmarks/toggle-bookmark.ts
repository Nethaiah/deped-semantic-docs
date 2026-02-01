"use server";

import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(thesisId: string) {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user) return { error };

    // Check if bookmark already exists
    const { data: existing, error: checkError } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("thesis_id", thesisId)
      .maybeSingle();

    if (checkError) return { error: checkError.message };

    if (existing) {
      // Delete bookmark
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("thesis_id", thesisId);

      if (deleteError) return { error: deleteError.message };

      revalidatePath("/bookmarks");
      revalidatePath(`/thesis/${thesisId}`);
      return { success: true, bookmarked: false };
    }

    // Add bookmark
    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ user_id: user.id, thesis_id: thesisId });

    if (insertError) return { error: insertError.message };

    revalidatePath("/bookmarks");
    revalidatePath(`/thesis/${thesisId}`);
    return { success: true, bookmarked: true };
  } catch {
    return { error: "Failed to toggle bookmark" };
  }
}
