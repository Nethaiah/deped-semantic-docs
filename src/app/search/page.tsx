"use client";

import { Search as SearchIcon, Funnel } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const issuances = [
    {
      id: 1,
      code: "DO 022, s. 2023",
      status: "NEW",
      title: "Implementing Guidelines on the School Calendar",
      category: "Policy",
      time: "2 hours ago",
    },
    {
      id: 2,
      code: "DO 022, s. 2023",
      status: "URGENT",
      title: "Implementing Guidelines on the School Calendar",
      category: "Policy",
      time: "2 hours ago",
    },
    {
      id: 3,
      code: "DO 022, s. 2023",
      status: "UPDATED",
      title: "Implementing Guidelines on the School Calendar",
      category: "Policy",
      time: "2 hours ago",
    },
    {
      id: 4,
      code: "DO 022, s. 2023",
      status: "NEW",
      title: "Implementing Guidelines on the School Calendar",
      category: "Policy",
      time: "2 hours ago",
    },
  ];

  return (
    <>
      <Sidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Search</h1>
            <p className="text-sm text-gray-600">
              Comprehensive retrieval of DepEd memoranda and policies.
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

          {/* Latest Issuances Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Latest Issuances</h2>
                <p className="text-sm text-gray-600">
                  Timely access to recently released DepEd policies and orders.
                </p>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {issuances.map((doc) => (
								<div
									key={doc.id}
									className="p-4 rounded-xl bg-[#F5FBFF] border-l-4 border-indigo-500 hover:shadow-md transition-shadow cursor-pointer"
								>
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
            	))}
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
