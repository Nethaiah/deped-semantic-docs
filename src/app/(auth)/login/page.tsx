import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/app/(auth)/login/_components/login-form"
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}