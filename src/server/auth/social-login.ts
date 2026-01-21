"use server"

import { createClient } from "@/lib/supabase/server";

export type SocialProvider = 'google' | 'github' | 'facebook';

export async function signInWithSocial(provider: SocialProvider) {
	try {
		const supabase = await createClient();
		
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
			},
		});

		if (error) {
			console.error(`${provider} OAuth error:`, error);
			return { error: "OAuth authentication failed" };
		}

		if (data.url) {
			return { success: true, url: data.url };
		}

		return { error: "No OAuth URL generated" };
	} catch (err) {
		console.error(`${provider} OAuth error:`, err);
		return { error: "Internal server error" };
	}
}

// Helper function to sync social login user to database
export async function syncSocialUser(user: {
	id: string;
	email?: string | null;
	user_metadata?: {
		full_name?: string;
		name?: string;
	};
}) {
	try {
		const uid = user.id;
		const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "User";
		const supabase = await createClient();

		// Check if user exists in database
		const { data: record } = await supabase
			.from("users")
			.select("email, role")
			.eq("id", uid)
			.single();
		
		if (!record) {
			// Create new user in database
			await supabase
				.from("users")
				.insert({
					id: uid,
					email: user.email ?? "",
					full_name: fullName,
					role: "user",
				});
			console.log("✅ New social user inserted:", user.email);
		} else {
			console.log("✅ Existing social user found:", record.email, "- Role:", record.role);
		}
	} catch (error) {
		console.error("Error syncing social user:", error);
	}
}
