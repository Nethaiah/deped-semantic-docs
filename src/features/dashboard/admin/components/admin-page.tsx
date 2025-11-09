import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { latestIssuances, recentlyViewed } from "@/lib/mock-data";
import { getLatestIssuances } from "@/features/shared/server/get-latest-issuances";
import LatestIssuances from "./latest-issuances";
import ClientTimeDisplay from "@/features/dashboard/shared/components/time"

type Admin = {
  name: string;
};

export default async function AdminDocuments({ name }: Admin ) {
  const latestIssuances = await getLatestIssuances();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-100 border-1 border-gray-300 text-white px-8 py-15 rounded-3xl mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[#333] text-4xl font-bold mb-2">
              Welcome Back, { name }!
            </h1>
            <p className="text-[#333]/70 text-lg font-semibold">
              Stay informed with the latest orders and memoranda from your
              organization.
            </p>
          </div>
          <ClientTimeDisplay/>
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
        {/* Left Section: Latest Issuances Table */}
        <LatestIssuances data={latestIssuances} />

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
                    <p className="font-bold text-[#008c8b] text-base mb-1">
                      {item.code}
                    </p>
                    <p className="text-sm text-[#848080]">{item.title}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#008c8b]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
