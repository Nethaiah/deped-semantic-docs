/**
 * Centralized role-based theme configuration
 * ─────────────────────────────────────────────
 * Single source of truth for all role-based colors.
 *
 * Admin  → teal  #008c8b
 * User   → blue  #278fb6
 */

export type Role = "admin" | "user";

export interface ThemeColors {
  /** Main brand colour (hex) — use in inline `style` */
  primary: string;
  /** Slightly darker variant for hover states */
  primaryHover: string;
  /** Tailwind-safe arbitrary-value class: bg-[#…] */
  primaryBgClass: string;
  /** Tailwind-safe arbitrary-value class: hover:bg-[#…] */
  primaryHoverBgClass: string;
  /** Tailwind-safe arbitrary-value class: text-[#…] */
  primaryTextClass: string;
  /** Base neutral palette name */
  baseColor: "gray" | "slate";
}

export const roleThemes: Record<Role, ThemeColors> = {
  admin: {
    primary: "#008c8b",
    primaryHover: "#007a78",
    primaryBgClass: "bg-[#008c8b]",
    primaryHoverBgClass: "hover:bg-[#007a78]",
    primaryTextClass: "text-[#008c8b]",
    baseColor: "gray",
  },
  user: {
    primary: "#278fb6",
    primaryHover: "#1f7a9e",
    primaryBgClass: "bg-[#278fb6]",
    primaryHoverBgClass: "hover:bg-[#1f7a9e]",
    primaryTextClass: "text-[#278fb6]",
    baseColor: "slate",
  },
};

/**
 * Get theme colors for a given role.
 * Defaults to user theme if role is not recognized.
 */
export function getThemeForRole(role: string): ThemeColors {
  if (role === "admin") {
    return roleThemes.admin;
  }
  return roleThemes.user;
}
