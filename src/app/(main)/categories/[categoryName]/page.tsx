import { createClient } from "@/lib/supabase/server";
import Category from "@/components/categories/category";
import { redirect } from "next/navigation";
import { 
  getThesesByCollegePaginated, 
  type CollegeFilters 
} from "@/server/categories/actions";
import { 
  getDepartmentsForCollege,
  COLLEGE_FULL_NAMES 
} from "@/server/categories/constants";
import { checkBookmark } from "@/server/bookmarks/check-bookmark";

type Props = {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { categoryName } = await params;
  const collegeCode = decodeURIComponent(categoryName);
  const collegeName = COLLEGE_FULL_NAMES[collegeCode] || collegeCode;
  const departments = getDepartmentsForCollege(collegeCode);
  
  const sp = await searchParams;
  
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 10;

  // Extract filters
  const qParam = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const yearFrom = Array.isArray(sp.yearFrom) ? sp.yearFrom[0] : sp.yearFrom;
  const yearTo = Array.isArray(sp.yearTo) ? sp.yearTo[0] : sp.yearTo;
  const department = Array.isArray(sp.department) ? sp.department[0] : sp.department;
  
  // Extract Sort
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const validSorts = ["year_desc", "year_asc", "title_asc", "title_desc"];
  const sort = (validSorts.includes(sortParam || "") ? sortParam : "year_desc") as "year_desc" | "year_asc" | "title_asc" | "title_desc";

  const filters: CollegeFilters = {
    query: qParam || undefined,
    yearFrom: yearFrom || undefined,
    yearTo: yearTo || undefined,
    department: department || undefined,
  };

  // Fetch theses for this college
  const { data: theses, total } = await getThesesByCollegePaginated(
    collegeCode, 
    page, 
    pageSize, 
    filters,
    sort
  );

  // Fetch bookmark statuses for all theses
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
    <Category
      collegeCode={collegeCode}
      collegeName={collegeName}
      initialTheses={theses || []}
      initialBookmarks={bookmarkStatuses}
      departments={departments}
      total={total || 0}
      page={page}
      pageSize={pageSize}
      initialQuery={qParam || ""}
      initialFilters={{
        yearFrom: yearFrom || "",
        yearTo: yearTo || "",
        department: department || "",
      }}
      initialSort={sort}
    />
  );
}
