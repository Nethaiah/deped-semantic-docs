"use server";

import { verifySession } from "@/lib/dal";

/**
 * Track a document view for the current user
 * Uses upsert to update timestamp if already viewed
 */
export async function trackDocumentView(docId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAuth, user, supabase, error: authError } = await verifySession();
    
    if (!isAuth || !user) {
      return { success: false, error: authError || "User not authenticated" };
    }

    // Upsert: Insert new view or update timestamp if exists
    const { error } = await supabase
      .from('document_views')
      .upsert({
        user_id: user.id,
        doc_id: docId,
        viewed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,doc_id',
        ignoreDuplicates: false // Always update the timestamp
      });

    if (error) {
      console.error("Error tracking document view:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in trackDocumentView:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Clear all document views for the current user
 */
export async function clearDocumentViewHistory(): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAuth, user, supabase, error: authError } = await verifySession();
    
    if (!isAuth || !user) {
      return { success: false, error: authError || "User not authenticated" };
    }

    const { error } = await supabase
      .from('document_views')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error("Error clearing document view history:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in clearDocumentViewHistory:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}