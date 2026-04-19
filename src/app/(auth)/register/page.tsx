import AuthShell from "@/components/auth/auth-shell";
import RegisterForm from "@/components/auth/register-form";

// Auth redirect for already-authenticated users is handled by the proxy (middleware).
// This page just renders the form directly — no Suspense needed, no auth check.

export default function RegisterPage() {
  return (
    <AuthShell variant="register">
      <RegisterForm />
    </AuthShell>
  );
}
