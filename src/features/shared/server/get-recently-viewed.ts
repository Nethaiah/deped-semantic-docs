"use server";

import { createClient } from "@/lib/supabase/server";

export type RecentlyViewedDocument = {
  id: string;
  code: string;
  title: string;
  tags: string[];
  viewedAt: string;
  dateIssued?: string | null;
  issuer?: string | null;
};

/**
 * Get recently viewed documents for the current user
 * @param limit - Maximum number of documents to return (default: 5)
 */
export async function getRecentlyViewed(limit: number = 5): Promise<RecentlyViewedDocument[]> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    // Query document_views with joined document data
    const { data, error } = await supabase
      .from('document_views')
      .select(`
        viewed_at,
        doc_id,
        documents!inner (
          doc_id,
          doc_number,
          title,
          categories,
          date_issued,
          issuer
        )
      `)
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recently viewed documents:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data
    return data
      .filter(item => item.documents) // Filter out any null documents
      .map(item => {
        const doc = item.documents as any;
        return {
          id: doc.doc_id,
          code: doc.doc_number || "N/A",
          title: doc.title || "Untitled Document",
          tags: doc.categories || [],
          viewedAt: item.viewed_at,
          dateIssued: doc.date_issued,
          issuer: doc.issuer,
        };
      });
  } catch (error) {
    console.error("Error in getRecentlyViewed:", error);
    return [];
  }
}