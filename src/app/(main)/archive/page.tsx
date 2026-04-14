import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { archiveColumns } from "@/components/archive/columns";
import { ArchiveDataTable } from "@/components/archive/data-table";
import {
  getArchivedThesesPaginated,
  getArchivedThesesCount,
  type ArchiveFilters,
} from "@/server/archive/actions";
import type { ArchiveSortOption } from "@/server/archive/actions";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// ── Async Content (server component — needs DB data) ─────────────────────

async function ArchiveContent({ searchParams }: Props) {
  // Parse search params
  const sp = await searchParams;

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const pageSize = 10;

  const query = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const college = Array.isArray(sp.college) ? sp.college[0] : sp.college;
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;

  const validSorts: ArchiveSortOption[] = [
    "archived_desc",
    "archived_asc",
    "title_asc",
    "title_desc",
    "year_desc",
    "year_asc",
  ];
  const sort: ArchiveSortOption = validSorts.includes(
    sortParam as ArchiveSortOption
  )
    ? (sortParam as ArchiveSortOption)
    : "archived_desc";

  const filters: ArchiveFilters = {
    query: query || undefined,
    college: college || undefined,
  };

  // Fetch data in parallel (both leverage `use cache` inside)
  const [{ data: archivedTheses, total }, totalArchived] = await Promise.all([
    getArchivedThesesPaginated(page, pageSize, filters, sort),
    getArchivedThesesCount(),
  ]);

  // Extract unique colleges for filter dropdown
  const colleges = [
    ...new Set(
      archivedTheses
        .map((t) => t.college)
        .filter((c): c is string => c !== null && c !== undefined)
    ),
  ].sort();

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-gray-500">Total Archived</p>
          <p className="text-2xl font-bold mt-0.5 text-gray-800">
            {totalArchived}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">Current Page</p>
          <p className="text-2xl font-bold mt-0.5 text-amber-700">
            {archivedTheses.length}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">Total Pages</p>
          <p className="text-2xl font-bold mt-0.5 text-blue-700">
            {Math.max(1, Math.ceil(total / pageSize))}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <ArchiveDataTable
        columns={archiveColumns}
        data={archivedTheses}
        total={total}
        page={page}
        pageSize={pageSize}
        currentQuery={query || ""}
        currentSort={sort}
        currentCollege={college || ""}
        colleges={colleges}
      />
    </>
  );
}

// ── Skeleton Fallback ───────────────────────────────────────────────────────

function ArchiveDataSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="w-full h-96 rounded-xl" />
    </>
  );
}

// ── Page Export ──────────────────────────────────────────────────────────────

/**
 * Archive page — admin guard handled by `(admin)/layout.tsx`.
 *
 * Static header renders instantly (synchronous default export).
 * Stats + table stream in via Suspense.
 */
export default function ArchivePage({ searchParams }: Props) {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Page Header — static, renders instantly */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          Archive
        </h1>
        <p className="text-sm text-gray-600">
          Manage archived theses. Restore them to the active repository or
          delete permanently.
        </p>
      </div>

      {/* Dynamic content — streams in */}
      <Suspense fallback={<ArchiveDataSkeleton />}>
        <ArchiveContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
