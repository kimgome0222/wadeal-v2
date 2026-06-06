import type { User } from "@supabase/supabase-js";

import { getAuthProviderLabel } from "@/lib/auth/user-display";

export function isSocialAuthUser(user: User): boolean {
  const provider = getAuthProviderLabel(user);
  return provider === "카카오" || provider === "데모";
}
