import AdminDocuments from "@/components/admin/admin-page";
import UserDocuments from "@/components/user/user-page";
import Sidebar from "@/components/sidebar";
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
    .eq('uid', user.id)
    .single();

  const role = userData?.role || 'user';

  return (
    <>
      {role === 'admin' ? <AdminDocuments /> : <UserDocuments />}
    </>
  );
}
