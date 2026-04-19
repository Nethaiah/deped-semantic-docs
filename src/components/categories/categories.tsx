import { Suspense } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollegeCount } from "@/server/categories/actions";

type StaticCollege = {
  name: string;
  fullName: string;
};

// Map college codes to Lucide icons
function getCollegeIcon(collegeCode: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    CAS: BookOpen,
    CCS: Building2,
    CBAA: Briefcase,
    COED: GraduationCap,
    COE: Wrench,
  };

  return iconMap[collegeCode] || GraduationCap;
}

// Get color scheme for each college
function getCollegeColor(collegeCode: string): string {
  const colorMap: Record<string, string> = {
    CAS: "bg-slate-100 text-slate-600",
    CCS: "bg-[#fbeaea] text-[#800000]", // Maroon
    CBAA: "bg-yellow-100 text-yellow-600",
    COED: "bg-blue-100 text-blue-600",
    COE: "bg-red-100 text-red-600",
    COENG: "bg-red-100 text-red-600",
  };

  return colorMap[collegeCode] || "bg-gray-100 text-gray-600";
}

export default function Categories({
  colleges,
}: {
  colleges: StaticCollege[];
}) {
  if (colleges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No colleges found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {colleges.map((college) => {
        const Icon = getCollegeIcon(college.name);
        const colorClass = getCollegeColor(college.name);

        return (
          <Link
            key={college.name}
            href={`/categories/${encodeURIComponent(college.name)}`}
            className="block group"
          >
            <Card className="flex-row items-center gap-4 px-4 sm:px-6 py-4 rounded-2xl border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
              <CardContent className="flex items-center gap-4 p-0 min-w-0 flex-1">
                <div
                  className={`flex-shrink-0 p-3 sm:p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-md font-bold text-[#333]">
                    {college.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1 truncate">
                    {college.fullName}
                  </p>
                  <div className="text-sm text-gray-600">
                    <Suspense
                      fallback={
                        <Skeleton className="h-4 w-24 inline-block align-middle" />
                      }
                    >
                      <CollegeCountRenderer collegeCode={college.name} />
                    </Suspense>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

async function CollegeCountRenderer({ collegeCode }: { collegeCode: string }) {
  const count = await getCollegeCount(collegeCode);

  return (
    <>
      {count} Research{count !== 1 ? " Papers" : " Paper"}
    </>
  );
}
