import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logDataQueryFallback } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

export type cellohDataSource = "supabase" | "unconfigured";

let loggedSource: cellohDataSource | null = null;

export function markcellohDataSource(source: cellohDataSource) {
  loggedSource = source;
}

export function getcellohDataSource(): cellohDataSource | null {
  return loggedSource;
}

export function logPageDataSource(page: string, source: cellohDataSource) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const label = source === "supabase" ? "Supabase" : "unconfigured";
  console.log(`[${page}] rendered from ${label}`);
}

export function logcellohDataSource(source: cellohDataSource) {
  logPageDataSource("app", source);
}

function logUnconfiguredFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[data] ${context} — using unconfigured fallback`);
  }
}

export async function probecellohDataSource(): Promise<cellohDataSource> {
  if (!isSupabaseConfigured()) {
    logUnconfiguredFallback("Supabase env vars are missing");
    markcellohDataSource("unconfigured");
    logcellohDataSource("unconfigured");
    return "unconfigured";
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logUnconfiguredFallback("failed to create Supabase client");
    markcellohDataSource("unconfigured");
    logcellohDataSource("unconfigured");
    return "unconfigured";
  }

  const { error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS);

  if (error) {
    logDataQueryFallback("products probe fallback", error.message);
  }

  markcellohDataSource("supabase");
  logcellohDataSource("supabase");
  return "supabase";
}
