import { useState, useEffect } from "react";

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function useCurrentTime(updateInterval = 1000) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client side only
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  // Return placeholder values during SSR or before client hydration
  if (!time) {
    return {
      time: null,
      formattedTime: "--:--:-- --",
      formattedDate: "Loading...",
    };
  }

  return {
    time,
    formattedTime: formatTime(time),
    formattedDate: formatDate(time),
  };
}
