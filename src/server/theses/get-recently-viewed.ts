"use server";

import { verifySession } from "@/lib/dal";

export type RecentlyViewedThesis = {
  thesisId: string;
  title: string;
  year: number;
  department: string;
  college: string;
  keywords: string[];
  authors: string[];
  viewedAt: string;
};

/**
 * Get recently viewed theses for the current user
 * @param limit - Maximum number of theses to return (default: 5)
 */
export async function getRecentlyViewed(limit: number = 5): Promise<RecentlyViewedThesis[]> {
  try {
    const { isAuth, user, supabase } = await verifySession();
    
    if (!isAuth || !user) {
      return [];
    }

    // Query recently_view with joined thesis data
    const { data, error } = await supabase
      .from('recently_view')
      .select(`
        viewed_at,
        thesis_id,
        theses!inner (
          thesis_id,
          title,
          year,
          department,
          college,
          keywords,
          thesis_authors (
            author_name,
            author_order
          )
        )
      `)
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recently viewed theses:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data
    return data
      .filter(item => item.theses) // Filter out any null theses
      .map(item => {
        const thesis = item.theses as any;
        
        // Get authors sorted by order
        const authors = (thesis.thesis_authors || [])
          .sort((a: any, b: any) => a.author_order - b.author_order)
          .map((a: any) => a.author_name);

        return {
          thesisId: thesis.thesis_id,
          title: thesis.title || "Untitled Thesis",
          year: thesis.year,
          department: thesis.department,
          college: thesis.college,
          keywords: thesis.keywords || [],
          authors,
          viewedAt: item.viewed_at,
        };
      });
  } catch (error) {
    console.error("Error in getRecentlyViewed:", error);
    return [];
  }
}