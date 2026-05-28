import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { PROTOTYPE_USER_ID } from "@/lib/database/types";

export const PROTOTYPE_SESSION_COOKIE = "wadeal_prototype_session";

export function createPrototypeUser(): User {
  return {
    id: PROTOTYPE_USER_ID,
    app_metadata: { provider: "prototype" },
    user_metadata: { name: "김가나", nickname: "김가나" },
    aud: "authenticated",
    created_at: new Date(0).toISOString(),
    email: "prototype@wadeal.local",
  } as User;
}

export async function hasPrototypeSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(PROTOTYPE_SESSION_COOKIE)?.value === "1";
}

export async function getPrototypeUserIfSession(): Promise<User | null> {
  if (await hasPrototypeSession()) {
    return createPrototypeUser();
  }

  return null;
}

export function hasPrototypeSessionFromRequest(
  requestCookies: { get: (name: string) => { value: string } | undefined },
): boolean {
  return requestCookies.get(PROTOTYPE_SESSION_COOKIE)?.value === "1";
}
