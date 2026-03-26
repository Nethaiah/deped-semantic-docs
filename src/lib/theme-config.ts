/**
 * Role-based theme configuration for the dashboard
 * Provides centralized color schemes for admin and user roles
 */

export type Role = "admin" | "user";

export interface ThemeColors {
  primary: string;
  baseColor: "gray" | "slate";
}

export const roleThemes: Record<Role, ThemeColors> = {
  admin: {
    primary: "#008c8b",
    baseColor: "gray",
  },
  user: {
    primary: "#087830",
    baseColor: "slate",
  },
};

/**
 * Get theme colors for a given role
 * Defaults to user theme if role is not recognized
 */
export function getThemeForRole(role: string): ThemeColors {
  if (role === "admin") {
    return roleThemes.admin;
  }
  return roleThemes.user;
}
