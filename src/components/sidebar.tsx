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
  Users,
  Archive,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { useTheme } from "./theme-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { title: "Search", icon: Search, path: "/search" },
  { title: "Categories", icon: Folder, path: "/categories" },
  { title: "Bookmark", icon: Bookmark, path: "/bookmarks" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const adminMenuItems = [
  { title: "User Management", icon: Users, path: "/user-management" },
  { title: "Upload", icon: Upload, path: "/upload" },
  { title: "Archive", icon: Archive, path: "/archive" },
];

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen: isMobileOpen, close: closeMobileSidebar } = useSidebar();
  const { role, theme } = useTheme();
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

  const isAdmin = String(role).toLowerCase() === "admin";

  // Desktop expanded state
  const isExpanded = isMobile ? isMobileOpen : isDesktopExpanded;

  return (
    <TooltipProvider delayDuration={300}>
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
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col pt-[65px] z-50
          ${
            isMobile
              ? isMobileOpen
                ? "w-72 translate-x-0 shadow-2xl"
                : "w-72 -translate-x-full"
              : isDesktopExpanded
              ? "w-64"
              : "w-16"
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
              <h2 className="font-semibold text-sm text-gray-900">
                Navigation
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDesktopSidebar}
              className="h-9 w-9 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <PanelLeft size={20} />
            </Button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(({ title, icon: Icon, path }) => {
              const isActive = pathname.startsWith(path);
              const linkContent = (
                <Link
                  href={path}
                  onClick={handleLinkClick}
                  className={`
                    w-full flex items-center ${
                      isExpanded ? "justify-start" : "justify-center"
                    }
                    gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? `${theme.primaryBgClass} text-white shadow-md`
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {title}
                    </span>
                  )}
                </Link>
              );

              return (
                <li key={title}>
                  {isExpanded ? (
                    linkContent
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={16}>
                        {title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
              );
            })}

            {/* Admin Section */}
            {isAdmin && (
              <li className="pt-4 mt-4">
                <Separator className="mb-4" />
                {isExpanded && (
                  <p className="px-4 pb-3 font-semibold text-[#333]/70 text-sm">
                    Administration
                  </p>
                )}

                <ul className="space-y-2">
                  {adminMenuItems.map(({ title, icon: Icon, path }) => {
                    const isActive = pathname.startsWith(path);
                    const linkContent = (
                      <Link
                        href={path}
                        onClick={handleLinkClick}
                        className={`
                          w-full flex items-center ${
                            isExpanded ? "justify-start" : "justify-center"
                          }
                          gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? `${theme.primaryBgClass} text-white shadow-md`
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                        {isExpanded && (
                          <span className="text-sm font-medium whitespace-nowrap">
                            {title}
                          </span>
                        )}
                      </Link>
                    );

                    return (
                      <li key={title}>
                        {isExpanded ? (
                          linkContent
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={16}>
                              {title}
                            </TooltipContent>
                          </Tooltip>
                        )}
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
          className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 pt-[65px] h-screen ${
            isMobile
              ? "ml-0" // Full width on mobile — no sidebar space
              : isDesktopExpanded
              ? "ml-64"
              : "ml-16"
          }`}
        >
          {children}
        </main>
      )}
      </div>
    </TooltipProvider>
  );
}
