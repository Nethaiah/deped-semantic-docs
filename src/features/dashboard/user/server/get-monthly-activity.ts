"use server";

import { verifySession } from "@/lib/dal";

export type MonthlyActivityData = {
  month: string; // "Jan", "Feb", etc.
  fullMonth: string; // "January", "February", etc.
  year: number;
  uploads: number;
  date: string; // YYYY-MM for sorting
};

export async function getMonthlyActivity(): Promise<MonthlyActivityData[]> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      return [];
    }

    // Get date_issued for all documents
    // We'll fetch all and aggregate in memory for now as it's the most flexible
    // for filling gaps. For huge datasets, we'd want a database view or RPC.
    const { data, error } = await supabase
      .from("documents")
      .select("date_issued")
      .not("date_issued", "is", null)
      .order("date_issued", { ascending: true });

    if (error) {
      console.error("Error fetching monthly activity:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Aggregate by month
    const counts: Record<string, number> = {};
    
    data.forEach((doc) => {
      if (doc.date_issued) {
        // date_issued is YYYY-MM-DD
        const date = new Date(doc.date_issued);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    // Generate last 12 months to ensure we have a full year view even with gaps
    const result: MonthlyActivityData[] = [];
    const today = new Date();
    
    // Generate keys for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthShort = d.toLocaleDateString("en-US", { month: "short" });
      const monthLong = d.toLocaleDateString("en-US", { month: "long" });
      
      result.push({
        month: monthShort,
        fullMonth: monthLong,
        year: d.getFullYear(),
        uploads: counts[key] || 0,
        date: key
      });
    }

    return result;
  } catch (error) {
    console.error("Error in getMonthlyActivity:", error);
    return [];
  }
}
