"use client";

import { ArrowRight } from "lucide-react";
import { useCurrentTime } from "@/lib/time-utils";
import Link from "next/link";
import { recentlyViewed } from "@/lib/mock-data";

// TODO: Replace this with actual data from your API/database
// Expected data structure for Latest Issuances:
interface LatestIssuance {
  id: string | number;
  createdDate: string; // Format: "Aug 9, 2023" or any date format
  title: string;
  tags: Array<{
    label: string;
    type: "orange" | "teal" | "blue" | "purple" | "red"; // Add more types as needed
  }>;
  issuer: string;
}

// MOCK DATA - Replace with API call or props
const latestIssuances: LatestIssuance[] = [
  {
    id: 1,
    createdDate: "Aug 9, 2023",
    title: "DM-CI-2024-012 DepEd Policies on Remote Learning",
    tags: [
      { label: "Tag 1", type: "orange" },
      { label: "Tag 2", type: "teal" },
    ],
    issuer: "Newest Correspondent",
  },
  {
    id: 2,
    createdDate: "Mar 25, 2023",
    title: "DM-CI-2024-001 DepEd Guidelines on the Use of AI in Education",
    tags: [
      { label: "Tag 2", type: "teal" },
      { label: "Tag 4", type: "purple" },
    ],
    issuer: "Test Correspondent 1",
  },
  {
    id: 3,
    createdDate: "Mar 25, 2023",
    title: "DM-CI-2024-001 DepEd Guidelines on the Use of AI in Education",
    tags: [
      { label: "Tag 2", type: "teal" },
      { label: "Tag 4", type: "red" },
    ],
    issuer: "Test Correspondent 1",
  },
  {
    id: 4,
    createdDate: "Mar 25, 2023",
    title: "DM-CI-2024-001 DepEd Guidelines on the Use of AI in Education",
    tags: [
      { label: "Tag 2", type: "teal" },
      { label: "Tag 4", type: "purple" },
      { label: "Tag 4", type: "purple" },
      { label: "Tag 4", type: "purple" },
    ],
    issuer: "Test Correspondent 1",
  },

  {
    id: 5,
    createdDate: "Mar 25, 2023",
    title: "DM-CI-2024-001 DepEd Guidelines on the Use of AI in Education",
    tags: [
      { label: "Tag 2", type: "teal" },
      { label: "Tag 4", type: "purple" },
    ],
    issuer: "Test Correspondent 1",
  },
];

// Helper function to get tag styling based on type
const getTagClassName = (type: string): string => {
  const tagStyles: Record<string, string> = {
    orange: "bg-orange-100 text-orange-700",
    teal: "bg-teal-100 text-teal-700",
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-600 text-white",
    red: "bg-red-100 text-red-700",
  };
  return tagStyles[type] || "bg-gray-100 text-gray-700";
};

export default function UserDocuments() {
  const { formattedTime, formattedDate } = useCurrentTime();

  // TODO: Fetch latest issuances from your API
  // Example:
  // const [latestIssuances, setLatestIssuances] = useState<LatestIssuance[]>([]);
  // useEffect(() => {
  //   fetch('/api/latest-issuances')
  //     .then(res => res.json())
  //     .then(data => setLatestIssuances(data));
  // }, []);

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
              {/* 
                TODO: BACKEND DEVELOPERS - Map through your data here
                Replace latestIssuances with your API response
                
                Expected data structure:
                {
                  id: number | string,
                  createdDate: string,
                  title: string,
                  tags: [{ label: string, type: string }],
                  issuer: string
                }
              */}
              {latestIssuances.map((issuance, index) => (
                <tr
                  key={issuance.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    index !== latestIssuances.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Created Date Column */}
                  <td className="py-4 px-4 text-md text-gray-600">
                    {issuance.createdDate}
                  </td>

                  {/* Title Column */}
                  <td className="py-4 px-4 text-md text-gray-900 max-w-[250px]">
                    <div
                      className="truncate  "
                      title={issuance.title} // Tooltip fallback for extra UX
                    >
                      {issuance.title}
                    </div>
                  </td>

                  {/* Tags Column */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {issuance.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium ${getTagClassName(
                            tag.type
                          )}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                      {issuance.tags.length > 2 && (
                        <span
                          className="text-xs text-gray-500 font-semibold cursor-default"
                          title={issuance.tags
                            .slice(2)
                            .map((t) => t.label)
                            .join(", ")} // Show hidden tags on hover
                        >
                          +{issuance.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Issuer Column - Currently using input, consider changing to plain text */}
                  <td className="py-4 px-4 text-md text-gray-600">
                    {/* TODO: If issuer should be editable, keep input and add onChange handler */}
                    {/* If not editable, replace with: {issuance.issuer} */}
                    <input
                      type="text"
                      defaultValue={issuance.issuer}
                      placeholder="Enter issuer name"
                      className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
                      // TODO: Add onChange handler if this should be editable
                      // onChange={(e) => handleIssuerChange(issuance.id, e.target.value)}
                    />
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
            {/* TODO: Replace recentlyViewed with API data */}
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
