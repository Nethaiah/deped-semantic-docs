"use client";

import { Search as SearchIcon, Loader2, X, Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { RAGApiService, type DocumentSource } from "@/lib/api/rag-api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";
import { checkBookmark } from "../../shared/server/check-bookmark";
import SearchFilterDialog, {
  type SearchFilterValues,
} from "@/features/search/components/search-filter-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = {
  role: string;
};

const SEARCH_STATE_KEY = "deped-search-state";

export default function Search({ role }: Role) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [searchResults, setSearchResults] = useState<DocumentSource[]>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Changed default to true (Semantic Search default)
  const [useRAG, setUseRAG] = useState(true);
  const [searchType, setSearchType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Changed default searchMode to "rag"
  const [searchFilters, setSearchFilters] = useState<SearchFilterValues>({
    fromDate: "",
    toDate: "",
    issuer: "",
    issuerLevel: "",
    code: "",
    title: "",
    tags: "",
    docType: "",
    searchMode: "rag",
  });

  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "title_asc" | "title_desc"
  >("date_desc");

  // Restore search state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(SEARCH_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setSearchQuery(parsed.searchQuery || "");
        setAnswer(parsed.answer || "");
        setSearchResults(parsed.searchResults || []);
        setBookmarks(parsed.bookmarks || {});
        setHasSearched(parsed.hasSearched || false);
        // Default to true if undefined in storage
        setUseRAG(parsed.useRAG !== undefined ? parsed.useRAG : true);
        setSearchType(parsed.searchType || "");
        if (parsed.searchFilters) {
          setSearchFilters(parsed.searchFilters);
        }
      }
    } catch (err) {
      console.error("Error restoring search state:", err);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setAnswer("");
    setSearchResults([]);
    setBookmarks({});
    setHasSearched(false);
    setSearchType("");
    sessionStorage.removeItem(SEARCH_STATE_KEY);
  };

  // Clear persisted search on full page refresh/close
  useEffect(() => {
    const handler = () => {
      sessionStorage.removeItem(SEARCH_STATE_KEY);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Re-sync bookmark states for restored results (e.g., when navigating back)
  useEffect(() => {
    if (!hasSearched || searchResults.length === 0) return;
    let cancelled = false;
    (async () => {
      const statuses: Record<string, boolean> = {};
      await Promise.all(
        searchResults.map(async (doc) => {
          const { bookmarked } = await checkBookmark(doc.doc_id);
          statuses[doc.doc_id] = bookmarked;
        })
      );
      if (!cancelled) setBookmarks(statuses);
    })();
    return () => {
      cancelled = true;
    };
  }, [hasSearched, searchResults]);

  // Save search state to sessionStorage whenever it changes
  useEffect(() => {
    if (hasSearched) {
      try {
        const stateToSave = {
          searchQuery,
          answer,
          searchResults,
          bookmarks,
          hasSearched,
          useRAG,
          searchType,
          searchFilters,
        };
        sessionStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(stateToSave));
      } catch (err) {
        console.error("Error saving search state:", err);
      }
    }
  }, [
    searchQuery,
    answer,
    searchResults,
    bookmarks,
    hasSearched,
    useRAG,
    searchType,
    searchFilters,
  ]);

  const activeColor =
    String(role).toLowerCase() === "admin" ? "#008c8b" : "#3a7c94";

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query", {
        duration: 5000,
        position: "bottom-right",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await RAGApiService.search({
        query: searchQuery,
        use_rag: useRAG,
        top_k: 10,
      });

      // Sort results by number of relevant sections (descending)
      const sortedResults = [...result.sources].sort((a, b) => {
        const aChunks = a.num_relevant_chunks || 0;
        const bChunks = b.num_relevant_chunks || 0;
        return bChunks - aChunks;
      });

      // Apply client-side filters only in Keyword mode
      let filteredResults = sortedResults;
      if (!useRAG) {
        const f = searchFilters;
        const tagsArray = f.tags
          .split(",")
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean);
        const fromDate = f.fromDate ? new Date(f.fromDate) : null;
        const toDateNext = f.toDate
          ? (() => {
              const d = new Date(f.toDate);
              d.setDate(d.getDate() + 1);
              return d;
            })()
          : null;

        filteredResults = sortedResults.filter((doc) => {
          if (fromDate || toDateNext) {
            if (!doc.date_issued) return false;
            const d = new Date(doc.date_issued);
            if (fromDate && d < fromDate) return false;
            if (toDateNext && d >= toDateNext) return false;
          }
          if (f.issuerLevel) {
            const src = (doc.issuer || "").toLowerCase();
            if (!src.includes(f.issuerLevel.toLowerCase())) return false;
          }
          if (f.docType) {
            const dtype = (doc.doc_type || "").toLowerCase();
            if (!dtype.includes(f.docType.toLowerCase())) return false;
          }
          if (f.code && f.code.trim()) {
            const code = (doc.doc_number || "").toLowerCase();
            if (!code.includes(f.code.trim().toLowerCase())) return false;
          }
          if (f.title && f.title.trim()) {
            const title = (doc.title || "").toLowerCase();
            if (!title.includes(f.title.trim().toLowerCase())) return false;
          }
          if (tagsArray.length) {
            const cats = (doc.categories || []).map((c) =>
              (c || "").toLowerCase()
            );
            for (const tag of tagsArray) {
              if (!cats.includes(tag)) return false;
            }
          }
          return true;
        });
      }

      const bookmarkStatuses: Record<string, boolean> = {};
      await Promise.all(
        filteredResults.map(async (doc) => {
          const { bookmarked } = await checkBookmark(doc.doc_id);
          bookmarkStatuses[doc.doc_id] = bookmarked;
        })
      );

      setBookmarks(bookmarkStatuses);
      setAnswer(result.answer);
      setSearchResults(filteredResults);
      setSearchType(result.search_type);
    } catch (err) {
      console.error("Search error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to perform search. Please ensure the backend is running.",
        { duration: 5000, position: "bottom-right" }
      );
      setAnswer("");
      setSearchResults([]);
      setBookmarks({});
    } finally {
      setIsLoading(false);
    }
  };

  const activeFilterCount = [
    searchFilters.fromDate,
    searchFilters.toDate,
    searchFilters.issuerLevel,
    searchFilters.code,
    searchFilters.title,
    searchFilters.docType,
    searchFilters.tags ? "tags" : undefined,
  ].filter(Boolean).length;

  const resultsToRender = useMemo(() => {
    const arr = [...searchResults];
    arr.sort((a, b) => {
      switch (sortBy) {
        case "date_asc": {
          const da = a.date_issued ? new Date(a.date_issued).getTime() : 0;
          const db = b.date_issued ? new Date(b.date_issued).getTime() : 0;
          return da - db;
        }
        case "title_asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title_desc":
          return (b.title || "").localeCompare(a.title || "");
        case "date_desc":
        default: {
          const da = a.date_issued ? new Date(a.date_issued).getTime() : 0;
          const db = b.date_issued ? new Date(b.date_issued).getTime() : 0;
          return db - da;
        }
      }
    });
    return arr;
  }, [searchResults, sortBy]);

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Document Search
        </h1>
        <p className="text-sm text-gray-600">
          AI-powered semantic search for DepEd memoranda and policies.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ask a question or search for 'learning recovery plan' or 'DO 22 s. 2023'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSearch()
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-10 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {(searchQuery || hasSearched) && (
              <button
                type="button"
                onClick={clearSearch}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-start justify-end gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              disabled={isLoading}
              className="cursor-pointer px-4 py-4 lg:py-6 text-md relative"
            >
              <Funnel className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="cursor-pointer px-4 lg:px-8 py-4 lg:py-6 text-md bg-[#278fb6] hover:bg-[#278fb6]/80"
              style={{
                opacity: isLoading || !searchQuery.trim() ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
        <SearchFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          values={searchFilters}
          onValuesChange={setSearchFilters}
          onApply={() => {
            // Set RAG mode based on dialog selection
            setUseRAG(searchFilters.searchMode === "rag");
            setIsFilterOpen(false);
            // Removed immediate handleSearch() call
          }}
          onReset={() => {
            setSearchFilters({
              fromDate: "",
              toDate: "",
              issuer: "",
              issuerLevel: "",
              code: "",
              title: "",
              tags: "",
              docType: "",
              searchMode: "rag", // Reset to RAG default
            });
            setUseRAG(true); // Reset to RAG default
            setIsFilterOpen(false);
          }}
        />
      </div>

      {/* AI Answer Section */}
      {answer && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">AI</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Answer</h2>
            {searchType && (
              <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {searchType.replace("_", " ").toUpperCase()}
              </span>
            )}
          </div>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Results Header */}
      {hasSearched && !isLoading && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {searchResults.length > 0 ? (
              <>
                Found{" "}
                <span className="font-semibold">{searchResults.length}</span>{" "}
                relevant document{searchResults.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </>
            ) : (
              <>
                No documents found for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Date (Newest)</SelectItem>
                  <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                  <SelectItem value="title_asc">Title (A–Z)</SelectItem>
                  <SelectItem value="title_desc">Title (Z–A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !isLoading && (
        <div className="space-y-4">
          {resultsToRender.map((doc) => (
            <div
              key={doc.doc_id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex justify-between gap-6">
                {/* LEFT SECTION */}
                <div className="flex-1">
                  <Link href={`/view/${doc.doc_id}`} className="block group">
                    <h3
                      className="text-xl font-semibold mb-1 group-hover:underline"
                      style={{ color: activeColor }}
                    >
                      {doc.doc_number} - {doc.title}
                    </h3>
                  </Link>

                  {(doc.date_issued || doc.issuer) && (
                    <p className="text-sm text-gray-600/60 mb-2">
                      {doc.date_issued && (
                        <>
                          Issued:{" "}
                          <span className="font-medium">
                            {new Date(doc.date_issued).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </>
                      )}
                      {doc.date_issued && doc.issuer && " | "}
                      {doc.issuer && (
                        <>
                          Issuer:{" "}
                          <span className="font-medium">{doc.issuer}</span>
                        </>
                      )}
                    </p>
                  )}

                  {doc.summary && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {doc.summary}
                    </p>
                  )}

                  {/* Document Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                    {doc.doc_type && (
                      <span>
                        Type:{" "}
                        <span className="font-medium">{doc.doc_type}</span>
                      </span>
                    )}
                    {doc.num_relevant_chunks && (
                      <span className="text-blue-600">
                        {doc.num_relevant_chunks} relevant section
                        {doc.num_relevant_chunks !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {/* Categories */}
                    {doc.categories &&
                      doc.categories.map((category: string) => {
                        const variant = getBadgeVariant(category);
                        return (
                          <Badge
                            key={category}
                            size="md"
                            {...(variant === "dynamic"
                              ? { className: getDynamicBadgeClasses(category) }
                              : { variant })}
                          >
                            {category}
                          </Badge>
                        );
                      })}
                  </div>
                </div>

                {/* RIGHT SECTION - Action buttons with dynamic bookmark status */}
                <DocumentActionButtons
                  docId={doc.doc_id}
                  initialBookmarked={!!bookmarks[doc.doc_id]}
                  onBookmarkChange={(id, state) =>
                    setBookmarks((prev) => ({ ...prev, [id]: state }))
                  }
                />
              </div>
            </div>
          ))}

          {/* Empty State */}
          {searchResults.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-12 text-center">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-sm text-gray-600">
                Try adjusting your search query or using different keywords
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-12 text-center">
          <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start your search
          </h3>
          <p className="text-md text-gray-600 mb-4">
            Enter a query above to search through DepEd documents with
            AI-powered semantic search
          </p>
          <div className="text-sm text-gray-500 max-w-md mx-auto">
            <p className="mb-2">Try asking questions like:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>"What is the ARAL Program?"</li>
              <li>"School calendar guidelines for 2024"</li>
              <li>"Curriculum implementation policies"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
