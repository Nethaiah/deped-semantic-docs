"use server";

import { createClient } from "@/lib/supabase/server";
import { profileSchema, passwordSchema, type ProfileSchema, type PasswordSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: ProfileSchema) {
  const supabase = await createClient();
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { fullName } = result.data;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

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
  const supabase = await createClient();
  const result = passwordSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { newPassword } = result.data;

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
