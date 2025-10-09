import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/app/(auth)/login/_components/LoginForm";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}