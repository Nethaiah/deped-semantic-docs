"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import type { CategoryDocument } from "../../server/actions";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import { ChevronLeft, Funnel, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryFilterDialog, {
  type CategoryFilterFormValues,
} from "./category-filter-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  categoryName: string;
  initialDocuments: CategoryDocument[];
  initialBookmarks: Record<string, boolean>;
  total?: number;
  page?: number;
  pageSize?: number;
  initialQuery?: string;
  initialFilters?: CategoryFilterFormValues;
  initialSort?: "date_desc" | "date_asc" | "title_asc" | "title_desc";
};

export default function Category({
  categoryName,
  initialDocuments,
  initialBookmarks,
  total = 0,
  page = 1,
  pageSize = 10,
  initialQuery = "",
  initialFilters,
  initialSort = "date_desc",
}: Props) {
  const router = useRouter();
  const documents = initialDocuments;
  const bookmarks = initialBookmarks;

  const [query, setQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CategoryFilterFormValues>(
    initialFilters ?? {
      fromDate: "",
      toDate: "",
      issuerLevel: "",
      docType: "",
    }
  );

  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "title_asc" | "title_desc"
  >(initialSort);

  const activeColor = "#3a7c94"; // Default user color

  const activeFilterCount = [
    filters.fromDate,
    filters.toDate,
    filters.issuerLevel,
    filters.docType,
  ].filter(Boolean).length;

  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const shouldShowPagination = totalPages > 1;
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < totalPages ? page + 1 : totalPages;

  const buildQueryString = (
    targetPage: number,
    targetSort?: string,
    targetFilters?: CategoryFilterFormValues,
    targetQuery?: string
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    
    const trimmedQuery = (targetQuery ?? query).trim();
    if (trimmedQuery) params.set("q", trimmedQuery);
    
    const useFilters = targetFilters ?? filters;
    if (useFilters.fromDate) params.set("fromDate", useFilters.fromDate);
    if (useFilters.toDate) params.set("toDate", useFilters.toDate);
    if (useFilters.issuerLevel) params.set("issuerLevel", useFilters.issuerLevel);
    if (useFilters.docType) params.set("docType", useFilters.docType);
    
    const useSort = targetSort ?? sortBy;
    if (useSort !== "date_desc") params.set("sort", useSort);
    
    return params.toString();
  };

  const applyFiltersAndSearch = (
    nextFilters: CategoryFilterFormValues,
    nextQuery: string,
    targetPage = 1
  ) => {
    const params = buildQueryString(targetPage, undefined, nextFilters, nextQuery);
    router.push(`/categories/${encodeURIComponent(categoryName)}?${params}`);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort as any);
    const params = buildQueryString(1, newSort);
    router.push(`/categories/${encodeURIComponent(categoryName)}?${params}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-4">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 text-sm text-[#278fb6] cursor-pointer bg-gray-200 hover:bg-gray-300 border-gray-300 border-1 px-5 py-1 rounded-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName}
        </h1>
        <p className="text-sm text-gray-600">
          Browse documents in this category.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword, title, or issuer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFiltersAndSearch(filters, (e.target as HTMLInputElement).value, 1);
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-10 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  applyFiltersAndSearch(filters, "", 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 8.586l3.536-3.536a1 1 0 111.414 1.414L11.414 10l3.536 3.536a1 1 0 01-1.414 1.414L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464A1 1 0 116.464 5.05L10 8.586z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="cursor-pointer px-4 py-6 text-md relative"
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
            onClick={() => applyFiltersAndSearch(filters, query, 1)}
            className="cursor-pointer px-8 py-6 text-md bg-[#278fb6] hover:bg-[#278fb6]/80"
          >
            Search
          </Button>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
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
        <CategoryFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          values={filters}
          onValuesChange={setFilters}
          onApply={() => {
            setIsFilterOpen(false);
            applyFiltersAndSearch(filters, query, 1);
          }}
          onReset={() => {
            const resetFilters = {
              fromDate: "",
              toDate: "",
              issuerLevel: "",
              docType: "",
            };
            setFilters(resetFilters);
            setQuery("");
            setIsFilterOpen(false);
            applyFiltersAndSearch(resetFilters, "", 1);
          }}
        />
      </div>

      {/* Results count */}
      {total > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{total}</span> document{total !== 1 ? "s" : ""}
          {query && (
            <> matching <span className="font-semibold">"{query}"</span></>
          )}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-sm text-gray-600">
              {query || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "There are no documents in this category yet."}
            </p>
          </div>
        ) : (
          documents.map((doc) => (
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
                      {doc.doc_number ? `${doc.doc_number} - ` : ""}
                      {doc.title}
                    </h3>
                  </Link>
                  {(doc.date_issued || doc.issuer) && (
                    <p className="text-sm text-gray-600/60 mb-2">
                      {doc.date_issued && (
                        <>
                          Issued:{" "}
                          <span className="font-medium">
                            {new Date(doc.date_issued).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </>
                      )}
                      {doc.date_issued && doc.issuer && " | "}
                      {doc.issuer && (
                        <>
                          Issuer: <span className="font-medium">{doc.issuer}</span>
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
                  </div>
                  {/* Categories */}
                  <div className="flex flex-wrap gap-1.5">
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
                  initialBookmarked={bookmarks[doc.doc_id]}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {shouldShowPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/categories/${encodeURIComponent(categoryName)}?${buildQueryString(prevPage)}`}
              className={`px-3 py-2 rounded-md border text-sm ${page === 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-50"}`}
              aria-disabled={page === 1}
            >
              Previous
            </Link>
            <Link
              href={`/categories/${encodeURIComponent(categoryName)}?${buildQueryString(nextPage)}`}
              className={`px-3 py-2 rounded-md border text-sm ${page === totalPages ? "pointer-events-none opacity-50" : "hover:bg-slate-50"}`}
              aria-disabled={page === totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
