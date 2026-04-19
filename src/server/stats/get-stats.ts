"use server";

import { verifySession } from "@/lib/dal";

export interface Stats {
  totalTheses: number;
  totalViews: number;
  recentUploads: number;
  thesesDailyChange: number;
  viewsDailyChange: number;
  currentMonth: string;
}

export async function getStats(): Promise<Stats> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      throw new Error("Unauthorized");
    }

    // Get total theses
    const { count: totalTheses } = await supabase
      .from("theses")
      .select("*", { count: "exact", head: true });

    // Get total views from recently_view table
    // Note: This table tracks individual views, so count is total views
    const { count: totalViews } = await supabase
      .from("recently_view")
      .select("*", { count: "exact", head: true });

    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed, so add 1
    const currentMonthName = now.toLocaleDateString("en-US", { month: "long" });
    
    // Calculate first day of current month (for created_at comparison)
    const firstDayOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;

    // Get uploads (new theses) for current month based on created_at
    const { count: recentUploads } = await supabase
      .from("theses")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayOfMonth);

    // Get today's date (YYYY-MM-DD format)
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    // Get theses created today
    const { count: todayTheses } = await supabase
      .from("theses")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayDate}T00:00:00`)
      .lte("created_at", `${todayDate}T23:59:59`);

    // Get theses created yesterday
    const { count: yesterdayTheses } = await supabase
      .from("theses")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${yesterdayDate}T00:00:00`)
      .lte("created_at", `${yesterdayDate}T23:59:59`);

    // Get views today
    const { count: todayViews } = await supabase
      .from("recently_view")
      .select("*", { count: "exact", head: true })
      // Assuming recently_view has a viewed_at or created_at timestamp
      .gte("viewed_at", `${todayDate}T00:00:00`)
      .lte("viewed_at", `${todayDate}T23:59:59`);

    // Get views yesterday
    const { count: yesterdayViews } = await supabase
      .from("recently_view")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", `${yesterdayDate}T00:00:00`)
      .lte("viewed_at", `${yesterdayDate}T23:59:59`);

    // Calculate daily changes (today - yesterday)
    const thesesDailyChange = (todayTheses || 0) - (yesterdayTheses || 0);
    const viewsDailyChange = (todayViews || 0) - (yesterdayViews || 0);

    return {
      totalTheses: totalTheses || 0,
      totalViews: totalViews || 0,
      recentUploads: recentUploads || 0,
      thesesDailyChange,
      viewsDailyChange,
      currentMonth: `${currentMonthName} ${currentYear}`,
    };
  } catch (error) {
    if (!isPrerenderAbortError(error)) {
      console.error("Error fetching user stats:", error);
    }

    // Return default values on error
    return {
      totalTheses: 0,
      totalViews: 0,
      recentUploads: 0,
      thesesDailyChange: 0,
      viewsDailyChange: 0,
      currentMonth: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }
}

function isPrerenderAbortError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "";

  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : "";

  return (
    message.includes(
      "During prerendering, `cookies()` rejects when the prerender is complete"
    ) ||
    message.includes(
      "During prerendering, fetch() rejects when the prerender is complete"
    ) ||
    digest === "HANGING_PROMISE_REJECTION"
  );
}
