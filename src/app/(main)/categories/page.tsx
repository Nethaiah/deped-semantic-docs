import Categories from "@/components/categories/categories";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllColleges } from "@/server/categories/actions";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const colleges = await getAllColleges();

  return <Categories initialColleges={colleges} />;
}