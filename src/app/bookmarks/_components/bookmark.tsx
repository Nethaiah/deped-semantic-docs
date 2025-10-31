"use client";
import { Search as SearchIcon, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { bookmarks } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Role = {
  role: string;
};

export default function BookmarksPage({ role }: Role) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const activeColor = String(role).toLowerCase() === "admin" ? "#008c8b" : "#333DAD";

  // Helper to map tag labels to Badge variant
  const getBadgeVariant = (tag: string):
    | "policy"
    | "memo"
    | "learning"
    | "curriculum"
    | "schoolCalendar" => {
    switch (tag) {
      case "Policy":
        return "policy";
      case "Memo":
        return "memo";
      case "Learning":
        return "learning";
      case "Curriculum":
        return "curriculum";
      case "School Calendar":
        return "schoolCalendar";
      default:
        return "policy";
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
        <Button
          onClick={handleSearch}
          className={`cursor-pointer px-8 py-6 text-md bg-[${activeColor}] hover:bg-[${activeColor}-700] text-white`}
        >
          Search
        </Button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{bookmarks.length}</span>{" "}
          results for{" "}
          <span className="font-semibold">
            "{searchQuery || "bookmarked documents"}"
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Relevance (Semantic)</option>
            <option value="date">Date (Newest)</option>
            <option value="date-old">Date (Oldest)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
      {/* Bookmarked Documents */}
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <Link href={`/view/${bookmark.slug}`} className="flex-1 pr-4">
                  <h3 className={`text-base font-semibold text-[${activeColor}] hover:underline cursor-pointer`}>
                    {bookmark.title}
                  </h3>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove bookmark</span>
                </Button>
              </div>

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {bookmark.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                {bookmark.tags.map((t) => (
                  <Badge key={t} size="md" variant={getBadgeVariant(t)}>
                    {t}
                  </Badge>
                ))}
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
        </div>
      )}
    </div>
  );
}
