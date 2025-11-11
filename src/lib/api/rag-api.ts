/**
 * RAG API Service
 * 
 * This service handles all communication with the FastAPI RAG backend.
 * It provides methods for semantic search and document Q&A functionality.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000/api/v1';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SearchRequest {
  query: string;          // The user's search query
  use_rag?: boolean;      // true = RAG search, false = keyword search (default: true)
  top_k?: number;         // Number of results to return (optional)
}

export interface DocumentSource {
  doc_id: string;
  doc_number: string;
  title: string;
  doc_type?: string;
  issuer?: string;
  date_issued?: string;
  categories?: string[];
  summary?: string;
  source_path?: string;
  num_relevant_chunks?: number;
}

export interface SearchResponse {
  answer: string;                 // AI-generated answer
  sources: DocumentSource[];      // Relevant documents (sorted by relevance)
  search_type: string;           // "rag_hybrid", "rag_vector", or "keyword"
}

export interface DocumentQARequest {
  doc_id: string;     // Document UUID
  question: string;   // User's question about the document
}

export interface DocumentQAResponse {
  answer: string;              // Markdown-formatted answer
  document?: DocumentSource;   // Document metadata
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
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

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
      const response = await fetch(`${API_BASE_URL}/document/qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

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
}

