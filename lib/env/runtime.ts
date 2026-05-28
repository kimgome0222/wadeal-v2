import { isSupabaseConfigured } from "@/lib/supabase/config";

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Dev-only mock/demo data. Never true in production builds. */
export function shouldUseMockData(): boolean {
  if (isProductionRuntime()) {
    return false;
  }

  if (process.env.NEXT_PUBLIC_ALLOW_MOCK_DATA === "true") {
    return true;
  }

  return !isSupabaseConfigured();
}

export function isPrototypeAuthEnabled(): boolean {
  if (!isProductionRuntime()) {
    return true;
  }

  return process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === "true";
}
