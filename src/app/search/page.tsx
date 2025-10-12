import Search from "@/app/search/_components/search";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  return <Search />;
}
