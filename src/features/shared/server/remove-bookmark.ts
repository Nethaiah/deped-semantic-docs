"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function removeBookmark(docId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return { error: "User not authenticated" };

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("doc_id", docId);

    if (error) return { error: error.message };

    revalidatePath("/bookmarks");
    return { success: true };
  } catch {
    return { error: "Failed to remove bookmark" };
  }
}
