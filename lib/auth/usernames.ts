import { normalizeUsername, validateUsername } from "@/lib/auth/credentials";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const mockTakenUsernames = new Set(["wadeal", "testuser", "demo1234"]);

export async function isUsernameAvailable(username: string): Promise<{
  available: boolean;
  error?: "invalid" | "taken" | "check_failed";
}> {
  const validation = validateUsername(username);
  if (!validation.valid) {
    return { available: false, error: "invalid" };
  }

  const normalized = normalizeUsername(username);

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return { available: !mockTakenUsernames.has(normalized) };
    }
    return { available: false, error: "check_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { available: false, error: "check_failed" };
  }

  const { data, error } = await supabase
    .from("profile_usernames")
    .select("username")
    .eq("username", normalized)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[usernames] availability check:", error.message);
    }
    if (shouldUseMockData()) {
      return { available: !mockTakenUsernames.has(normalized) };
    }
    return { available: false, error: "check_failed" };
  }

  return { available: !data };
}

export async function resolveUsernameByUserId(
  userId: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profile_usernames")
    .select("username")
    .eq("user_id", userId)
    .maybeSingle();

  return (data as { username?: string } | null)?.username ?? null;
}

export async function resolveUserIdByUsername(
  username: string,
): Promise<string | null> {
  const validation = validateUsername(username);
  if (!validation.valid) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profile_usernames")
    .select("user_id")
    .eq("username", normalizeUsername(username))
    .maybeSingle();

  return (data as { user_id?: string } | null)?.user_id ?? null;
}

export async function findUsernameByVerifiedIdentity(input: {
  realName: string;
  phone: string;
}): Promise<{ usernames: string[] } | { error: "not_found" | "lookup_failed" }> {
  const realName = input.realName.trim();
  const phoneDigits = input.phone.replace(/\D/g, "");

  if (!realName || phoneDigits.length < 10) {
    return { error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData() && realName === "김가나" && phoneDigits.endsWith("1234")) {
      return { usernames: ["ga*****na"] };
    }
    return { error: "not_found" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "lookup_failed" };
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("id, real_name, phone, phone_verified_at")
    .eq("real_name", realName)
    .not("phone_verified_at", "is", null);

  if (error || !users?.length) {
    return { error: "not_found" };
  }

  const matchedUserIds = (users as Array<{ id: string; phone: string | null }>)
    .filter((row) => (row.phone ?? "").replace(/\D/g, "") === phoneDigits)
    .map((row) => row.id);

  if (!matchedUserIds.length) {
    return { error: "not_found" };
  }

  const { data: usernameRows } = await supabase
    .from("profile_usernames")
    .select("username")
    .in("user_id", matchedUserIds);

  const usernames = ((usernameRows ?? []) as Array<{ username: string }>).map(
    (row) => row.username,
  );

  if (!usernames.length) {
    return { error: "not_found" };
  }

  return { usernames };
}
