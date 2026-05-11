import Categories from "@/components/categories/categories";
import CategoriesAdminToolbar from "@/components/categories/categories-admin-toolbar";
import { getTaxonomy } from "@/server/categories/taxonomy";
import { createClient } from "@/lib/supabase/server";

/* ── Page ── */
export default async function CategoriesPage() {
  const taxonomy = await getTaxonomy();
  const staticColleges = taxonomy.map((c) => ({
    name: c.code,
    fullName: c.full_name,
  }));

  // Determine if the current viewer is an admin so we can render the
  // "Manage colleges" toolbar.  Non-admins see the page exactly as before.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = data?.role === "admin";
  }

  return (
    <div className="p-5 lg:p-8 bg-gray-50 flex-1 w-full flex flex-col">
      {/* Header Section — renders instantly */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Browse by Colleges
          </h1>
          <p className="text-sm text-gray-600">
            Explore research papers organized by college and department.
          </p>
        </div>

        {isAdmin && (
          <CategoriesAdminToolbar taxonomy={taxonomy} />
        )}
      </div>

      {/* Colleges Grid — static labels render immediately, counts stream in */}
      <Categories colleges={staticColleges} />
    </div>
  );
}
