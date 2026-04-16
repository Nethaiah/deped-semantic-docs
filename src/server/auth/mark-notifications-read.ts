"use server"

import { createClient } from "@/lib/supabase/server";

export async function markNotificationsAsRead(): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Update notifications_last_read_at to current timestamp
    const { error } = await supabase
      .from("users")
      .update({ notifications_last_read_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to mark notifications read:", error);
      return { success: false, error: "Failed to mark as read" };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error in markNotificationsAsRead:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
}
