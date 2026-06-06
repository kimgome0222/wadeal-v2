import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Dev-only allowlist. Production admins must have users.role = 'admin'. */
export const ADMIN_USER_IDS = isPrototypeAuthEnabled()
  ? ([PROTOTYPE_USER_ID] as const)
  : ([] as const);

export type AdminAccessIdentity = {
  id: string;
  email: string | null;
};

export function getAdminAccessIdentity(user: User | null): AdminAccessIdentity | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

function isAdminUserByAllowlist(user: User | null): boolean {
  const identity = getAdminAccessIdentity(user);
  if (!identity) {
    return false;
  }

  return (ADMIN_USER_IDS as readonly string[]).includes(identity.id);
}

export async function isAdminUserId(
  supabase: SupabaseClient<Database> | null,
  userId: string | null,
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  if ((ADMIN_USER_IDS as readonly string[]).includes(userId)) {
    return true;
  }

  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[auth] isAdminUserId:", error.message);
    return false;
  }

  return (data as { role?: string } | null)?.role === "admin";
}

export async function isAdminUser(user: User | null): Promise<boolean> {
  if (isAdminUserByAllowlist(user)) {
    return true;
  }

  if (!user || !isSupabaseConfigured()) {
    return false;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  return isAdminUserId(supabase, user.id);
}
