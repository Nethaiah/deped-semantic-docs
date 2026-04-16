import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

export type UserRecord = {
  id: string;
  student_id: string | null;
  full_name: string | null;
  email: string | null;
  role: string;
  status: string;
  created_at: string;
};

export type UserStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

/**
 * Fetch paginated users, with optional searching and status filtering.
 */
export async function getUsersPaginated(
  page: number,
  pageSize: number,
  query?: string,
  status?: string,
  sort?: string
): Promise<{ data: UserRecord[]; total: number }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("users");

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  let qb = supabase
    .from("users")
    .select("id, student_id, full_name, email, role, status, created_at", { count: "exact" });

  if (status && status !== "all") {
    qb = qb.eq("status", status);
  }

  if (query) {
    const searchStr = `%${query}%`;
    qb = qb.or(`full_name.ilike.${searchStr},email.ilike.${searchStr},student_id.ilike.${searchStr}`);
  }

  // Parse sorting parameter (e.g., "full_name_asc" -> col: "full_name", asc: true)
  const defaultSort = "created_at_desc";
  const validSort = sort || defaultSort;
  const isAscending = validSort.endsWith("_asc");
  const columnToSort = validSort.replace(/_(asc|desc)$/, "");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await qb
    .order(columnToSort, { ascending: isAscending })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch paginated users:", error);
    return { data: [], total: 0 };
  }

  return {
    data: (data ?? []) as UserRecord[],
    total: count ?? 0,
  };
}

/**
 * Fetch aggregation numbers for all users.
 */
export async function getUserStats(): Promise<UserStats> {
  "use cache";
  cacheLife("minutes");
  cacheTag("users");

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  // We can just fetch the status column for all users and calculate in JS 
  // since Supabase doesn't natively support grouped count easily without RPC.
  // This is very lightweight to pull just one column.
  const { data, error } = await supabase.from("users").select("status");

  if (error || !data) {
    console.error("Failed to fetch user stats:", error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }

  return data.reduce(
    (acc, curr) => {
      acc.total++;
      if (curr.status === "pending") acc.pending++;
      else if (curr.status === "approved") acc.approved++;
      else if (curr.status === "rejected") acc.rejected++;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 }
  );
}
