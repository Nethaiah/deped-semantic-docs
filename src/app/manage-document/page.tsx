
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ManageDocument from "@/app/manage-document/_components/manage-document";
import { requireAdmin } from "@/lib/auth-utils";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  await requireAdmin();

  return (
    <ManageDocument />
  );
}
