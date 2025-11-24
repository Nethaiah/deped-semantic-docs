"use server";

import { verifySession } from "@/lib/dal";

export async function checkBookmark(docId: string) {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) return { bookmarked: false };

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("doc_id", docId)
      .maybeSingle();

    if (error) return { bookmarked: false };
    return { bookmarked: !!data };
  } catch {
    return { bookmarked: false };
  }
}
