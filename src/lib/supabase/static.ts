import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for use inside `use cache` functions.
 *
 * This client uses only the public anon key and does NOT access `cookies()`,
 * making it safe to use inside cached scopes. It relies entirely on Supabase
 * Row Level Security (RLS) — the anon key must have SELECT on tables queried
 * by cached functions (e.g. theses, thesis_authors).
 *
 * DO NOT use this client for authenticated mutations or user-specific queries.
 */
export const supabaseStatic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
