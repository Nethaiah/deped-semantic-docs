import { createClient } from "@/lib/supabase/server";

export interface Stats {
  totalOrders: number;
  totalMemorandums: number;
  recentUploads: number;
  orderPercentageChange: number;
  memorandumPercentageChange: number;
  currentMonth: string;
}

export async function getStats(): Promise<Stats> {
  const supabase = await createClient();

  try {
    // Get total orders
    const { count: totalOrders } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Order");

    // Get total memorandums
    const { count: totalMemorandums } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Memorandum");

    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed, so add 1
    const currentMonthName = now.toLocaleDateString("en-US", { month: "long" });
    
    // Calculate first day of current month (for date_issued comparison)
    const firstDayOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    
    // Calculate first day of last month
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const firstDayOfLastMonth = `${lastMonthYear}-${String(lastMonth).padStart(2, '0')}-01`;
    const lastDayOfLastMonth = new Date(currentYear, currentMonth - 1, 0).toISOString().split('T')[0];

    // Get uploads for current month based on date_issued
    const { count: recentUploads } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .gte("date_issued", firstDayOfMonth);

    // Get orders from last month for percentage calculation (based on date_issued)
    const { count: lastMonthOrders } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Order")
      .gte("date_issued", firstDayOfLastMonth)
      .lte("date_issued", lastDayOfLastMonth);

    // Get orders from current month (based on date_issued)
    const { count: currentMonthOrders } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Order")
      .gte("date_issued", firstDayOfMonth);

    // Calculate date for one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoDate = oneWeekAgo.toISOString().split('T')[0];
    
    // Calculate date for two weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const twoWeeksAgoDate = twoWeeksAgo.toISOString().split('T')[0];

    // Get memorandums from last week (8-14 days ago) for percentage calculation
    const { count: lastWeekMemorandums } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Memorandum")
      .gte("date_issued", twoWeeksAgoDate)
      .lt("date_issued", oneWeekAgoDate);

    // Get memorandums from current week (last 7 days)
    const { count: currentWeekMemorandums } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Memorandum")
      .gte("date_issued", oneWeekAgoDate);

    // Calculate percentage changes
    const orderPercentageChange = lastMonthOrders && lastMonthOrders > 0
      ? Math.round(((currentMonthOrders || 0) - lastMonthOrders) / lastMonthOrders * 100)
      : 0;

    const memorandumPercentageChange = lastWeekMemorandums && lastWeekMemorandums > 0
      ? Math.round(((currentWeekMemorandums || 0) - lastWeekMemorandums) / lastWeekMemorandums * 100)
      : 0;

    return {
      totalOrders: totalOrders || 0,
      totalMemorandums: totalMemorandums || 0,
      recentUploads: recentUploads || 0,
      orderPercentageChange,
      memorandumPercentageChange,
      currentMonth: `${currentMonthName} ${currentYear}`,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Return default values on error
    return {
      totalOrders: 0,
      totalMemorandums: 0,
      recentUploads: 0,
      orderPercentageChange: 0,
      memorandumPercentageChange: 0,
      currentMonth: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }
}