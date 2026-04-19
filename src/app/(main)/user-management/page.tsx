import { Suspense } from "react";
import { columns } from "@/components/user-management/columns";
import { UserDataTable } from "@/components/user-management/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsersPaginated, getUserStats } from "@/server/user-management/get-users";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// ── Async data section (fetches real data from Supabase) ─────────────────────

async function UserManagementData({ searchParams }: Props) {
  // Parse search params
  const sp = await searchParams;

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const pageSize = 10;

  const query = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const statusParam = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;

  const validStatuses = ["all", "pending", "approved", "rejected"];
  const status = validStatuses.includes(statusParam || "")
    ? statusParam
    : "all";

  const validSorts = [
    "created_at_desc",
    "created_at_asc",
    "full_name_asc",
    "full_name_desc",
    "email_asc",
    "email_desc",
    "student_id_asc",
    "student_id_desc",
    "status_asc",
    "status_desc",
  ];
  const sort = validSorts.includes(sortParam || "") ? sortParam : "created_at_desc";

  // Fetch data in parallel
  const [{ data: users, total }, stats] = await Promise.all([
    getUsersPaginated(page, pageSize, query, status, sort),
    getUserStats(),
  ]);

  return (
    <>
      {/* Quick stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total Users",
            value: stats.total,
            colorText: "text-gray-800",
            colorBg: "bg-white",
            border: "border-gray-200",
          },
          {
            label: "Pending",
            value: stats.pending,
            colorText: "text-yellow-700",
            colorBg: "bg-yellow-50",
            border: "border-yellow-200",
          },
          {
            label: "Approved",
            value: stats.approved,
            colorText: "text-green-700",
            colorBg: "bg-green-50",
            border: "border-green-200",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            colorText: "text-red-700",
            colorBg: "bg-red-50",
            border: "border-red-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border ${stat.border} ${stat.colorBg} px-4 py-3`}
          >
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${stat.colorText}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <UserDataTable 
        columns={columns} 
        data={users} 
        total={total}
        page={page}
        pageSize={pageSize}
        currentQuery={query || ""}
        currentStatus={status || "all"}
        currentSort={sort || "created_at_desc"}
        stats={stats}
      />
    </>
  );
}

// ── Skeleton for data section ───────────────────────────────────────────────

function DataSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <Skeleton className="h-3 w-16 mb-2 rounded" />
            <Skeleton className="h-8 w-10 rounded" />
          </div>
        ))}
      </div>
      <Skeleton className="w-full h-96 rounded-xl" />
    </>
  );
}

/**
 * User Management page — admin guard handled by proxy middleware.
 *
 * Static header renders instantly (synchronous default export).
 * Stats + table stream in via Suspense with cached data.
 */
export default function UserManagementPage({ searchParams }: Props) {
  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-full">
      {/* Page Header — static, renders instantly */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          User Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and approve student access to DocuLens.
        </p>
      </div>

      {/* Dynamic content — streams in */}
      <Suspense fallback={<DataSkeleton />}>
        <UserManagementData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
