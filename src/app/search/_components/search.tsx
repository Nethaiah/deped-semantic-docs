"use client";

import {
  Search as SearchIcon,
  SlidersHorizontal,
  Eye,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { mockSearchResults, type SearchResult } from "@/lib/mock-data";

// Helper function to get tag styling - using default style for all tags
const getTagClassName = (): string => {
  return "bg-cyan-100 text-cyan-700";
};

// Helper function to get match percentage color
const getMatchColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-orange-500";
};

export default function Search() {
  // TODO: Replace with actual state management and API calls
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState<SearchResult[]>(mockSearchResults);
  const [sortBy, setSortBy] = useState("relevance");

  // TODO: Implement search handler
  const handleSearch = () => {
    // Example API call:
    // fetch(`/api/search?query=${searchQuery}&sort=${sortBy}`)
    //   .then(res => res.json())
    //   .then(data => setSearchResults(data));
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Document Search
        </h1>
        <p className="text-sm text-gray-600">
          Comprehensive retrieval of DepEd memoranda and policies.
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
          className="px-8 py-6 text-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          Search
        </Button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {/* TODO: Replace with actual search query and result count from API */}
          Showing <span className="font-semibold">{searchResults.length}</span>{" "}
          results for{" "}
          <span className="font-semibold">
            "{searchQuery || "school calendar"}"
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* TODO: Add more sort options as needed */}
            <option value="relevance">Relevance (Semantic)</option>
            <option value="date">Date (Newest)</option>
            <option value="date-old">Date (Oldest)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {/*
          TODO: BACKEND DEVELOPERS - Map through your search results here
          Replace searchResults with your API response

          Expected data structure:
          {
            id: number | string,
            code: string,
            title: string,
            issuedDate: string,
            description: string,
            tags: [{ label: string, type: string }],
            matchPercentage: number
          }
        */}
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all flex justify-between gap-6"
          >
            {/* LEFT SECTION */}
            <div className="flex-1">
              <Link href={`/view/${result.slug}`} className="block group">
                <h3 className="text-lg font-semibold text-[#333DAD] group-hover:text-blue-700 mb-1">
                  {result.code} - {result.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-500 mb-2">
                Issued: {result.issuedDate}
              </p>

              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {result.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getTagClassName()}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-end justify-end gap-4">
              {/* Match percentage bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getMatchColor(
                      result.matchPercentage,
                    )}`}
                    style={{ width: `${result.matchPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {result.matchPercentage}%
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/view/${result.slug}`}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  title="View document"
                >
                  <Eye className="h-5 w-5 text-gray-600" />
                </Link>
                <button
                  type="button"
                  className="p-2 bg-gray-200 hover:bg-gray-300  rounded-md transition-colors"
                  title="Bookmark"
                >
                  <Bookmark className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-gray-200 hover:bg-gray-300  rounded-md transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State - Show when no results */}
        {searchResults.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
