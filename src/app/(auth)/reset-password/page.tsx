import ResetPasswordForm from "@/components/auth/reset-password";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  // Check if user has a valid session (from password reset link)
  const { isAuth } = await verifySession();
  
  // If no user, redirect to forgot-password page
  // User needs to click the reset link in their email first
  if (!isAuth) {
    redirect("/forgot-password");
  }
  
  // If user exists, they came from the reset link - show the form
  return <ResetPasswordForm />;
}