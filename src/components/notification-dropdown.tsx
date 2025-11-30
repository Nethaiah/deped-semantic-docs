"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

// Imports from shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type NotificationWithDocId = {
  id: string;
  memo_number: string;
  title: string;
  url: string;
  created_at: string;
  doc_id: string | null;
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationWithDocId[]>([]);
  const router = useRouter();

  // Helper function to find doc_id for a notification
  const findDocIdForNotification = async (notification: any): Promise<NotificationWithDocId> => {
    if (notification.doc_id) return notification;

    // Strategy 1: Exact match
    let { data: doc } = await supabase
      .from("documents")
      .select("doc_id")
      .eq("doc_number", notification.memo_number)
      .maybeSingle();

    // Strategy 2: Case-insensitive
    if (!doc) {
      const result = await supabase
        .from("documents")
        .select("doc_id")
        .ilike("doc_number", notification.memo_number)
        .maybeSingle();
      doc = result.data;
    }

    // Strategy 3: Source path URL
    if (!doc && notification.url) {
      const result = await supabase
        .from("documents")
        .select("doc_id")
        .eq("source_path", notification.url)
        .maybeSingle();
      doc = result.data;
    }

    // Strategy 4: Partial match
    if (!doc) {
      const result = await supabase
        .from("documents")
        .select("doc_id, doc_number")
        .not("doc_number", "is", null)
        .limit(100);
      
      if (result.data) {
        const matchingDoc = result.data.find((d: any) => {
          const memoLower = notification.memo_number?.toLowerCase() || "";
          const docNumLower = d.doc_number?.toLowerCase() || "";
          return memoLower.includes(docNumLower) || docNumLower.includes(memoLower);
        });
        if (matchingDoc) {
          doc = { doc_id: matchingDoc.doc_id };
        }
      }
    }

    return {
      ...notification,
      doc_id: doc?.doc_id || null,
    };
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    await supabase.from("notifications").delete().eq("id", notificationId);
  };

  const handleNotificationClick = async (notification: NotificationWithDocId) => {
    // Delete the notification
    await deleteNotification(notification.id);

    // Navigate to document view if doc_id exists
    if (notification.doc_id) {
      router.push(`/view/${notification.doc_id}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        const enrichedNotifications = await Promise.all(
          data.map(findDocIdForNotification)
        );
        setNotifications(enrichedNotifications);
      }
    };
    fetchData();

    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        async (payload) => {
          const enrichedNotification = await findDocIdForNotification(payload.new);
          setNotifications((prev) => [enrichedNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 text-white hover:bg-white/10 rounded-full transition cursor-pointer outline-none"
        >
          <Bell className="h-6 w-6" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-transparent"></span>
          )}
        </button>
      </DropdownMenuTrigger>

      {/* 
        Using p-0 to strip default padding so we can use your original layout logic 
        (headers, dividers) exactly as designed.
      */}
      <DropdownMenuContent 
        className="w-96 bg-white p-0 shadow-lg border border-gray-200 z-[1500] overflow-hidden" 
        align="end" 
        sideOffset={8}
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {hasNotifications ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  disabled={!n.doc_id}
                  // Override default shadcn item styles to match your original list design
                  className="w-full block px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 transition-colors cursor-pointer rounded-none outline-none"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {n.memo_number}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                    {n.title}
                  </p>
                  <span className="text-xs text-blue-600 mt-1 block">
                    {n.doc_id ? "View Document" : "Document not found"}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center outline-none focus:outline-none">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                There's no notification yet
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}