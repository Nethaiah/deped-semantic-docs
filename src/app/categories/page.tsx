import Categories from "@/features/categories/components/categories";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  return <Categories />;
}