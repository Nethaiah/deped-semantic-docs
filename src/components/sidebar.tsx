"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Search,
  Folder,
  Bookmark,
  Settings,
  MessageCircle,
  PanelLeft,
  Shield,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { title: "Search", icon: Search, path: "/search" },
  { title: "Categories", icon: Folder, path: "/categories" },
  { title: "Bookmark", icon: Bookmark, path: "/bookmarks" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  children?: React.ReactNode;
}

type UserRoleProps = {
  role: String;
}

export default function Sidebar({ children, role }: SidebarProps & UserRoleProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col pt-[73px] ${isExpanded ? "w-64" : "w-20"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {isExpanded && (
            <h2 className="font-semibold text-base text-gray-900">Navigation</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PanelLeft size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {menuItems.map(({ title, icon: Icon, path }) => {
              const isActive = pathname.startsWith(path);
              return (
                <li key={title}>
                  <button
                    onClick={() => router.push(path)}
                    title={!isExpanded ? title : undefined}
                    className={`
                      w-full flex items-center ${isExpanded ? "justify-start" : "justify-center"}
                      gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-[#333DAD] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <span className="text-base font-medium">{title}</span>
                    )}
                  </button>
                </li>
              );
            })}

            {/* Admin Section */}
            {String(role).toLowerCase() === 'admin' && (
              <li className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push("/upload")}
                  className={`
                    w-full flex items-center ${isExpanded ? "justify-start" : "justify-center"}
                    gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-[#333DAD]
                    text-white hover:bg-gray-100
                  `}
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-base font-medium">Admin</span>
                  )}
                </button>
              </li>
            )}
          </ul>
        </nav>

        
      </aside>

      {/* Main Content */}
      {children && (
        <main className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 pt-[73px] h-screen ${isExpanded ? "ml-64" : "ml-20"}`}>
          {children}
        </main>
      )}
    </div>
  );
}
