"use client";

import Image from "next/image";

const categories = [
  {
    name: "Policy",
    count: 125,
    icon: "/policy.svg",
  },
  {
    name: "Curriculum",
    count: 125,
    icon: "/curriclum.svg",
  },
  {
    name: "Human Resources",
    count: 125,
    icon: "/human-resource.svg",
  },
  {
    name: "Finance",
    count: 125,
    icon: "/finance.svg",
  },
  {
    name: "School Operations",
    count: 125,
    icon: "/school-operation.svg",
  },
  {
    name: "Policy",
    count: 125,
    icon: "/policy.svg",
  },
];

export default function Categories() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by Categories</h1>
        <p className="text-sm text-gray-600">
          Streamlined document viewing based on specific categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div
            key={`${category.name}-${index}`}
            className="flex items-center gap-4 p-6 shadow-sm bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex-shrink-0">
              <Image
                src={category.icon}
                alt={category.name}
                width={65}
                height={75}
                className="w-16 h-auto"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} Documents</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
