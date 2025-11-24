"use server"

import { verifySession } from "@/lib/dal";
import { resetPasswordSchema } from "@/lib/zodSchema";

export async function updatePassword(newPassword: string, confirmPassword: string) {
	const parsed = resetPasswordSchema.safeParse({ 
		newPassword, 
		confirmPassword 
	});
	
	if (!parsed.success) {
		const firstError = parsed.error.issues[0];
		return { error: firstError?.message || "Invalid password" };
	}

	// Check if user has a valid session (from the recovery token)
	const { isAuth, user, supabase, error: sessionError } = await verifySession();
	
	if (!isAuth || !user) {
		return { error: "Session expired. Please request a new password reset link." };
	}

	// Update the password
	const { error } = await supabase.auth.updateUser({ 
		password: parsed.data.newPassword 
	});

	if (error) {
		return { error: error.message || "Failed to update password. Please try again." };
	}

	return { success: true };
}

