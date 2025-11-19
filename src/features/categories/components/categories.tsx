"use client";

import Image from "next/image";
import Link from "next/link";
import type { CategoryWithCount } from "../server/actions";

// Map category names to icon paths
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    Policy: "/policy.svg",
    "Curriculum Implementation": "/curriclum.svg",
    "Personnel/Human Resources": "/human-resource.svg",
    "Finance/Budget": "/finance.svg",
    "School Governance and Operations": "/school-operation.svg",
    "Legal/School Titling": "/policy.svg", // Default icon
    Others: "/policy.svg", // Default icon
  };

  // Try exact match first
  if (iconMap[categoryName]) {
    return iconMap[categoryName];
  }

  // Try partial matches
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("curriculum")) return "/curriclum.svg";
  if (lowerName.includes("personnel") || lowerName.includes("human resource"))
    return "/human-resource.svg";
  if (lowerName.includes("finance") || lowerName.includes("budget"))
    return "/finance.svg";
  if (lowerName.includes("school") || lowerName.includes("operation"))
    return "/school-operation.svg";

  // Default icon
  return "/policy.svg";
}

// Helper function to create URL-safe category name
function encodeCategoryName(name: string): string {
  return encodeURIComponent(name);
}

export default function Categories({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const categories = initialCategories;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse by Categories
        </h1>
        <p className="text-sm text-gray-600">
          Streamlined document viewing based on specific categories.
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeCategoryName(category.name)}`}
              className="flex items-center gap-4 p-6 shadow-sm bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex-shrink-0">
                <Image
                  src={getCategoryIcon(category.name)}
                  alt={category.name}
                  width={65}
                  height={75}
                  className="w-16 h-auto"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} Document{category.count !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
