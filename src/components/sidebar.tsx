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
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

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
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen: isMobileOpen, close: closeMobileSidebar } = useSidebar();
  const pathname = usePathname();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded);

  // Close sidebar when clicking a nav link on mobile
  const handleLinkClick = () => {
    if (isMobile && isMobileOpen) {
      closeMobileSidebar();
    }
  };

  // Determine active link background color based on role
  const activeLinkColor =
    String(role).toLowerCase() === "admin" ? "bg-[#278fb6]" : "bg-[#278fb6]";

  // Desktop expanded state
  const isExpanded = isMobile ? isMobileOpen : isDesktopExpanded;

  return (
    <div className="flex h-screen">
      {/* Backdrop for mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col pt-[73px] z-50
          ${
            isMobile
              ? isMobileOpen
                ? "w-72 translate-x-0 shadow-2xl"
                : "w-72 -translate-x-full"
              : isDesktopExpanded
              ? "w-64"
              : "w-20"
          }
        `}
      >
        {/* Header - hidden on mobile since hamburger handles toggle */}
        {!isMobile && (
          <div
            className={`flex items-center px-4 py-4 border-b border-gray-200 ${
              isDesktopExpanded ? "justify-between" : "justify-center"
            }`}
          >
            {isDesktopExpanded && (
              <h2 className="font-semibold text-base text-gray-900">
                Navigation
              </h2>
            )}
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <PanelLeft size={20} />
            </button>
          </div>
        )}

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
              ? "ml-0" // Full width on mobile — no sidebar space
              : isDesktopExpanded
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
