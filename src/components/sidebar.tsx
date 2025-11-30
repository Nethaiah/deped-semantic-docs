"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Search,
  Folder,
  Bookmark,
  Settings,
  PanelLeft,
  Upload,
  FileText,
  X,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { title: "Search", icon: Search, path: "/search" },
  { title: "Categories", icon: Folder, path: "/categories" },
  { title: "Bookmark", icon: Bookmark, path: "/bookmarks" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const adminMenuItems = [
  { title: "Manage Documents", icon: FileText, path: "/manage-document" },
  { title: "Upload", icon: Upload, path: "/upload" },
];

interface SidebarProps {
  children?: React.ReactNode;
}

type UserRoleProps = {
  role: string;
};

export default function Sidebar({
  children,
  role,
}: SidebarProps & UserRoleProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Auto-collapse on small/medium screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  // Close sidebar when clicking on a link on mobile
  const handleLinkClick = () => {
    if (isMobile && isExpanded) {
      setIsExpanded(false);
    }
  };

  // Determine active link background color based on role
  const activeLinkColor =
    String(role).toLowerCase() === "admin" ? "bg-[#278fb6]" : "bg-[#278fb6]";

  return (
    <div className="flex h-screen">
      {/* Backdrop for mobile */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 pt-[73px]"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col pt-[73px] z-50
          ${
            isMobile
              ? isExpanded
                ? "w-64"
                : "w-20"
              : isExpanded
              ? "w-64"
              : "w-20"
          }
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center px-4 py-4 border-b border-gray-200 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <h2 className="font-semibold text-base text-gray-900">
              Navigation
            </h2>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {isMobile && isExpanded ? <X size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(({ title, icon: Icon, path }) => {
              const isActive = pathname.startsWith(path);
              return (
                <li key={title}>
                  <Link
                    href={path}
                    onClick={handleLinkClick}
                    title={!isExpanded ? title : undefined}
                    className={`
                      w-full flex items-center ${
                        isExpanded ? "justify-start" : "justify-center"
                      }
                      gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? `${activeLinkColor} text-white shadow-md`
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <span className="text-base font-medium whitespace-nowrap">
                        {title}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Admin Section */}
            {String(role).toLowerCase() === "admin" && (
              <li className="pt-4 border-t border-gray-200 mt-4">
                {isExpanded && (
                  <p className="px-4 pb-3 font-semibold text-[#333]/70 text-sm">
                    Administration
                  </p>
                )}

                <ul className="space-y-2">
                  {adminMenuItems.map(({ title, icon: Icon, path }) => {
                    const isActive = pathname.startsWith(path);
                    return (
                      <li key={title}>
                        <Link
                          href={path}
                          onClick={handleLinkClick}
                          title={!isExpanded ? title : undefined}
                          className={`
                            w-full flex items-center ${
                              isExpanded ? "justify-start" : "justify-center"
                            }
                            gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${
                              isActive
                                ? `${activeLinkColor} text-white shadow-md`
                                : "text-gray-700 hover:bg-gray-100"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {isExpanded && (
                            <span className="text-base font-medium whitespace-nowrap">
                              {title}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      {children && (
        <main
          className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 pt-[73px] h-screen ${
            isMobile
              ? "ml-20" // Always keep space for collapsed sidebar on mobile
              : isExpanded
              ? "ml-64"
              : "ml-20"
          }`}
        >
          {children}
        </main>
      )}
    </div>
  );
}
