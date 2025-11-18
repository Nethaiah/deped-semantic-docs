"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBookmarkStatusesForDocuments(
  userId: string,
  docIds: string[]
): Promise<Record<string, boolean>> {
  try {
    const supabase = await createClient();

    if (!docIds || docIds.length === 0) {
      return {};
    }

    const { data: userBookmarks, error } = await supabase
      .from("bookmarks")
      .select("doc_id")
      .eq("user_id", userId)
      .in("doc_id", docIds);

    if (error) {
      return {};
    }

    const statuses: Record<string, boolean> = {};
    (userBookmarks || []).forEach((row: any) => {
      if (row && row.doc_id) statuses[row.doc_id as string] = true;
    });

    return statuses;
  } catch {
    return {};
  }
}
