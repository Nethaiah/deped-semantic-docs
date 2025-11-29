import { verifySession } from "@/lib/dal";

export interface Stats {
  totalOrders: number;
  totalMemorandums: number;
  recentUploads: number;
  ordersDailyChange: number;
  memorandumsDailyChange: number;
  currentMonth: string;
}

export async function getStats(): Promise<Stats> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      throw new Error("Unauthorized");
    }

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

    // Get uploads for current month based on date_issued
    const { count: recentUploads } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .gte("date_issued", firstDayOfMonth);

    // Get today's date (YYYY-MM-DD format)
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    // Get orders issued today
    const { count: todayOrders } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Order")
      .eq("date_issued", todayDate);

    // Get orders issued yesterday
    const { count: yesterdayOrders } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Order")
      .eq("date_issued", yesterdayDate);

    // Get memorandums issued today
    const { count: todayMemorandums } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Memorandum")
      .eq("date_issued", todayDate);

    // Get memorandums issued yesterday
    const { count: yesterdayMemorandums } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("doc_type", "Memorandum")
      .eq("date_issued", yesterdayDate);

    // Calculate daily changes (today - yesterday)
    const ordersDailyChange = (todayOrders || 0) - (yesterdayOrders || 0);
    const memorandumsDailyChange = (todayMemorandums || 0) - (yesterdayMemorandums || 0);

    return {
      totalOrders: totalOrders || 0,
      totalMemorandums: totalMemorandums || 0,
      recentUploads: recentUploads || 0,
      ordersDailyChange,
      memorandumsDailyChange,
      currentMonth: `${currentMonthName} ${currentYear}`,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Return default values on error
    return {
      totalOrders: 0,
      totalMemorandums: 0,
      recentUploads: 0,
      ordersDailyChange: 0,
      memorandumsDailyChange: 0,
      currentMonth: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }
}