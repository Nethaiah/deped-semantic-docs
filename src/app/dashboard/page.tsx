import AdminDocuments from "@/features/dashboard/admin/components/admin-page";
import UserDocuments from "@/features/dashboard/user/components/user-page";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get role on the server to avoid client flash
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userData?.role || 'user';

  return (
    <>
      {role === 'admin' ? <AdminDocuments name={user.user_metadata.full_name} /> : <UserDocuments name={user.user_metadata.full_name} />}
    </>
  );
}
