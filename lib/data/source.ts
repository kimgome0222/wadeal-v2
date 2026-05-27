import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type WadealDataSource = "supabase" | "mock";

let loggedSource: WadealDataSource | null = null;

export function markWadealDataSource(source: WadealDataSource) {
  loggedSource = source;
}

export function getWadealDataSource(): WadealDataSource | null {
  return loggedSource;
}

export function logPageDataSource(page: string, source: WadealDataSource) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const label = source === "supabase" ? "Supabase" : "mock fallback";
  console.log(`[${page}] rendered from ${label}`);
}

export function logWadealDataSource(source: WadealDataSource) {
  logPageDataSource("app", source);
}

export async function probeWadealDataSource(): Promise<WadealDataSource> {
  if (!isSupabaseConfigured()) {
    markWadealDataSource("mock");
    logWadealDataSource("mock");
    return "mock";
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    markWadealDataSource("mock");
    logWadealDataSource("mock");
    return "mock";
  }

  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (error || !count || count === 0) {
    markWadealDataSource("mock");
    logWadealDataSource("mock");
    return "mock";
  }

  markWadealDataSource("supabase");
  logWadealDataSource("supabase");
  return "supabase";
}
