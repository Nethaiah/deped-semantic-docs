import Search from "@/features/search/components/search";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  const supabase = await createClient();

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

  return <Search role={role} />;
}
