import Categories from "@/components/categories/categories";
import { COLLEGE_FULL_NAMES } from "@/server/categories/constants";

/* ── Page ── */
export default function CategoriesPage() {
  const staticColleges = Object.entries(COLLEGE_FULL_NAMES).map(
    ([name, fullName]) => ({
      name,
      fullName,
    })
  );

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-full">
      {/* Header Section — renders instantly */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse by Colleges
        </h1>
        <p className="text-sm text-gray-600">
          Explore research papers organized by college and department.
        </p>
      </div>

      {/* Colleges Grid — static labels render immediately, counts stream in */}
      <Categories colleges={staticColleges} />
    </div>
  );
}
