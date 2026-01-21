import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VerifyEmailClient from "../../components/verify-email";

export default async function VerifyEmailPage() {
	const supabase = await createClient();
	
	// Check if user has a valid session from email verification link
	// Users should only access this page after clicking the email link
	const { data: { user } } = await supabase.auth.getUser();
	
	// If user has no session, they didn't come from the email link
	// Redirect them - they must come from the callback route with valid code
	if (!user) {
		redirect("/login");
	} else {
    redirect("/dashboard");
  }
	
	// Allow access - user has a valid session from email verification
	return <VerifyEmailClient />;
}
