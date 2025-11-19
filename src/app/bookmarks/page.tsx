import Bookmarks from "@/features/bookmarks/components/bookmark";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBookmarkedDocuments } from "@/features/bookmarks/server/get-bookmark";

export default async function DocumentsPage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get role on the server to avoid client flash
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = userData?.role || "user";

  const { data: docs } = await getBookmarkedDocuments();

  return (
    <Bookmarks role={role} docs={docs} />
  );
}
