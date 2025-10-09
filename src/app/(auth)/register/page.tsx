import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "@/app/(auth)/register/_components/RegisterForm";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}

