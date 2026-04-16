"use server"

import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
import { sendStatusEmail } from "./send-status-email";

export type StatusAction = "approved" | "rejected";

export async function updateUserStatus({
	userIds,
	status,
}: {
	userIds: string[];
	status: StatusAction;
}) {
	if (!userIds.length) {
		return { error: "No users selected" };
	}

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

	// Fetch user details for email notifications before updating
	const { data: usersToUpdate, error: fetchError } = await supabase
		.from("users")
		.select("id, email, full_name, status")
		.in("id", userIds);

	if (fetchError || !usersToUpdate?.length) {
		return { error: "Users not found" };
	}

	// Filter out users already in the target status
	const usersToChange = usersToUpdate.filter((u) => u.status !== status);

	if (!usersToChange.length) {
		return { error: `All selected users are already ${status}` };
	}

	// Batch update status
	const idsToUpdate = usersToChange.map((u) => u.id);
	const { error: updateError } = await supabase
		.from("users")
		.update({ status })
		.in("id", idsToUpdate);

	if (updateError) {
		console.error("Failed to update user status:", updateError);
		return { error: "Failed to update user status" };
	}

	// Send email notifications (fire-and-forget, don't block the response)
	const emailPromises = usersToChange.map((u) => {
		if (u.email) {
			return sendStatusEmail({
				to: u.email,
				fullName: u.full_name || "User",
				status,
			});
		}
		return Promise.resolve({ success: true });
	});

	// Wait for all emails but don't fail the action if emails fail
	const emailResults = await Promise.allSettled(emailPromises);
	const failedEmails = emailResults.filter((r) => r.status === "rejected").length;

	// Invalidate the users cache
	updateTag("users");

	return {
		success: true,
		updated: usersToChange.length,
		failedEmails,
	};
}
