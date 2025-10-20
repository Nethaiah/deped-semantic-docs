"use client";

import { ArrowRight } from "lucide-react";
import { useCurrentTime } from "@/lib/time-utils";
import Link from "next/link";
import { recentlyViewed, latestIssuances } from "@/lib/mock-data";

// Helper function to get tag styling based on tag name
const getTagClassName = (tag: string): string => {
  const tagStyles: Record<string, string> = {
    Policy: "bg-orange-100 text-orange-700",
    Memo: "bg-teal-100 text-teal-700",
    Learning: "bg-blue-600 text-white",
    Curriculum: "bg-purple-600 text-white",
    "School Calendar": "bg-red-100 text-red-700",
  };
  return tagStyles[tag] || "bg-gray-100 text-gray-700";
};

export default function UserDocuments() {
  const { formattedTime, formattedDate } = useCurrentTime();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-100 border-1 border-gray-300 text-white px-8 py-15 rounded-3xl mb-6">
        <div className="flex justify-between items-start">
          <div>
            {/* TODO: Replace "User" with actual user name from auth/session */}
            <h1 className="text-[#333] text-4xl font-bold mb-2">
              Welcome Back, User!
            </h1>
            <p className="text-[#333]/70 text-lg font-semibold">
              Stay informed with the latest orders and memoranda from your
              organization.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl text-[#333] font-bold tracking-[0.2rem]">
              {formattedTime}
            </div>
            <div className="text-lg text-[#333]">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Latest Issuances Table */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Title Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Latest Issuance
            </h2>
            <button className="text-sm text-[#333DAD] hover:underline font-medium">
              Show all
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
                  Created
                </th>
                <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
                  Title
                </th>
                <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
                  Tags
                </th>
                <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
                  Issuer
                </th>
              </tr>
            </thead>
            <tbody>
              {latestIssuances.map((issuance, index) => (
                <tr
                  key={issuance.id}
                  className={`hover:bg-gray-50 ${
                    index !== latestIssuances.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Created Date Column */}
                  <td className="py-4 px-4 text-md text-gray-600">
                    <Link
                      href={`/view/${issuance.slug}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {issuance.issuedDate}
                    </Link>
                  </td>

                  {/* Title Column - Now clickable */}
                  <td className="py-4 px-4 text-md text-gray-900 max-w-[250px]">
                    <Link
                      href={`/view/${issuance.slug}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <div
                        className="truncate"
                        title={`${issuance.code} ${issuance.title}`}
                      >
                        <span className="font-bold text-[#333DAD]">
                          {issuance.code}
                        </span>{" "}
                        <br />
                        <span className="text-gray-900">{issuance.title}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Tags Column */}
                  <td className="py-4 px-4">
                    <Link
                      href={`/view/${issuance.slug}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {issuance.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`text-xs px-2.5 py-1 rounded-md font-medium ${getTagClassName(
                              tag
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {issuance.tags.length > 2 && (
                          <span
                            className="text-xs text-gray-500 font-semibold cursor-default"
                            title={issuance.tags.slice(2).join(", ")}
                          >
                            +{issuance.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </Link>
                  </td>

                  {/* Issuer Column */}
                  <td className="py-4 px-4 text-md text-gray-600">
                    <Link
                      href={`/view/${issuance.slug}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <span className="text-gray-500 text-sm">
                        {issuance.office}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}

              {/* Empty State - Show when no data */}
              {latestIssuances.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No issuances found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Section: Recently Viewed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-5 text-gray-900">
            Recently Viewed
          </h2>
          <div className="space-y-3">
            {recentlyViewed.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/view/${item.slug}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F5F5F5] hover:bg-gray-100 hover:shadow-md transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-[#333DAD] text-base mb-1">
                      {item.code}
                    </p>
                    <p className="text-sm text-[#848080]">{item.title}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#333DAD]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
