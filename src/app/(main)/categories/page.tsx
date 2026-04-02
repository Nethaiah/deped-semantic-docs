import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

import Categories from "@/components/categories/categories";
import { getAllColleges } from "@/server/categories/actions";
import { CollegesGridSkeleton } from "@/components/categories/skeleton";

/* ── Async data-fetching section ── */
async function CollegesSection() {
  const colleges = await getAllColleges();
  return <Categories initialColleges={colleges} />;
}

/* ── Page ── */
export default async function CategoriesPage() {
  const session = await verifySession();
  if (!session.isAuth) {
    redirect('/login');
  }

  return (
    <div className="p-5 lg:p-8 bg-gray-50">
      {/* Header Section — renders instantly */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse by College
        </h1>
        <p className="text-sm text-gray-600">
          Explore thesis papers organized by college and department.
        </p>
      </div>

      {/* Colleges Grid — streams in */}
      <Suspense fallback={<CollegesGridSkeleton />}>
        <CollegesSection />
      </Suspense>
    </div>
  );
}