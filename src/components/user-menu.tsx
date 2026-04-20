"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOutIcon, SettingsIcon, Bell, Info, Loader2, X, ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { markNotificationsAsRead } from "@/server/auth/mark-notifications-read";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type NotificationRecord = {
  id: string;
  target_role: string;
  type: string;
  title: string;
  message: string;
  link: string;
  created_at: string;
};

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const supabase = createClient();
  const router = useRouter();

  // Menu State
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "notifications">("menu");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<Date>(new Date("2000-01-01"));
  const [role, setRole] = useState<string>("user");
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  async function handleSignOut() {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Logout failed");
        setIsLoggingOut(false);
      } else {
        toast.success("Logged out successfully");
        window.location.href = "/login";
      }
    } catch (error) {
      toast.error("Logout failed");
      setIsLoggingOut(false);
    }
  }

  // Effect: Fetch and Subscribe to Notifications
  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel>;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("role, notifications_last_read_at")
        .eq("id", user.id)
        .single();

      const userRole = userData?.role || "user";
      setRole(userRole);

      if (userData?.notifications_last_read_at) {
        setLastReadTimestamp(new Date(userData.notifications_last_read_at));
      }

      // Fetch last 20 notifications targeted to this role or 'all'
      const { data: initialNotifs } = await supabase
        .from("notifications")
        .select("*")
        .in("target_role", [userRole, "all"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (initialNotifs) {
        setNotifications(initialNotifs as NotificationRecord[]);
      }
      setLoadingNotifs(false);

      // Subscribe to real-time inserts
      subscription = supabase
        .channel("public:notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const newNotif = payload.new as NotificationRecord;
            if (newNotif.target_role === userRole || newNotif.target_role === "all") {
              setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
            }
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [supabase]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => new Date(n.created_at) > lastReadTimestamp).length;
  }, [notifications, lastReadTimestamp]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Dropdown Open Change
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset view to main menu when closing
      timeoutRef.current = setTimeout(() => setView("menu"), 300);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Ensure the menu view always defaults to "menu" when opened via the Avatar trigger
      setView("menu");
    }
  }, []);

  const openNotifications = async (e: React.MouseEvent) => {
    e.preventDefault();
    setView("notifications");
    
    if (unreadCount > 0) {
      await markNotificationsAsRead();
      setLastReadTimestamp(new Date());
    }
  };

  const handleNotificationClick = (link: string | null) => {
    handleOpenChange(false);
    if (link) {
      router.push(link);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Notification Bell Trigger */}
        <button
          onClick={(e) => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            setIsOpen(true);
            openNotifications(e as any);
          }}
          className="relative flex items-center justify-center p-2 rounded-full hover:bg-slate-100/80 transition-colors focus:outline-none cursor-pointer text-white hover:text-slate-900"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-auto p-0 hover:bg-transparent cursor-pointer rounded-full"
            >
              <Avatar className="size-10 border border-slate-200 transition-transform hover:scale-105 duration-200">
                {image && <AvatarImage src={image} alt={name || ""} />}
                <AvatarFallback className="text-md bg-gray-100 text-gray-800">
                  {(name || email || "User")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-0 z-[1500] max-h-[500px] flex flex-col overflow-hidden"
          align="end"
          sideOffset={8}
        >
          {view === "menu" ? (
            <div className="py-2 px-1">
              <DropdownMenuLabel className="flex min-w-0 flex-col px-3 py-2">
                <span className="text-foreground truncate text-sm font-medium">
                  {name || email || "User"}
                </span>
                <span className="text-muted-foreground truncate text-sm font-normal">
                  {email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer px-3 py-2.5">
                    <SettingsIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Notifications Menu Item */}
                
              </DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="text-red-600 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white group cursor-pointer px-3 py-2.5"
              >
                <LogOutIcon size={16} className="opacity-60 mr-2 group-hover:opacity-100" aria-hidden="true" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white">
              <div className="flex items-center justify-between border-b px-4 py-3 sticky top-0 bg-white z-10">
                <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)} className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-y-auto max-h-[350px]">
                {loadingNotifs ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    <p className="text-xs">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs opacity-70">No new notifications here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => {
                      const isUnread = new Date(notif.created_at) > lastReadTimestamp;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.link)}
                          className={`flex items-start gap-3 border-b p-4 cursor-pointer transition-colors duration-150 ${
                            isUnread ? "bg-blue-50/40" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 bg-blue-100 text-blue-700 rounded-full p-1.5">
                            <Info className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 space-y-1 w-full overflow-hidden">
                            <p className="text-sm font-medium leading-tight truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium pt-1">
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" autoFocus>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
