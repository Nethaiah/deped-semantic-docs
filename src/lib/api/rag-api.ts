/**
 * RAG API Service
 * 
 * This service handles all communication with the FastAPI RAG backend.
 * It provides methods for semantic search and document Q&A functionality.
 * 
 * Protected endpoints send the current Supabase session JWT as a
 * Bearer token so the backend can verify the caller is authenticated.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000/api/v1';

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Build request headers with the current user's Supabase JWT.
 *
 * Uses a dynamic import so that server components (which only reference
 * static helpers like getProxyPdfUrl) never load the browser Supabase client.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch {
    // Non-browser context or session unavailable — proceed without token.
  }

  return headers;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SearchRequest {
  query: string;          // The user's search query
  use_rag?: boolean;      // true = RAG search, false = keyword search (default: true)
  top_k?: number;         // Number of results to return (optional)
}

export interface DocumentSource {
  thesis_id: string;        // Primary identifier from the API
  doc_number: string;
  title: string;
  doc_type?: string;
  issuer?: string;
  date_issued?: string;
  categories?: string[];
  summary?: string;
  source_path?: string;
  num_relevant_chunks?: number;
  // Thesis-related fields
  authors?: string[];
  year?: number;
  department?: string;
  college?: string;
  keywords?: string[];
}

export interface SearchResponse {
  answer: string;                 // AI-generated answer
  sources: DocumentSource[];      // Relevant documents (sorted by relevance)
  search_type: string;           // "rag_hybrid", "rag_vector", or "keyword"
}

export interface DocumentQARequest {
  thesis_id: string;  // Thesis UUID (must match backend field name)
  question: string;   // User's question about the document
}

export interface DocumentQAResponse {
  answer: string;              // Markdown-formatted answer
  thesis?: DocumentSource;     // Thesis metadata
}

// ============================================================================
// RAG API SERVICE CLASS
// ============================================================================

export class RAGApiService {
  /**
   * Perform semantic search across all documents
   * 
   * @param request - Search parameters
   * @returns Search results with AI-generated answer and relevant documents
   * @throws Error if the search fails
   */
  static async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        throw new Error(
          `You're sending too many requests. Please wait ${retryAfter} seconds before trying again.`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Search failed: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during search');
    }
  }

  /**
   * Ask a question about a specific document
   * 
   * @param request - Document Q&A parameters
   * @returns Markdown-formatted answer with document metadata
   * @throws Error if the Q&A fails
   */
  static async documentQA(request: DocumentQARequest): Promise<DocumentQAResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/thesis/qa`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        throw new Error(
          `You're sending too many requests. Please wait ${retryAfter} seconds before trying again.`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Document Q&A failed: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during document Q&A');
    }
  }

  /**
   * Check if the RAG API is healthy and accessible
   * 
   * @returns true if the API is healthy, false otherwise
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get the current API base URL
   * 
   * @returns The API base URL
   */
  static getBaseUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Build the proxy URL for viewing/downloading a thesis PDF.
   * The backend fetches the PDF from cloud storage server-side,
   * avoiding CORS issues on restricted networks.
   */
  static getProxyPdfUrl(thesisId: string): string {
    return `${API_BASE_URL}/thesis/${thesisId}/pdf`;
  }

  /**
   * Build the proxy URL that triggers a file-save dialog instead of
   * displaying the PDF inline in the browser.
   */
  static getDownloadPdfUrl(thesisId: string): string {
    return `${API_BASE_URL}/thesis/${thesisId}/pdf?download=true`;
  }
}

export interface UploadResponse {
  id: string;
  status: string;
  message: string;
}

export interface PendingThesisItem {
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
}

export interface PendingThesesListResponse {
  items: PendingThesisItem[];
  count: number;
}

export interface ExtractedPage {
  page_number: number;
  text: string;
  has_table: boolean;
  has_figure: boolean;
  has_equation: boolean;
}

export interface ReviewData {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  college: string | null;
  department: string | null;
  advisor: string | null;
  status: string;
  original_filename: string;
  r2_url: string;
  pdf_proxy_url: string;
  extracted_text: string | null;
  extracted_metadata: Record<string, unknown> | null;
  extracted_pages: ExtractedPage[] | null;
  summary: string | null;
  keywords: string[];
  abstract: string | null;
  created_at: string;
}

export interface ApprovePayload {
  title?: string;
  authors?: string[];
  year?: number;
  college?: string;
  department?: string;
  advisor?: string;
  keywords?: string[];
  abstract?: string;
  summary?: string;
  review_notes?: string;
}

export interface RejectPayload {
  reason?: string;
}

// ============================================================================
// UPLOAD API SERVICE
// ============================================================================

export class UploadApiService {
  /**
   * Upload a thesis PDF (file only — metadata is extracted by AI).
   * Uses multipart/form-data.
   */
  static async uploadThesis(file: File): Promise<UploadResponse> {
    const headers = await getAuthHeaders();
    // Remove Content-Type so the browser sets multipart boundary
    delete headers['Content-Type'];

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * List all pending thesis uploads.
   */
  static async listUploads(status?: string): Promise<PendingThesesListResponse> {
    const headers = await getAuthHeaders();
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`${API_BASE_URL}/uploads${params}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to list uploads: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get full review data for side-by-side comparison.
   */
  static async getUploadReview(uploadId: string): Promise<ReviewData> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/review`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to get review: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Approve a processed thesis upload.
   */
  static async approveUpload(uploadId: string, payload: ApprovePayload): Promise<{ thesis_id: string; message: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/approve`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Approval failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Reject a thesis upload.
   */
  static async rejectUpload(uploadId: string, payload: RejectPayload): Promise<{ message: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/reject`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Rejection failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Retry processing a failed upload.
   */
  static async retryUpload(uploadId: string): Promise<{ message: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/retry`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Retry failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get the proxy URL for a pending upload's PDF.
   */
  static getPendingPdfUrl(uploadId: string): string {
    return `${API_BASE_URL}/uploads/${uploadId}/pdf`;
  }
}