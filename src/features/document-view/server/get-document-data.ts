"use server";

import { createClient } from "@/lib/supabase/server";

export type DocumentData = {
  id: string;
  code: string;
  title: string;
  issuedDate: string;
  tags: string[];
  office: string;
  slug: string;
  summary?: string;
  docType?: string;
  sourcePath?: string;
};

export async function getDocumentById(documentId: string) {
  const supabase = await createClient();

  const { data: doc, error } = await supabase
    .from("documents")
    .select("*")
    .eq("doc_id", documentId)
    .single();

  if (error || !doc) {
    return { error: "Document not found", data: null };
  }

  const transformedDoc: DocumentData = {
    id: doc.doc_id,
    code: doc.doc_number || "N/A",
    title: doc.title,
    issuedDate: doc.date_issued 
      ? new Date(doc.date_issued).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        })
      : "N/A",
    tags: doc.categories || [],
    office: doc.issuer || "N/A",
    slug: doc.doc_id,
    summary: doc.summary || "",
    docType: doc.doc_type,
    sourcePath: doc.source_path,
  };

  return { data: transformedDoc, error: null };
}

export async function getSimilarDocuments(documentId: string, limit: number = 3) {
  try {
    // Call the RAG API backend for similar documents
    const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${API_BASE_URL}/document/${documentId}/similar?top_k=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Use cache to improve performance
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch similar documents from backend:', response.statusText);
      // Fallback to empty array instead of random documents
      return [];
    }

    const data = await response.json();
    
    // Transform the backend response to match the frontend format
    const transformedSimilar = (data.similar_documents || []).map((s: any) => ({
      id: s.doc_id,
      code: s.doc_number || "N/A",
      title: s.title,
      issuedDate: s.date_issued 
        ? new Date(s.date_issued).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric' 
          })
        : "N/A",
      tags: s.categories || [],
      office: s.issuer || "N/A",
      slug: s.doc_id,
      similarityScore: s.similarity_score, // Include similarity score for debugging
    }));

    return transformedSimilar;
  } catch (error) {
    console.error('Error fetching similar documents:', error);
    // Return empty array on error instead of random documents
    return [];
  }
}