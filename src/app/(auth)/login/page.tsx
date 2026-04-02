import { verifySession } from "@/lib/dal";
import LoginForm from "@/components/auth/login-form";
import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: Promise<{ auth_error?: string }> }) {
  const params = await searchParams;
  
  if (params?.auth_error) {
    throw new Error(decodeURIComponent(params.auth_error));
  }

  const { isAuth } = await verifySession();
  if (isAuth) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}