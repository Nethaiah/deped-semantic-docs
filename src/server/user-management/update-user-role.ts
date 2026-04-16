"use server"

import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";

export async function updateUserRole({
	userId,
	role,
}: {
	userId: string;
	role: "admin" | "user";
}) {
	const supabase = await createClient();

	// Verify the caller is an admin
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		return { error: "Unauthorized" };
	}

	const { data: callerData } = await supabase
		.from("users")
		.select("role")
		.eq("id", user.id)
		.single();

	if (callerData?.role !== "admin") {
		return { error: "Forbidden: Admin access required" };
	}

	// Prevent updating self to a lower role intentionally or accidentally
	if (userId === user.id && role === "user") {
		return { error: "You cannot demote yourself" };
	}

	const { error: updateError } = await supabase
		.from("users")
		.update({ role })
		.eq("id", userId);

	if (updateError) {
		console.error("Failed to update user role:", updateError);
		return { error: "Failed to update user role" };
	}

	// Invalidate the users cache
	updateTag("users");

	return { success: true };
}
