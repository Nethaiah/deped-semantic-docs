"use server";

import { verifySession } from "@/lib/dal";
import { profileSchema, passwordSchema, type ProfileSchema, type PasswordSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

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
