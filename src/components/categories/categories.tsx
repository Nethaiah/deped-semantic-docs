import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollegeCount } from "@/server/categories/actions";
import casLogo from "../../../public/CASLOGO1.png";
import ccsLogo from "../../../public/CCSLOGO1.png";
import cbaaLogo from "../../../public/CBAALOGO1.png";
import coedLogo from "../../../public/COEDLOGO1.png";
import coeLogo from "../../../public/COELOGO1.png";
import luLogo from "../../../public/LULOGO1.png";

type StaticCollege = {
  name: string;
  fullName: string;
};

function getCollegeLogo(collegeCode: string) {
  const logoMap = {
    CAS: casLogo,
    CCS: ccsLogo,
    CBAA: cbaaLogo,
    COED: coedLogo,
    COE: coeLogo,
    COENG: coeLogo,
  };

  return logoMap[collegeCode as keyof typeof logoMap] || luLogo;
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
        const logoSrc = getCollegeLogo(college.name);

        return (
          <Link
            key={college.name}
            href={`/categories/${encodeURIComponent(college.name)}`}
            className="block group"
          >
            <Card className="flex-row items-center gap-4 px-4 sm:px-6 py-4 rounded-2xl border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
              <CardContent className="flex items-center gap-4 p-0 min-w-0 flex-1">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-transform group-hover:scale-110 sm:h-16 sm:w-16 sm:p-2.5">
                  <Image
                    src={logoSrc}
                    alt={`${college.fullName} logo`}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                    sizes="64px"
                    priority={false}
                  />
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
