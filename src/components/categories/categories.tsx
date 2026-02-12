"use client";

import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Wrench,
} from "lucide-react";
import type { CollegeWithCount } from "@/server/categories/actions";

// Map college codes to Lucide icons
function getCollegeIcon(collegeCode: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    CAS: BookOpen,
    CCS: Building2,
    CBAA: Briefcase,
    COED: GraduationCap,
    COEng: Wrench,
  };

  return iconMap[collegeCode] || GraduationCap;
}

// Get color scheme for each college
function getCollegeColor(collegeCode: string): string {
  const colorMap: Record<string, string> = {
    CAS: "bg-purple-100 text-purple-600",
    CCS: "bg-blue-100 text-blue-600",
    CBAA: "bg-emerald-100 text-emerald-600",
    COED: "bg-orange-100 text-orange-600",
    COEng: "bg-red-100 text-red-600",
  };

  return colorMap[collegeCode] || "bg-gray-100 text-gray-600";
}

export default function Categories({
  initialColleges,
}: {
  initialColleges: CollegeWithCount[];
}) {
  const colleges = initialColleges;

  if (colleges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No colleges found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {colleges.map((college) => {
        const Icon = getCollegeIcon(college.name);
        const colorClass = getCollegeColor(college.name);

        return (
          <Link
            key={college.name}
            href={`/categories/${encodeURIComponent(college.name)}`}
            className="flex items-center gap-4 px-6 py-4 shadow-sm bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div
              className={`flex-shrink-0 p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-md font-bold text-[#333]">
                {college.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">
                {college.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {college.count} Thesis{college.count !== 1 ? " Papers" : " Paper"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
