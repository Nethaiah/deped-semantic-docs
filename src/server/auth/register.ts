"use server"

import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/zodSchema";

export async function register({
	studentId,
	name,
	email,
	password,
}: {
	studentId: string;
	name: string;
	email: string;
	password: string;
}) {
	const parsed = registerSchema.safeParse({ studentId, fullName: name, email, password, terms: true });
	if (!parsed.success) {
		return { error: "Invalid registration payload" };
	}

	const normalizedEmail = parsed.data.email.trim().toLowerCase();
	const supabase = await createClient();

	// Check if student_id already exists
	const { data: existingStudentId } = await supabase
		.from("users")
		.select("id")
		.eq("student_id", parsed.data.studentId)
		.single();

	if (existingStudentId) {
		return { error: "User ID already registered" };
	}

	// Check if user exists in public.users table
	const { data: existingUser } = await supabase
		.from("users")
		.select("id")
		.eq("email", normalizedEmail)
		.single();

	if (existingUser) {
		return { error: "Email already exists" };
	}

	const { data, error } = await supabase.auth.signUp({
		email: normalizedEmail,
		password: parsed.data.password,
		options: {
			data: {
				name: parsed.data.fullName,
				full_name: parsed.data.fullName,
				student_id: parsed.data.studentId,
			},
			emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/confirm?type=signup`,
		},
	});

	if (error) {
		return { error: error.message || "Registration failed" };
	}

	const uid = data.user?.id;
	if (uid) {
		// Insert into public.users with pending status
		await supabase
			.from("users")
			.insert({
				id: uid,
				email: normalizedEmail,
				full_name: parsed.data.fullName,
				student_id: parsed.data.studentId,
				role: "user",
				status: "pending",
			});
	}

	return { success: true };
}