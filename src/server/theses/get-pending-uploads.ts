// Server action to get paginated pending uploads directly from Supabase
import { supabaseStatic } from "@/lib/supabase/static";

// Using the same type as in rag-api for consistency
export interface DbPendingThesisItem {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  college: string | null;
  department: string | null;
  status: string;
  status_message: string | null;
  original_filename: string;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
  // it might have thesis_id
  thesis_id?: string;
}

/**
 * Get paginated pending theses from Supabase without caching, 
 * so rapid auto-refreshing via router.refresh works.
 */
export async function getPendingUploadsPaginated(
  page: number,
  pageSize: number,
  statusFilter?: string
): Promise<{ data: DbPendingThesisItem[]; total: number; error: string | null }> {
  try {
    const supabase = supabaseStatic;
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let query = supabase.from("pending_theses").select("*", { count: "exact" });
    
    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    query = query.order("created_at", { ascending: false });
    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error("Error fetching pending uploads:", error);
      return { data: [], total: 0, error: error.message };
    }

    return {
      data: (data || []).map((row: any) => ({
        ...row,
        id: row.thesis_id || row.id 
      })) as DbPendingThesisItem[],
      total: count || 0,
      error: null,
    };
  } catch (error) {
    console.error("Error in getPendingUploadsPaginated:", error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
