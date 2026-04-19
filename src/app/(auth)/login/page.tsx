import { Suspense } from "react";
import AuthShell from "@/components/auth/auth-shell";
import LoginForm from "@/components/auth/login-form";

// Auth redirect for already-authenticated users is handled by the proxy (middleware).
// Suspense is required because LoginForm uses useSearchParams() internally,
// which Next.js 16 requires to be inside a Suspense boundary with cacheComponents.
// Using null fallback so there's zero visible loading flash.

export default function Login() {
  return (
    <AuthShell variant="login">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
