import { createClient } from "@/lib/supabase/server";
import Category from "./_components/category";
import { redirect } from "next/navigation";

export default async function CategoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  
  return <Category />;
}