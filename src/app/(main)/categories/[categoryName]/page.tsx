import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryControls from "@/components/categories/category-controls";
import CategoryResults from "@/components/categories/category-results";
import { CategoryResultsSkeleton } from "@/components/categories/skeleton";
import {
  getThesesByCollegePaginated,
  type CollegeFilters,
} from "@/server/categories/actions";
import {
  getDepartmentsForCollege,
  COLLEGE_FULL_NAMES,
} from "@/server/categories/constants";
import { checkBookmark } from "@/server/bookmarks/check-bookmark";

type Props = {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/* ── Async data-fetching section (only the results need server data) ── */
async function ResultsSection({
  collegeCode,
  searchParams,
}: {
  collegeCode: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const pageSize = 10;

  const qParam = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const yearFrom = Array.isArray(sp.yearFrom) ? sp.yearFrom[0] : sp.yearFrom;
  const yearTo = Array.isArray(sp.yearTo) ? sp.yearTo[0] : sp.yearTo;
  const department = Array.isArray(sp.department)
    ? sp.department[0]
    : sp.department;

  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const validSorts = ["year_desc", "year_asc", "title_asc", "title_desc"];
  const sort = (
    validSorts.includes(sortParam || "") ? sortParam : "year_desc"
  ) as "year_desc" | "year_asc" | "title_asc" | "title_desc";

  const filters: CollegeFilters = {
    query: qParam || undefined,
    yearFrom: yearFrom || undefined,
    yearTo: yearTo || undefined,
    department: department || undefined,
  };

  const { data: theses, total } = await getThesesByCollegePaginated(
    collegeCode,
    page,
    pageSize,
    filters,
    sort
  );

  const bookmarkStatuses: Record<string, boolean> = {};
  if (theses && theses.length > 0) {
    await Promise.all(
      theses.map(async (thesis) => {
        const { bookmarked } = await checkBookmark(thesis.thesis_id);
        bookmarkStatuses[thesis.thesis_id] = bookmarked;
      })
    );
  }

  return (
    <CategoryResults
      theses={theses || []}
      bookmarks={bookmarkStatuses}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      collegeCode={collegeCode}
      currentFilters={{
        yearFrom: yearFrom || "",
        yearTo: yearTo || "",
        department: department || "",
      }}
      currentQuery={qParam || ""}
      currentSort={sort}
    />
  );
}

// Generate static params so the route segment and header are prebuilt into the static shell
export async function generateStaticParams() {
  return Object.keys(COLLEGE_FULL_NAMES).map((collegeCode) => ({
    categoryName: collegeCode,
  }));
}

/* ── Page — fully static shell, everything dynamic is in Suspense ── */
export default async function CategoryPage({ params, searchParams }: Props) {
  // Awaiting params here is SAFE because generateStaticParams prebuilds it!
  const { categoryName } = await params;
  const collegeCode = decodeURIComponent(categoryName);
  const collegeName = COLLEGE_FULL_NAMES[collegeCode] || collegeCode;
  const departments = getDepartmentsForCollege(collegeCode);

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header — rendered directly into static shell (no skeleton needed) */}
      <div className="mb-6">
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild className="cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 border-gray-300">
            <Link href="/categories">
              <ChevronLeft className="h-4 w-4" />
              Back to Colleges
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {collegeCode}
        </h1>
        <p className="text-sm text-gray-600">{collegeName}</p>
      </div>

      {/* Controls — streams in to isolate useSearchParams on client */}
      <Suspense fallback={<div className="h-10 mb-6 bg-gray-100 rounded-lg animate-pulse w-full"></div>}>
        <CategoryControls
          collegeCode={collegeCode}
          departments={departments}
        />
      </Suspense>

      {/* Results — streams in after DB fetch */}
      <Suspense fallback={<CategoryResultsSkeleton />}>
        <ResultsSection collegeCode={collegeCode} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
