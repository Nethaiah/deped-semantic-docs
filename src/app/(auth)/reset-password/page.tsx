import ResetPasswordForm from "./_components/reset-password";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
	const supabase = await createClient();
	
	// Check if user has a valid session (only from password reset link)
	const { data: { user } } = await supabase.auth.getUser();
	
	// If no user or error, redirect - user must come from reset link
	if (!user) {
		redirect("/forgot-password");
	} else {
    redirect("/dashboard");
  }
	
	return <ResetPasswordForm />;
}

