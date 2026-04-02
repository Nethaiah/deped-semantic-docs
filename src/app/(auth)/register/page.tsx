import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

export default async function RegisterPage() {
  const { isAuth } = await verifySession();
  if (isAuth) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}

