"use server"

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/zodSchema";

export async function login({ email, password }: { email: string; password: string }) {
	const parsed = loginSchema.safeParse({ email, password });
	if (!parsed.success) {
		return { error: "Invalid email or password" };
	}

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

	if (error) {
		if (error.message?.toLowerCase().includes("invalid")) {
			return { error: "Invalid email or password" };
		}
		if (error.message?.toLowerCase().includes("email not confirmed")) {
			return { error: "Please verify your email before signing in" };
		}
		return { error: error.message || "Login failed" };
	}

	if (!data.user) {
		return { error: "Login failed" };
	}

	if (!data.user.email_confirmed_at) {
		return { error: "Please verify your email before signing in" };
	}

	return { success: true };
}