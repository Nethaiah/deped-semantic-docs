import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

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
