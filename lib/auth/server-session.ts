import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getServerAuthUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export function getAuthDisplayName(user: User): string {
  const metadata = user.user_metadata ?? {};

  if (typeof metadata.full_name === "string" && metadata.full_name) {
    return metadata.full_name;
  }

  if (typeof metadata.name === "string" && metadata.name) {
    return metadata.name;
  }

  if (typeof metadata.nickname === "string" && metadata.nickname) {
    return metadata.nickname;
  }

  if (user.email) {
    return user.email.split("@")[0] ?? "회원";
  }

  return "회원";
}
