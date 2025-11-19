"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { CategoryDocument } from "../../server/actions";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import { ChevronLeft, Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import IssuancesFilterDialog, {
  type IssuancesFilterFormValues,
} from "@/features/shared/components/issuances-filter-dialog";
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
};

export default function Category({
  categoryName,
  initialDocuments,
  initialBookmarks,
  total = 0,
  page = 1,
  pageSize = 10,
}: Props) {
  const [documents] = useState<CategoryDocument[]>(initialDocuments);
  const [bookmarks] = useState<Record<string, boolean>>(initialBookmarks);
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<IssuancesFilterFormValues>({
    fromDate: "",
    toDate: "",
    issuer: "",
    issuerLevel: "",
    code: "",
    title: "",
    tags: "",
    docType: "",
  });
  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "title_asc" | "title_desc"
  >("date_desc");

  const activeColor = "#3a7c94"; // Default user color

  const activeFilterCount = [
    filters.fromDate,
    filters.toDate,
    filters.issuerLevel,
    filters.code,
    filters.title,
    filters.docType,
    filters.tags ? "tags" : undefined,
  ].filter(Boolean).length;

  const visibleDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tagsArray = filters.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDateNext = filters.toDate
      ? (() => {
          const d = new Date(filters.toDate);
          d.setDate(d.getDate() + 1);
          return d;
        })()
      : null;

    let result = documents.filter((doc) => {
      if (fromDate || toDateNext) {
        if (!doc.date_issued) return false;
        const d = new Date(doc.date_issued);
        if (fromDate && d < fromDate) return false;
        if (toDateNext && d >= toDateNext) return false;
      }
      if (filters.issuerLevel) {
        const src = (doc.issuer || "").toLowerCase();
        if (!src.includes(filters.issuerLevel.toLowerCase())) return false;
      }
      if (filters.docType) {
        const dtype = (doc.doc_type || "").toLowerCase();
        if (!dtype.includes(filters.docType.toLowerCase())) return false;
      }
      if (filters.code && filters.code.trim()) {
        const code = (doc.doc_number || "").toLowerCase();
        if (!code.includes(filters.code.trim().toLowerCase())) return false;
      }
      if (filters.title && filters.title.trim()) {
        const title = (doc.title || "").toLowerCase();
        if (!title.includes(filters.title.trim().toLowerCase())) return false;
      }
      if (tagsArray.length) {
        const cats = (doc.categories || []).map((c) => ((c as string) || "").toLowerCase());
        for (const tag of tagsArray) {
          if (!cats.includes(tag)) return false;
        }
      }
      if (!q) return true;
      const hay = [
        doc.title || "",
        doc.doc_number || "",
        doc.issuer || "",
        doc.summary || "",
      ]
        .join("\n")
        .toLowerCase();
      return hay.includes(q);
    });

    result.sort((a, b) => {
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

    return result;
  }, [documents, filters, query, sortBy]);

  const shouldShowPagination = query.trim() === "" || (query.trim() !== "" && visibleDocs.length === 0);
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < totalPages ? page + 1 : totalPages;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
        <p className="text-sm text-gray-600">
          Browse documents in this category.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by keyword, title, code, or issuer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
        </div>
        <div className="flex items-center justify-end">
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
        </div>
        <IssuancesFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          values={filters}
          onValuesChange={setFilters}
          onApply={() => setIsFilterOpen(false)}
          onReset={() => {
            setFilters({
              fromDate: "",
              toDate: "",
              issuer: "",
              issuerLevel: "",
              code: "",
              title: "",
              tags: "",
              docType: "",
            });
            setIsFilterOpen(false);
          }}
        />
      </div>

      {/* Results Header */}
      {/* <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {documents.length > 0 ? (
            <>
              Found{" "}
              <span className="font-semibold">{documents.length}</span>{" "}
              document{documents.length !== 1 ? "s" : ""} in{" "}
              <span className="font-semibold">"{categoryName}"</span>
            </>
          ) : (
            <>
              No documents found in{" "}
              <span className="font-semibold">"{categoryName}"</span>
            </>
          )}
        </div>
      </div> */}

      {/* Documents List */}
      <div className="space-y-4">
        {visibleDocs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-sm text-gray-600">
              There are no documents in this category yet.
            </p>
          </div>
        ) : (
          visibleDocs.map((doc) => (
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
                  {doc.date_issued && doc.issuer && (
                    <p className="text-sm text-gray-600/60 mb-2">
                      Issued: <span className="font-medium"></span>{new Date(doc.date_issued).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric' 
                      })} | Issuer: <span className="font-medium">{doc.issuer || "N/A"}</span>
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
                          className="mr-2 mb-2"
                        >
                          {category}
                        </Badge>
                      );
                    })}
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
              href={`/categories/${encodeURIComponent(categoryName)}?page=${prevPage}`}
              className={`px-3 py-2 rounded-md border text-sm ${page === 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-50"}`}
              aria-disabled={page === 1}
            >
              Previous
            </Link>
            <Link
              href={`/categories/${encodeURIComponent(categoryName)}?page=${nextPage}`}
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