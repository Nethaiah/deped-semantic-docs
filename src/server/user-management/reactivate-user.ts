"use server";

import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
import { sendStatusEmail } from "./send-status-email";

export async function reactivateUser({ userId }: { userId: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: callerData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerData?.role !== "admin") {
    return { error: "Forbidden: Admin access required" };
  }

  const { data: targetUser, error: targetError } = await supabase
    .from("users")
    .select("id, email, full_name, status, is_deactivated")
    .eq("id", userId)
    .single();

  if (targetError || !targetUser) {
    return { error: "User not found" };
  }

  if (!targetUser.is_deactivated) {
    return { error: "This account is already active" };
  }

  const timestamp = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("users")
    .update({
      status: "approved",
      is_deactivated: false,
      reactivated_at: timestamp,
      updated_at: timestamp,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to reactivate user:", updateError);
    return { error: "Failed to reactivate user" };
  }

  let emailError = 0;
  if (targetUser.email) {
    const emailResult = await sendStatusEmail({
      to: targetUser.email,
      fullName: targetUser.full_name || "User",
      status: "reactivated",
    });

    if ("error" in emailResult) {
      emailError = 1;
    }
  }

  updateTag("users");

  return {
    success: true,
    failedEmails: emailError,
  };
}
