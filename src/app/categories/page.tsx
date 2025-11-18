import Categories from "@/features/categories/components/categories";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllCategories } from "@/features/categories/server/actions";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const categories = await getAllCategories();

  return <Categories initialCategories={categories} />;
}