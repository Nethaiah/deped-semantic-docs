"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { CategoryDocument } from "../../server/actions";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import { ChevronLeft } from "lucide-react";

type Props = {
  categoryName: string;
  initialDocuments: CategoryDocument[];
  initialBookmarks: Record<string, boolean>;
  total: number;
  page: number;
  pageSize: number;
};

export default function Category({
  categoryName,
  initialDocuments,
  initialBookmarks,
  total,
  page,
  pageSize,
}: Props) {
  const [documents] = useState<CategoryDocument[]>(initialDocuments);
  const [bookmarks] = useState<Record<string, boolean>>(initialBookmarks);

  const activeColor = "#333DAD"; // Default user color
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
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-sm text-gray-600">
              There are no documents in this category yet.
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
                  {doc.date_issued && (
                    <p className="text-sm text-gray-500 mb-2">
                      Issued: {new Date(doc.date_issued).toLocaleDateString()}
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
                    {doc.issuer && (
                      <span>
                        Issuer:{" "}
                        <span className="font-medium">{doc.issuer}</span>
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
      {totalPages > 1 && (
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

