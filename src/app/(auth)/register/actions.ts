"use server"

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { registerSchema } from "@/lib/zodSchema";

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
	const parsed = registerSchema.safeParse({ fullName: name, email, password, terms: true });
	if (!parsed.success) {
		return { error: "Invalid registration payload" };
	}

	const normalizedEmail = parsed.data.email.trim().toLowerCase();

	const exists = await db
		.select()
		.from(users)
		.where(eq(users.email, normalizedEmail))
		.limit(1);
	if (exists.length > 0) {
		return { error: "Email already exists" };
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	if (!supabaseUrl || !supabaseAnonKey) {
		return { error: "Server auth not configured" };
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);
	const { data, error } = await supabase.auth.signUp({
		email: normalizedEmail,
		password: parsed.data.password,
		options: {
			data: { name: parsed.data.fullName, full_name: parsed.data.fullName },
			emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email`,
		},
	});

	if (error) {
		return { error: error.message || "Registration failed" };
	}

	const uid = data.user?.id;
	if (uid) {
		await db
			.insert(users)
			.values({ id: uid, email: normalizedEmail, fullName: parsed.data.fullName, role: "user" })
			.onConflictDoNothing();
	}

	return { success: true };
}