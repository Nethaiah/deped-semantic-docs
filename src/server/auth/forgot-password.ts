"use server"

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/lib/zodSchema";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function resetPasswordForEmail(email: string) {
	const parsed = forgotPasswordSchema.safeParse({ email });
	if (!parsed.success) {
		return { error: "Invalid email address" };
	}

	const normalizedEmail = parsed.data.email.trim().toLowerCase();

	// Check if user exists and uses email provider (not OAuth)
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string;

	if (!supabaseUrl || !supabaseServiceKey) {
		return { error: "Server configuration error" };
	}

	// Use admin client to check user details
	const adminClient = createAdminClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	try {
		const { data: users, error: listError } = await adminClient.auth.admin.listUsers();
		
		if (listError) {
			return { error: "Unable to verify user. Please try again later." };
		}

		const user = users.users.find((u) => u.email?.toLowerCase() === normalizedEmail);

		if (!user) {
      return { error: "User not found" };
		}

		// Check if user uses email provider
		const isEmailProvider = user.app_metadata?.provider === "email" || 
			(!user.app_metadata?.providers || user.app_metadata.providers.includes("email"));

		if (!isEmailProvider) {
			return { error: "This email is associated with a social account. Please sign in with your provider." };
		}

		// Send reset password email
		const supabase = await createClient();
		const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/confirm?type=recovery&next=/reset-password`,
		});

		if (resetError) {
			return { error: resetError.message || "Failed to send reset email. Please try again." };
		}

		return { success: true };
	} catch (error) {
		console.error("Reset password error:", error);
		return { error: "An unexpected error occurred. Please try again." };
	}
}

