"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(docId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return { error: "User not authenticated" };

    // Check if bookmark already exists
    const { data: existing, error: checkError } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("doc_id", docId)
      .maybeSingle();

    if (checkError) return { error: checkError.message };

    if (existing) {
      // Delete bookmark
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("doc_id", docId);

      if (deleteError) return { error: deleteError.message };

      revalidatePath("/bookmarks");
      revalidatePath(`/view/${docId}`);
      return { success: true, bookmarked: false };
    }

    // Add bookmark
    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ user_id: user.id, doc_id: docId });

    if (insertError) return { error: insertError.message };

    revalidatePath("/bookmarks");
    revalidatePath(`/view/${docId}`);
    return { success: true, bookmarked: true };
  } catch {
    return { error: "Failed to toggle bookmark" };
  }
}
