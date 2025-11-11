"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkBookmark(docId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return { bookmarked: false };

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
