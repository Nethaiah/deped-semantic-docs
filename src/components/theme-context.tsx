"use client";

import { createContext, useContext, useMemo } from "react";
import { getThemeForRole, type ThemeColors } from "@/lib/theme-config";

interface ThemeContextValue {
  role: string;
  theme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provides role-based theme to all `(main)` children.
 * Wraps the context around the app so every client component
 * can call `useTheme()` without prop-drilling or extra DB calls.
 */
export function ThemeProvider({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const value = useMemo<ThemeContextValue>(() => {
    return {
      role,
      theme: getThemeForRole(role),
    };
  }, [role]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="contents"
        style={
          {
            "--theme-primary": value.theme.primary,
            "--theme-primary-hover": value.theme.primaryHover,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * Access the current role + theme from any client component
 * inside the (main) layout. Throws if used outside ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
