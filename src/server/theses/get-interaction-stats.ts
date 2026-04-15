"use cache";

import { supabaseStatic } from "@/lib/supabase/static";
import { cacheLife, cacheTag } from "next/cache";

export type InteractionStats = {
  uniqueUsers: number;
  totalQuestions: number;
};

/**
 * Fetch aggregated Q&A interaction stats for a thesis.
 * Returns the count of unique users and total questions asked.
 *
 * Cached with a short TTL and tagged so `logThesisInteraction`
 * can bust it after a new insert.
 */
export async function getInteractionStats(
  thesisId: string
): Promise<InteractionStats> {
  cacheTag("thesis-interactions", `thesis-interactions-${thesisId}`);
  cacheLife("minutes");

  const supabase = supabaseStatic;

  // Fetch all interactions for this thesis (we need user_id for distinct count)
  const { data, error } = await supabase
    .from("thesis_interactions")
    .select("user_id")
    .eq("thesis_id", thesisId);

  if (error) {
    console.error("Error fetching interaction stats:", error);
    return { uniqueUsers: 0, totalQuestions: 0 };
  }

  if (!data || data.length === 0) {
    return { uniqueUsers: 0, totalQuestions: 0 };
  }

  const totalQuestions = data.length;
  const uniqueUsers = new Set(data.map((row) => row.user_id)).size;

  return { uniqueUsers, totalQuestions };
}
