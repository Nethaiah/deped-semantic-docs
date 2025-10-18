"use client";

import { ArrowRight } from "lucide-react";
import { useCurrentTime } from "@/lib/time-utils";
import Link from "next/link";
import { latestIssuances, recentlyViewed } from "@/lib/mock-data";

export default function UserDocuments() {
  const { formattedTime, formattedDate } = useCurrentTime();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#CCD9FF] via-[#9BA9E6] to-[#333DAD] text-white px-8 py-8 rounded-3xl mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-black text-4xl font-bold mb-2">Welcome Back, User!</h1>
            <p className="text-black text-sm">
              Stay informed with the latest orders and memoranda from your organization.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formattedTime}</div>
            <div className="text-sm text-white/90">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl text-center border-l-4 border-yellow-400 shadow-sm">
          <div className="text-5xl font-bold text-gray-900 mb-2">13</div>
          <div className="text-sm text-gray-700 font-medium">Bookmarked</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl text-center border-l-4 border-green-400 shadow-sm">
          <div className="text-5xl font-bold text-gray-900 mb-2">13</div>
          <div className="text-sm text-gray-700 font-medium">Bookmarked</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl text-center border-l-4 border-purple-400 shadow-sm">
          <div className="text-5xl font-bold text-gray-900 mb-2">13</div>
          <div className="text-sm text-gray-700 font-medium">Bookmarked</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issuances */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold mb-5 text-gray-900">Latest Issuances</h2>
          <div className="space-y-3">
            {latestIssuances.map((doc, i) => (
              <Link key={`${doc.slug}-${i}`} href={`/view/${doc.slug}`} className="block">
                <div className="p-4 rounded-xl bg-[#F5FBFF] border-l-4 border-indigo-500 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#333DAD] text-base">{doc.code}</span>
                    {doc.status && (
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                          doc.status === "NEW"
                            ? "bg-[#DDF4FF] text-[#333DAD]"
                            : doc.status === "URGENT"
                            ? "bg-[#FFD2D2] text-[#AE2D2D]"
                            : "bg-[#C2FFBA] text-[#048918]"
                        }`}
                      >
                        {doc.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#848080] mb-1">{doc.title} | {doc.category} • {doc.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-5 text-gray-900">Recently Viewed</h2>
          <div className="space-y-3">
            {recentlyViewed.map((item, i) => (
              <Link key={`${item.slug}-${i}`} href={`/view/${item.slug}`} className="block">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F5F5F5] hover:bg-gray-100 hover:shadow-md transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-[#333DAD] text-base mb-1">{item.code}</p>
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
