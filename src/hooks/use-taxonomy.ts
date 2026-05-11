"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side mirror of {@link "@/server/categories/taxonomy"}.
 *
 * Used by client components (filter dialogs, the upload review form, and
 * the admin "Manage Colleges" UI) to fetch the live colleges/departments
 * tree without prop-drilling.  Reads are cached for the lifetime of the
 * tab via a module-level singleton, so opening the same dialog twice
 * doesn't re-hit Supabase.  Mutations call ``invalidateTaxonomy()`` to
 * force a refresh on the next consumer.
 */

export type ClientDepartment = {
  id: string;
  name: string;
  keywords: string[];
  sort_order: number;
};

export type ClientCollege = {
  code: string;
  full_name: string;
  description: string | null;
  sort_order: number;
  departments: ClientDepartment[];
};

let cache: ClientCollege[] | null = null;
let inflight: Promise<ClientCollege[]> | null = null;
const subscribers = new Set<(data: ClientCollege[]) => void>();

async function fetchTaxonomy(): Promise<ClientCollege[]> {
  const supabase = createClient();

  const [{ data: colleges, error: collegesError }, { data: departments, error: deptError }] =
    await Promise.all([
      supabase
        .from("colleges")
        .select("code, full_name, description, sort_order")
        .order("sort_order", { ascending: true })
        .order("code", { ascending: true }),
      supabase
        .from("departments")
        .select("id, college_code, name, keywords, sort_order")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

  if (collegesError) {
    console.error("Failed to fetch colleges:", collegesError);
    return [];
  }
  if (deptError) {
    console.error("Failed to fetch departments:", deptError);
  }

  const byCollege = new Map<string, ClientDepartment[]>();
  for (const d of departments || []) {
    const list = byCollege.get(d.college_code) || [];
    list.push({
      id: String(d.id),
      name: d.name,
      keywords: Array.isArray(d.keywords) ? d.keywords : [],
      sort_order: typeof d.sort_order === "number" ? d.sort_order : 0,
    });
    byCollege.set(d.college_code, list);
  }

  return (colleges || []).map((c) => ({
    code: c.code,
    full_name: c.full_name,
    description: c.description ?? null,
    sort_order: typeof c.sort_order === "number" ? c.sort_order : 0,
    departments: byCollege.get(c.code) || [],
  }));
}

async function loadTaxonomy(force = false): Promise<ClientCollege[]> {
  if (!force && cache) return cache;
  if (inflight) return inflight;

  inflight = fetchTaxonomy()
    .then((data) => {
      cache = data;
      subscribers.forEach((cb) => cb(data));
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Drop the in-memory cache.  Components subscribed via ``useTaxonomy``
 * will re-fetch on the next render.
 */
export function invalidateTaxonomy() {
  cache = null;
}

export type UseTaxonomyResult = {
  taxonomy: ClientCollege[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/**
 * React hook that returns the current taxonomy plus a ``refresh`` action.
 * Components automatically re-render when other subscribers refresh the
 * cache (e.g., after the admin saves a change).
 */
export function useTaxonomy(): UseTaxonomyResult {
  const [taxonomy, setTaxonomy] = useState<ClientCollege[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const onUpdate = (data: ClientCollege[]) => {
      if (!cancelled) setTaxonomy(data);
    };
    subscribers.add(onUpdate);

    if (cache) {
      setTaxonomy(cache);
      setLoading(false);
    } else {
      loadTaxonomy()
        .then((data) => {
          if (cancelled) return;
          setTaxonomy(data);
          setLoading(false);
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e instanceof Error ? e.message : "Failed to load taxonomy");
          setLoading(false);
        });
    }

    return () => {
      cancelled = true;
      subscribers.delete(onUpdate);
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    invalidateTaxonomy();
    try {
      const data = await loadTaxonomy(true);
      setTaxonomy(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh taxonomy");
    } finally {
      setLoading(false);
    }
  };

  return { taxonomy, loading, error, refresh };
}
