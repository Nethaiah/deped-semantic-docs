"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications initially
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setNotifications(data || []);
    };
    fetchData();

    // Realtime subscription for new notifications
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
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
                {notifications.map((n, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">
                      {n.memo_number}
                    </p>
                    <p className="text-xs text-gray-500">{n.title}</p>
                    <a
                      href={n.url}
                      target="_blank"
                      className="text-xs text-blue-600 mt-1 block"
                      rel="noopener noreferrer"
                    >
                      View Memo
                    </a>
                  </div>
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
