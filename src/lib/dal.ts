import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * Cached per-request session verification.
 * No matter how many server components call this in a single render,
 * the DB is only queried ONCE.
 */
export const verifySession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAuth: false, user: null, supabase, error: "Unauthorized" } as const;
  }

  return { isAuth: true, user, supabase, error: null } as const;
});

/**
 * Cached per-request role lookup.
 * Builds on verifySession so both the auth check and role fetch
 * are deduplicated across layout + pages + components in one render.
 *
 * Returns { role, fullName, isAdmin } or null if not authenticated.
 */
export const getCurrentUserRole = cache(async () => {
  const session = await verifySession();
  if (!session.isAuth) return null;

  const { data } = await session.supabase
    .from("users")
    .select("role, full_name, status, is_deactivated")
    .eq("id", session.user.id)
    .single();

  const role = data?.role || "user";
  return {
    role,
    fullName: data?.full_name || session.user.user_metadata?.full_name || "",
    isAdmin: role === "admin",
    status: data?.status || "pending",
    isDeactivated: data?.is_deactivated ?? false,
  };
});
