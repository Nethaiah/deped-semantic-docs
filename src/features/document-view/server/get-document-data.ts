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
  const supabase = await createClient();

  const { data: similarDocs } = await supabase
    .from("documents")
    .select("*")
    .neq("doc_id", documentId)
    .limit(limit);

  const transformedSimilar = (similarDocs || []).map((s) => ({
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
  }));

  return transformedSimilar;
}