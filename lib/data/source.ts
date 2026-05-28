import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

export type WadealDataSource = "supabase" | "unconfigured";

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

  const label = source === "supabase" ? "Supabase" : "unconfigured";
  console.log(`[${page}] rendered from ${label}`);
}

export function logWadealDataSource(source: WadealDataSource) {
  logPageDataSource("app", source);
}

export async function probeWadealDataSource(): Promise<WadealDataSource> {
  if (!isSupabaseConfigured()) {
    console.error("[data] Supabase env vars are missing");
    markWadealDataSource("unconfigured");
    logWadealDataSource("unconfigured");
    return "unconfigured";
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[data] failed to create Supabase client");
    markWadealDataSource("unconfigured");
    logWadealDataSource("unconfigured");
    return "unconfigured";
  }

  const { error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);

  if (error) {
    console.error("[data] products probe:", error.message);
  }

  markWadealDataSource("supabase");
  logWadealDataSource("supabase");
  return "supabase";
}
