"use server";

import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function removeBookmark(thesisId: string) {
  try {
    const { isAuth, user, supabase, error } = await verifySession();

    if (!isAuth || !user) return { error };

    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("thesis_id", thesisId);

    if (deleteError) return { error: deleteError.message };

    revalidatePath("/bookmarks");
    revalidatePath(`/thesis/${thesisId}`);
    return { success: true };
  } catch {
    return { error: "Failed to remove bookmark" };
  }
}
