"use client";

import { Search as SearchIcon, Loader2, X, Funnel, Users, Calendar, Building, GraduationCap, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SearchResultsSkeleton } from "@/components/search/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { RAGApiService, type DocumentSource } from "@/lib/api/rag-api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/lib/badge-variants";
import DocumentActionButtons from "@/components/shared/thesis-action-buttons";
import { checkBookmark } from "@/server/bookmarks/check-bookmark";
import SearchFilterDialog, { type SearchFilterValues, type SearchMode } from "@/components/search/search-filter-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryStates, debounce } from "nuqs";
import { searchPageParams, type SearchSortOption } from "@/lib/search-params";
import { useTheme } from "@/components/theme-context";

export default function Search() {
  const { theme } = useTheme();
  // URL-synced state using nuqs
  const [urlState, setUrlState] = useQueryStates(searchPageParams, {
    history: "push",
    shallow: false,
  });

  // Derived state from URL params
  const searchQuery = urlState.q;
  const sortBy = urlState.sort;
  const useRAG = urlState.mode === "rag";

  // Local state for API results (not URL-synced)
  const [answer, setAnswer] = useState("");
  const [searchResults, setSearchResults] = useState<DocumentSource[]>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter values (derived from URL state)
  const searchFilters: SearchFilterValues = {
    yearFrom: urlState.yearFrom,
    yearTo: urlState.yearTo,
    college: urlState.college,
    department: urlState.department,
    keywords: urlState.keywords,
    searchMode: urlState.mode as SearchMode,
  };

  // Helper to update filters via URL
  const setSearchFilters = (newFilters: SearchFilterValues) => {
    setUrlState({
      mode: newFilters.searchMode,
      yearFrom: newFilters.yearFrom,
      yearTo: newFilters.yearTo,
      college: newFilters.college,
      department: newFilters.department,
      keywords: newFilters.keywords,
    });
  };

  // Clear search helper
  const clearSearch = () => {
    setUrlState({
      q: "",
      sort: "relevance",
      mode: "rag",
      yearFrom: "",
      yearTo: "",
      college: "",
      department: "",
      keywords: "",
    });
    setAnswer("");
    setSearchResults([]);
    setBookmarks({});
    setHasSearched(false);
    setSearchType("");
  };



  // Re-sync bookmark states for restored results (e.g., when navigating back)
  useEffect(() => {
    if (!hasSearched || searchResults.length === 0) return;
    let cancelled = false;
    (async () => {
      const statuses: Record<string, boolean> = {};
      await Promise.all(
        searchResults.map(async (doc) => {
          const { bookmarked } = await checkBookmark(doc.thesis_id);
          statuses[doc.thesis_id] = bookmarked;
        })
      );
      if (!cancelled) setBookmarks(statuses);
    })();
    return () => {
      cancelled = true;
    };
  }, [hasSearched, searchResults]);

  // Note: Filters are now synced via nuqs URL params, no need for sessionStorage

  const activeColor = theme.primary;

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
    
    // Reset sort based on search mode: relevance for RAG, date_desc for keyword
    setUrlState({ sort: useRAG ? "relevance" : "date_desc" });

    try {
      const result = await RAGApiService.search({
        query: searchQuery,
        use_rag: useRAG,
        top_k: 10,
      });

      // Sort results by number of relevant sections (descending) - this is the default relevance sort
      const sortedResults = [...result.sources].sort((a, b) => {
        const aChunks = a.num_relevant_chunks || 0;
        const bChunks = b.num_relevant_chunks || 0;
        return bChunks - aChunks;
      });

      // Apply client-side filters only in Keyword mode
      let filteredResults = sortedResults;
      if (!useRAG) {
        const f = searchFilters;
        const keywordsArray = f.keywords
          .split(",")
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean);
        const yearFromNum = f.yearFrom ? parseInt(f.yearFrom) : null;
        const yearToNum = f.yearTo ? parseInt(f.yearTo) : null;

        filteredResults = sortedResults.filter((doc) => {
          // Filter by year range
          if (yearFromNum || yearToNum) {
            const docYear = doc.year || 0;
            if (yearFromNum && docYear < yearFromNum) return false;
            if (yearToNum && docYear > yearToNum) return false;
          }
          // Filter by college
          if (f.college) {
            if ((doc.college || "").toLowerCase() !== f.college.toLowerCase()) return false;
          }
          // Filter by department
          if (f.department) {
            if ((doc.department || "").toLowerCase() !== f.department.toLowerCase()) return false;
          }
          // Filter by keywords
          if (keywordsArray.length) {
            const docKeywords = (doc.keywords || []).map((k) => (k || "").toLowerCase());
            for (const keyword of keywordsArray) {
              if (!docKeywords.some(dk => dk.includes(keyword))) return false;
            }
          }
          return true;
        });
      }

      const bookmarkStatuses: Record<string, boolean> = {};
      await Promise.all(
        filteredResults.map(async (doc) => {
          const { bookmarked } = await checkBookmark(doc.thesis_id);
          bookmarkStatuses[doc.thesis_id] = bookmarked;
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
    searchFilters.yearFrom,
    searchFilters.yearTo,
    searchFilters.college,
    searchFilters.department,
    searchFilters.keywords ? "keywords" : undefined,
  ].filter(Boolean).length;

  const resultsToRender = useMemo(() => {
    const arr = [...searchResults];
    
    // Only apply custom sorting if user explicitly selected a sort option
    // Default "relevance" keeps the original API order (sorted by num_relevant_chunks)
    if (sortBy !== "relevance") {
      arr.sort((a, b) => {
        switch (sortBy) {
          case "date_asc": {
            const da = a.date_issued ? new Date(a.date_issued).getTime() : 0;
            const db = b.date_issued ? new Date(b.date_issued).getTime() : 0;
            return da - db;
          }
          case "date_desc": {
            const da = a.date_issued ? new Date(a.date_issued).getTime() : 0;
            const db = b.date_issued ? new Date(b.date_issued).getTime() : 0;
            return db - da;
          }
          case "title_asc":
            return (a.title || "").localeCompare(b.title || "");
          case "title_desc":
            return (b.title || "").localeCompare(a.title || "");
          default:
            return 0;
        }
      });
    }
    // else: keep original order (relevance)
    
    return arr;
  }, [searchResults, sortBy]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Thesis Search
        </h1>
        <p className="text-sm text-gray-600">
          AI-powered semantic search for academic theses and dissertations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-row gap-2 mb-6 w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search titles, authors, or ask a question about a thesis..."
            value={searchQuery || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (useRAG) {
                setUrlState({ q: value }, { shallow: true });
              } else {
                setUrlState(
                  { q: value },
                  { limitUrlUpdates: value === "" ? undefined : debounce(500) }
                );
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSearch()}
            disabled={isLoading}
            className="w-full h-10 pl-10 pr-10 rounded-lg bg-background text-base md:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {(searchQuery || hasSearched) && (
            <button
              type="button"
              onClick={clearSearch}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            disabled={isLoading}
            className="h-10 w-10 p-0 sm:w-auto sm:px-4 cursor-pointer relative shrink-0 bg-white"
          >
            <Funnel className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery?.trim()}
            className={`h-10 w-10 p-0 sm:w-auto sm:px-4 cursor-pointer ${theme.primaryBgClass} ${theme.primaryHoverBgClass} shrink-0 text-white`}
            style={{ opacity: isLoading || !searchQuery?.trim() ? 0.5 : 1 }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin shrink-0" />
            ) : (
              <SearchIcon className="h-4 w-4 sm:hidden shrink-0" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? "Searching..." : "Search"}
            </span>
          </Button>
        </div>
      </div>
      <SearchFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          values={searchFilters}
          onValuesChange={setSearchFilters}
          onApply={(newValues) => {
            setSearchFilters(newValues);
            setUrlState({ mode: newValues.searchMode });
            setIsFilterOpen(false);
          }}
          onReset={() => {
            setSearchFilters({
              yearFrom: "",
              yearTo: "",
              college: "",
              department: "",
              keywords: "",
              searchMode: "rag",
            });
            setIsFilterOpen(false);
          }}
        />

      {/* Loading Skeleton */}
      {isLoading && <SearchResultsSkeleton showAnswer={useRAG} />}

      {/* AI Answer Section */}
      {!isLoading && answer && (
        <div className="mb-6 p-6 bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
              <span className="text-blue-600 font-bold text-sm">AI</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Answer</h2>
            {searchType && (
              <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                {searchType.replace("_", " ").toUpperCase()}
              </span>
            )}
          </div>
          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 text-justify leading-7 [&>*]:text-justify [&_p]:text-justify [&_li]:text-justify [&_p]:leading-7 [&_li]:leading-7 [&_p]:mb-3 [&_ul]:my-2 [&_ol]:my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Results Header */}
      {hasSearched && !isLoading && (
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 mb-4">
          <div className="text-sm text-gray-600 truncate flex-1 min-w-0">
            {searchResults.length > 0 ? (
              <>
                Found{" "}
                <span className="font-semibold">{searchResults.length}</span>{" "}
                relevant {searchResults.length !== 1 ? "theses" : "thesis"} for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </>
            ) : (
              <>
                No theses found for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={(v) => setUrlState({ sort: v as SearchSortOption })}>
                <SelectTrigger className="!h-10 w-10 sm:w-40 lg:w-48 p-0 sm:px-3 flex items-center justify-center sm:justify-between shrink-0 [&>svg:last-child]:hidden sm:[&>svg:last-child]:block bg-white">
                  <ArrowUpDown className="h-4 w-4 sm:hidden shrink-0 text-muted-foreground m-auto" />
                  <span className="hidden sm:inline-block truncate text-left w-full">
                    <SelectValue placeholder="Sort by" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {useRAG && <SelectItem value="relevance">Relevance</SelectItem>}
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
            <Card
              key={doc.thesis_id}
              className="rounded-xl border-gray-200 p-3 sm:p-4 hover:shadow-md transition-all"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row justify-between gap-3 sm:gap-4">
                  {/* LEFT SECTION */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/view/${doc.thesis_id}`} className="block group">
                      <h3
                        className="text-sm sm:text-base lg:text-lg font-semibold mb-1 group-hover:underline line-clamp-2"
                        style={{ color: activeColor }}
                      >
                        {doc.title}
                      </h3>
                    </Link>

                    {/* Authors */}
                    {doc.authors && doc.authors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 mb-1.5">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {doc.authors.join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2">
                      {doc.year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>{doc.year}</span>
                        </div>
                      )}
                      {doc.department && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>{doc.department}</span>
                        </div>
                      )}
                      {doc.college && (
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span>{doc.college}</span>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {doc.summary && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {doc.summary}
                      </p>
                    )}

                    {/* Keywords/Categories */}
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                      {doc.keywords && doc.keywords.slice(0, 5).map((keyword: string) => (
                        <Badge
                          key={keyword}
                          size="md"
                          className={cn(getDynamicBadgeClasses(keyword), "max-w-full")}
                          title={keyword}
                        >
                          <span className="truncate">{keyword}</span>
                        </Badge>
                      ))}
                      {doc.keywords && doc.keywords.length > 5 && (
                        <Badge variant="outline" size="md" className="shrink-0 max-w-full">
                          <span className="truncate">+{doc.keywords.length - 5} more</span>
                        </Badge>
                      )}
                      {/* Fallback to categories if no keywords */}
                      {(!doc.keywords || doc.keywords.length === 0) && doc.categories &&
                        doc.categories.slice(0, 5).map((category: string) => {
                          const variant = getBadgeVariant(category);
                          return (
                            <Badge
                              key={category}
                              size="md"
                              {...(variant === "dynamic"
                                ? { className: cn(getDynamicBadgeClasses(category), "max-w-full") }
                                : { variant, className: "max-w-full" })}
                              title={category}
                            >
                              <span className="truncate">{category}</span>
                            </Badge>
                          );
                        })}
                      {(!doc.keywords || doc.keywords.length === 0) && doc.categories && doc.categories.length > 5 && (
                        <Badge variant="outline" size="md" className="shrink-0 max-w-full">
                          <span className="truncate">+{doc.categories.length - 5} more</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-end lg:justify-start pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <DocumentActionButtons
                      thesisId={doc.thesis_id}
                      initialBookmarked={!!bookmarks[doc.thesis_id]}
                      onBookmarkChange={(id, state) =>
                        setBookmarks((prev) => ({ ...prev, [id]: state }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {searchResults.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-12 text-center">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No theses found
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
            Enter a query above to search through academic theses with
            AI-powered semantic search
          </p>
          <div className="text-sm text-gray-500 max-w-md mx-auto">
            <p className="mb-2">Try asking questions like:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>"Impact of AI on writing skills"</li>
              <li>"Reading comprehension strategies"</li>
              <li>"Gamification in mathematics"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}