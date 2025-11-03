import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "@/app/(auth)/register/_components/register-form";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}

