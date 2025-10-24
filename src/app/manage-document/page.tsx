import ManageDocument from "@/app/manage-document/_components/manage-document";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <ManageDocument />
  );
}
