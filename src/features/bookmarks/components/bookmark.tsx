"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import NumberedPagination from "@/features/shared/components/numbered-pagination";

type BookmarkedDoc = {
  id: string;
  docNumber?: string | null;
  title?: string | null;
  dateIssued?: string | null;
  issuer?: string | null;
  summary?: string | null;
  docType?: string | null;
  categories?: string[] | null;
};

type Props = {
  role: string;
  docs: BookmarkedDoc[];
  total?: number;
  page?: number;
  pageSize?: number;
  initialQuery?: string;
  initialSort?: "date_desc" | "date_asc" | "title_asc" | "title_desc";
};

export default function Bookmarks({ 
  role, 
  docs, 
  total = 0, 
  page = 1, 
  pageSize = 10, 
  initialQuery = "",
  initialSort = "date_desc"
}: Props) {
  const router = useRouter();
  
  // State
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when new data arrives
  useEffect(() => {
    setIsLoading(false);
  }, [docs, page, total]);

  const activeColor = String(role).toLowerCase() === "admin" ? "#008c8b" : "#3a7c94";

  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));

  const buildQueryString = (targetPage: number, targetQuery?: string, targetSort?: string) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    
    const q = (targetQuery ?? query).trim();
    if (q) params.set("q", q);
    
    const s = targetSort ?? sortBy;
    if (s !== "date_desc") params.set("sort", s);

    return params.toString();
  };

  const buildHref = (targetPage: number) => {
    return `/bookmarks?${buildQueryString(targetPage)}`;
  };

  const handleSearch = () => {
    setIsLoading(true);
    const params = buildQueryString(1, query, sortBy);
    router.push(`/bookmarks?${params}`);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort as any);
    setIsLoading(true);
    const params = buildQueryString(1, query, newSort);
    router.push(`/bookmarks?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
  };

  const hasAny = (total || 0) > 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bookmarked Documents
        </h1>
        <p className="text-sm text-gray-600">
          Quickly review the memoranda and orders you saved.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by keyword, title, code, or issuer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 8.586l3.536-3.536a1 1 0 111.414 1.414L11.414 10l3.536 3.536a1 1 0 01-1.414 1.414L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464A1 1 0 116.464 5.05L10 8.586z" clipRule="evenodd"/></svg>
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="cursor-pointer px-8 py-6 text-md bg-[#278fb6] hover:bg-[#278fb6]/80 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Search...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          {/* Results Header Count */}
          {hasAny && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{total}</span> bookmarked document{total !== 1 ? "s" : ""}
            </div>
          )}
          {!hasAny && <div />}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange} disabled={isLoading}>
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
        </div>
      </div>

      {/* Lists */}
      <div className={`space-y-4 transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {hasAny || query || initialQuery ? (
          docs.length > 0 ? (
            <div className="space-y-4">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between gap-6">
                    {/* LEFT SECTION */}
                    <div className="flex-1">
                      <Link href={`/view/${doc.id}`} className="block group">
                        <h3
                          className="text-xl font-semibold mb-1 group-hover:underline"
                          style={{ color: activeColor }}
                        >
                          {doc.docNumber ? `${doc.docNumber} - ` : ""} {doc.title}
                        </h3>
                      </Link>

                      {(doc.dateIssued || doc.issuer) && (
                        <p className="text-sm text-gray-600/60 mb-2">
                          {doc.dateIssued && (
                            <>
                              Issued:{" "}
                              <span className="font-medium">
                                {new Date(doc.dateIssued).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </>
                          )}
                          {doc.dateIssued && doc.issuer && " | "}
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

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        {doc.docType && (
                          <span>
                            Type:{" "}
                            <span className="font-medium">{doc.docType}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {doc.categories?.map((category) => {
                          const variant = getBadgeVariant(category);
                          return (
                            <Badge
                              key={category}
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

                    {/* ACTION BUTTONS */}
                    <DocumentActionButtons docId={doc.id} initialBookmarked={true} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {query || initialQuery ? "No documents found" : "No bookmarks yet"}
              </h3>
              <p className="text-sm text-gray-600">
                {query || initialQuery ? "Try adjusting your search query or using different keywords" : "When you find documents you want to save for later, click the bookmark icon."}
              </p>
            </div>
          )
        ) : (
          // --- No Bookmarks At All ---
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
            <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 max-w-md mb-4">
              When you find documents you want to save for later, click the bookmark icon.
            </p>
            <Link href="/search">
              <span className="px-4 py-2 rounded-md text-white bg-[#278fb6] hover:bg-[#278fb6]/80 cursor-pointer">
                Browse Documents
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Numbered Pagination */}
      <NumberedPagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}