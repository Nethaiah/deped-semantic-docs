"use server";

import { verifySession } from "@/lib/dal";

export type CollegeInteractionData = {
  college: string;
  interactions: number;
};

export async function getCollegeInteractions(limit: number = 5): Promise<CollegeInteractionData[]> {
  try {
    const { isAuth, user, supabase } = await verifySession();

    if (!isAuth || !user) {
      return [];
    }

    // Fetch all interactions joined with their associated thesis's college
    const { data, error } = await supabase
      .from("thesis_interactions")
      .select(`
        id,
        theses:thesis_id(college)
      `);

    if (error) {
      console.error("Error fetching college interactions:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Aggregate interactions by college
    const counts: Record<string, number> = {};
    
    data.forEach((item: any) => {
      // Depending on how postgREST returns the many-to-one join,
      // item.theses might be an array or an object
      const collegeArray = Array.isArray(item.theses) ? item.theses : [item.theses];
      const college = collegeArray[0]?.college;
      
      if (college) {
        // use shortened names if they are very long, or keep as is.
        counts[college] = (counts[college] || 0) + 1;
      }
    });

    // Convert to array and sort descending by interactions
    const result: CollegeInteractionData[] = Object.entries(counts)
      .map(([college, interactions]) => ({ college, interactions }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, limit);

    return result;
  } catch (error) {
    console.error("Error in getCollegeInteractions:", error);
    return [];
  }
}
