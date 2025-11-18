import {
  Search as SearchIcon,
  SlidersHorizontal,
  Trash2,
  Eye,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBookmarkedDocuments } from "../server/get-bookmark";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import DocumentActionButtons from "@/features/shared/components/document-action-buttons";

type Role = {
  role: string;
};

export default async function BookmarksPage({ role }: Role) {
  const { data: bookmarkedDocs, error } = await getBookmarkedDocuments();
  const activeColor =
    String(role).toLowerCase() === "admin" ? "#008c8b" : "#3a7c94";

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

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for 'learning recovery plan' or 'DO 22 s. 2023'..."
            className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          variant="outline"
          className="px-6 py-6 text-md border-gray-300 hover:bg-gray-50 flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced
        </Button>
        <Button className="px-8 py-6 text-md text-white bg-[#278fb6] hover:bg-[#278fb6]/80 cursor-pointer">
          Search
        </Button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{bookmarkedDocs.length}</span>{" "}
          bookmarked documents
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="recent">Recently Added</option>
            <option value="date">Date Issued (Newest)</option>
            <option value="date-old">Date Issued (Oldest)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Bookmarked Documents */}
      {bookmarkedDocs.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedDocs.map((doc) => (
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
                      {doc.docNumber} - {doc.title}
                    </h3>
                  </Link>

                  {doc.dateIssued && doc.issuer && (
                    <p className="text-sm text-gray-600/60 mb-2">
                      Issued: <span className="font-medium">{new Date(doc.dateIssued).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}</span> | Issuer: <span className="font-medium">{doc.issuer || "N/A"}</span>
                    </p>
                  )}

                  {doc.summary && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {doc.summary}
                    </p>
                  )}

                  {/* Document Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                    {doc.docType && (
                      <span>
                        Type:{" "}
                        <span className="font-medium">{doc.docType}</span>
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
                  docId={doc.id}
                  initialBookmarked={true}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 max-w-md mb-4">
            When you find documents you want to save for later, click the
            bookmark icon to add them here.
          </p>
          <Link href="/dashboard">
            <Button className="text-white bg-[#278fb6] hover:bg-[#278fb6]/80 cursor-pointer">
              Browse Documents
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
