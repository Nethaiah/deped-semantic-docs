
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// import ManageDocument from "@/components/document/manage-document";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }



  return (
    <div>
      <h1>Manage Document</h1>
    </div>
  );
}
