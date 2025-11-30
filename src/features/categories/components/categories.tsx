"use client";

import Link from "next/link";
import {
  FileText,
  BookOpen,
  Users,
  DollarSign,
  Building2,
  Scale,
  Briefcase,
  GraduationCap,
  Scroll,
  FolderOpen,
  ClipboardList,
  Award,
} from "lucide-react";
import type { CategoryWithCount } from "../server/actions";

// Map category names to Lucide icons with unique icons for each
function getCategoryIcon(categoryName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Policy: Scroll,
    "Curriculum Implementation": GraduationCap,
    "Personnel/Human Resources": Users,
    "Finance/Budget": DollarSign,
    "School Governance and Operations": Building2,
    "Legal/School Titling": Scale,
    Others: FolderOpen,
  };

  // Try exact match first
  if (iconMap[categoryName]) {
    return iconMap[categoryName];
  }

  // Try partial matches with unique icons
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("curriculum")) return GraduationCap;
  if (lowerName.includes("personnel") || lowerName.includes("human resource"))
    return Users;
  if (lowerName.includes("finance") || lowerName.includes("budget"))
    return DollarSign;
  if (lowerName.includes("school") || lowerName.includes("operation"))
    return Building2;
  if (lowerName.includes("legal")) return Scale;
  if (lowerName.includes("policy")) return Scroll;

  // Default icon
  return FileText;
}

// Get color scheme for each category
function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    Policy: "bg-indigo-100 text-indigo-600",
    "Curriculum Implementation": "bg-green-100 text-green-600",
    "Personnel/Human Resources": "bg-purple-100 text-purple-600",
    "Finance/Budget": "bg-emerald-100 text-emerald-600",
    "School Governance and Operations": "bg-orange-100 text-orange-600",
    "Legal/School Titling": "bg-red-100 text-red-600",
    Others: "bg-gray-100 text-gray-600",
  };

  // Try exact match first
  if (colorMap[categoryName]) {
    return colorMap[categoryName];
  }

  // Try partial matches
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("curriculum")) return "bg-green-100 text-green-600";
  if (lowerName.includes("personnel") || lowerName.includes("human resource"))
    return "bg-purple-100 text-purple-600";
  if (lowerName.includes("finance") || lowerName.includes("budget"))
    return "bg-emerald-100 text-emerald-600";
  if (lowerName.includes("school") || lowerName.includes("operation"))
    return "bg-orange-100 text-orange-600";
  if (lowerName.includes("legal")) return "bg-red-100 text-red-600";
  if (lowerName.includes("policy")) return "bg-indigo-100 text-indigo-600";

  // Default color
  return "bg-blue-100 text-blue-600";
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
    <div className="p-5 lg:p-8 bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const colorClass = getCategoryColor(category.name);

            return (
              <Link
                key={category.name}
                href={`/categories/${encodeCategoryName(category.name)}`}
                className="flex items-center gap-4 px-6 py-4 shadow-sm bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div
                  className={`flex-shrink-0 p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#333]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} Document{category.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
