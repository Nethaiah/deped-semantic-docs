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
    String(role).toLowerCase() === "admin" ? "#008c8b" : "#333DAD";

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
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              {/* Title + Action Buttons */}
              <div className="flex items-start justify-between mb-3">
                <Link href={`/view/${doc.id}`} className="flex-1 pr-4">
                  <h3
                    className="text-base font-semibold hover:underline cursor-pointer"
                    style={{ color: activeColor }}
                  >
                    {doc.title}
                  </h3>
                  {doc.docNumber && (
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.docNumber}
                    </p>
                  )}
                </Link>

                {/* Action Buttons */}
                {/* Reusable Action Buttons */}
                <DocumentActionButtons
                  docId={doc.id}
                  initialBookmarked={true}
                />
              </div>

              {/* Summary */}
              {doc.summary && (
                <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-2">
                  {doc.summary}
                </p>
              )}

              {/* Categories + Date */}
              <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
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
                {doc.dateIssued && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Issued: {new Date(doc.dateIssued).toLocaleDateString()}
                  </span>
                )}
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
