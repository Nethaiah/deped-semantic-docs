"use server"

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/zodSchema";

export async function login({ studentId, password }: { studentId: string; password: string }) {
	const parsed = loginSchema.safeParse({ studentId, password });
	if (!parsed.success) {
		return { error: "Invalid student ID or password" };
	}

	const supabase = await createClient();

	// Look up the user's email by student_id
	const { data: userRecord, error: lookupError } = await supabase
		.from("users")
		.select("email, status")
		.eq("student_id", parsed.data.studentId)
		.single();

	if (lookupError || !userRecord?.email) {
		return { error: "Invalid student ID or password" };
	}

	// Check approval status BEFORE attempting auth (fail fast)
	if (userRecord.status === "pending") {
		return { error: "Your account is pending admin approval. Please wait for confirmation." };
	}

	if (userRecord.status === "rejected") {
		return { error: "Your account has been rejected. Please contact an administrator." };
	}

	// Proceed with Supabase auth
	const { data, error } = await supabase.auth.signInWithPassword({
		email: userRecord.email,
		password: parsed.data.password,
	});

	if (error) {
		if (error.message?.toLowerCase().includes("invalid")) {
			return { error: "Invalid student ID or password" };
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
		// Sign out to prevent session leaking for unverified users
		await supabase.auth.signOut();
		return { error: "Please verify your email before signing in" };
	}

	return { success: true };
}