"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Helper function to find doc_id for a notification by matching memo_number with doc_number
  const findDocIdForNotification = async (notification: any): Promise<NotificationWithDocId> => {
    // If doc_id already exists in notification, use it
    if (notification.doc_id) {
      return notification;
    }

    // Strategy 1: Try exact match on doc_number = memo_number
    let { data: doc } = await supabase
      .from("documents")
      .select("doc_id")
      .eq("doc_number", notification.memo_number)
      .maybeSingle();

    // Strategy 2: If not found, try case-insensitive match using ilike
    if (!doc) {
      const result = await supabase
        .from("documents")
        .select("doc_id")
        .ilike("doc_number", notification.memo_number)
        .maybeSingle();
      doc = result.data;
    }

    // Strategy 3: If still not found and url exists, try matching by source_path
    if (!doc && notification.url) {
      const result = await supabase
        .from("documents")
        .select("doc_id")
        .eq("source_path", notification.url)
        .maybeSingle();
      doc = result.data;
    }

    // Strategy 4: Try partial match - memo_number contains doc_number or vice versa
    if (!doc) {
      const result = await supabase
        .from("documents")
        .select("doc_id, doc_number")
        .not("doc_number", "is", null)
        .limit(100);
      
      if (result.data) {
        // Find a document where memo_number contains doc_number or doc_number contains memo_number
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

    // Log for debugging
    if (!doc) {
      console.log("Could not find document for notification:", {
        memo_number: notification.memo_number,
        url: notification.url,
      });
    } else {
      console.log("Found document:", doc.doc_id, "for memo:", notification.memo_number);
    }

    return {
      ...notification,
      doc_id: doc?.doc_id || null,
    };
  };

  // Delete notification from database and local state
  const deleteNotification = async (notificationId: string) => {
    // Remove from local state immediately for responsiveness
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    // Delete from database
    await supabase.from("notifications").delete().eq("id", notificationId);
  };

  // Handle notification click - navigate to document view and remove notification
  const handleNotificationClick = async (notification: NotificationWithDocId) => {
    setIsOpen(false);

    // Delete the notification
    await deleteNotification(notification.id);

    // Navigate to document view if doc_id exists
    if (notification.doc_id) {
      router.push(`/view/${notification.doc_id}`);
    }
  };

  // Fetch notifications initially
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        // Enrich notifications with doc_id by joining with documents table
        const enrichedNotifications = await Promise.all(
          data.map(findDocIdForNotification)
        );
        setNotifications(enrichedNotifications);
      }
    };
    fetchData();

    // Realtime subscription for new notifications
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition cursor-pointer"
      >
        <Bell className="h-6 w-6" />
        {hasNotifications && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {hasNotifications ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    disabled={!n.doc_id}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {n.memo_number}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.title}</p>
                    <span className="text-xs text-blue-600 mt-1 block">
                      {n.doc_id ? "View Document" : "Document not found"}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  There's no notification yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
