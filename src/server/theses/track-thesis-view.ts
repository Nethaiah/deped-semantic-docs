"use server";

import { verifySession } from "@/lib/dal";

/**
 * Track a thesis view for the current user
 * Inserts a new record or updates the viewed_at timestamp if already exists
 */
export async function trackThesisView(thesisId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAuth, user, supabase, error: authError } = await verifySession();
    
    if (!isAuth || !user) {
      return { success: false, error: authError || "User not authenticated" };
    }

    // Check if this thesis was already viewed by the user
    const { data: existing } = await supabase
      .from('recently_view')
      .select('id')
      .eq('user_id', user.id)
      .eq('thesis_id', thesisId)
      .maybeSingle();

    const now = new Date().toISOString();

    if (existing) {
      // Update the existing record's viewed_at and updated_at
      const { error } = await supabase
        .from('recently_view')
        .update({
          viewed_at: now,
          updated_at: now
        })
        .eq('id', existing.id);

      if (error) {
        console.error("Error updating thesis view:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert a new view record
      const { error } = await supabase
        .from('recently_view')
        .insert({
          user_id: user.id,
          thesis_id: thesisId,
          viewed_at: now
        });

      if (error) {
        console.error("Error tracking thesis view:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in trackThesisView:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Clear all thesis views for the current user
 */
export async function clearThesisViewHistory(): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAuth, user, supabase, error: authError } = await verifySession();
    
    if (!isAuth || !user) {
      return { success: false, error: authError || "User not authenticated" };
    }

    const { error } = await supabase
      .from('recently_view')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error("Error clearing thesis view history:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in clearThesisViewHistory:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
