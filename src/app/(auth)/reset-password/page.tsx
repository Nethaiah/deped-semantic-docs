import ResetPasswordForm from "@/components/auth/reset-password";

// The ResetPasswordForm client component handles its own auth validation.
// It checks if the user has a valid recovery session and redirects to
// /forgot-password if not. We don't block this route in the proxy because
// users arriving from the Supabase password reset email flow need access.

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}