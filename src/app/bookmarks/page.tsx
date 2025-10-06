"use client";

import { Search as SearchIcon, Funnel, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";

const bookmarks = [
  {
    id: 1,
    title: "DO 022, s. 2023 – Implementing Guidelines on the School Calendar and Activities for SY 2023-2024",
    description: "To ensure that all learners have access to quality education, this Order provides the school calendar for SY 2022-2023, which includes...",
    issuedDate: "January 25, 2023",
    office: "Office of the Deputy M",
    tags: ["Policy", "School Calendar"],
  },
];

export default function BookmarksPage() {
  return (
    <>
      <Sidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarked Documents</h1>
            <p className="text-sm text-gray-600">
              Quickly review the memoranda and orders you saved.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'learning recovery plan' or 'DO 22 s. 2023'..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              className="px-6 py-3 border-gray-300 hover:bg-gray-50"
            >
              <Funnel className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white">
              Search
            </Button>
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
                    <h3 className="text-base font-semibold text-blue-600 hover:underline cursor-pointer flex-1 pr-4">
                      {bookmark.title}
                    </h3>
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
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {bookmark.tags[0]}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {bookmark.tags[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-600 max-w-md mb-4">
                When you find documents you want to save for later, click the bookmark icon to add them here.
              </p>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
}