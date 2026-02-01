"use server";

import { verifySession } from "@/lib/dal";

export async function checkBookmark(thesisId: string) {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) return { bookmarked: false };

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("thesis_id", thesisId)
      .maybeSingle();

    if (error) return { bookmarked: false };
    return { bookmarked: !!data };
  } catch {
    return { bookmarked: false };
  }
}
