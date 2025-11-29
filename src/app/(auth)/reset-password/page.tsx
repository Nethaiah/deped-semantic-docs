import ResetPasswordForm from "../../../features/auth/reset-password/components/reset-password";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  
  // Check if user has a valid session (from password reset link)
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user, redirect to forgot-password page
  // User needs to click the reset link in their email first
  if (!user) {
    redirect("/forgot-password");
  }
  
  // If user exists, they came from the reset link - show the form
  return <ResetPasswordForm />;
}