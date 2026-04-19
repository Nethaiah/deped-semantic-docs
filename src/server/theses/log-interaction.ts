"use server";

import { verifySession } from "@/lib/dal";
import { updateTag } from "next/cache";

/**
 * Log a Q&A interaction for the current user on a thesis.
 * Called client-side after a successful documentQA response.
 */
export async function logThesisInteraction(
  thesisId: string,
  question: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAuth, user, supabase, error: authError } = await verifySession();

    if (!isAuth || !user) {
      return { success: false, error: authError || "User not authenticated" };
    }

    const { error } = await supabase.from("thesis_interactions").insert({
      thesis_id: thesisId,
      user_id: user.id,
      question: question.trim(),
    });

    if (error) {
      console.error("Error logging thesis interaction:", error);
      return { success: false, error: error.message };
    }

    // Revalidate the cached interaction stats for this thesis
    updateTag(`thesis-interactions-${thesisId}`);

    return { success: true };
  } catch (error) {
    console.error("Error in logThesisInteraction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
