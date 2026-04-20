"use server";

import { verifySession } from "@/lib/dal";
import {
  deleteAccountSchema,
  profileSchema,
  passwordSchema,
  type DeleteAccountSchema,
  type ProfileSchema,
  type PasswordSchema,
} from "@/lib/zodSchema";
import { revalidatePath, updateTag } from "next/cache";

export async function updateProfile(data: ProfileSchema) {
  const { isAuth, user, supabase, error } = await verifySession();

  if (!isAuth || !user) {
    return { error };
  }

  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { fullName } = result.data;

  // Update Supabase Auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Update public.users table
  const { error: dbError } = await supabase
    .from("users")
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function updatePassword(data: PasswordSchema) {
  const { isAuth, supabase, error } = await verifySession();

  if (!isAuth) {
    return { error };
  }

  const result = passwordSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { newPassword } = result.data;

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}

export async function deleteAccount(data: DeleteAccountSchema) {
  const { isAuth, user, supabase, error } = await verifySession();

  if (!isAuth || !user) {
    return { error };
  }

  const result = deleteAccountSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors.confirmation?.[0] || "Invalid confirmation" };
  }

  const { data: userRecord, error: fetchError } = await supabase
    .from("users")
    .select("role, status, is_deactivated")
    .eq("id", user.id)
    .single();

  if (fetchError || !userRecord) {
    return { error: "Unable to load account details" };
  }

  if (userRecord.role !== "user") {
    return { error: "Only standard user accounts can be deleted from settings" };
  }

  if (userRecord.status !== "approved") {
    return { error: "Only approved accounts can be deleted" };
  }

  if (userRecord.is_deactivated) {
    return { error: "This account is already deleted" };
  }

  const timestamp = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("users")
    .update({
      is_deactivated: true,
      deactivated_at: timestamp,
      reactivated_at: null,
      updated_at: timestamp,
    })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.auth.signOut();

  revalidatePath("/settings");
  updateTag("users");

  return { success: true };
}
