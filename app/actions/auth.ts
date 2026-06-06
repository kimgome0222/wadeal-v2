"use server";

import { cookies } from "next/headers";

import { PROTOTYPE_SESSION_COOKIE } from "@/lib/auth/prototype-session";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";

const prototypeCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setPrototypeSessionAction() {
  if (!isPrototypeAuthEnabled()) {
    return { success: false as const, error: "disabled" as const };
  }

  const cookieStore = await cookies();
  cookieStore.set(PROTOTYPE_SESSION_COOKIE, "1", prototypeCookieOptions);
  return { success: true as const };
}

export async function clearPrototypeSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(PROTOTYPE_SESSION_COOKIE);
  return { success: true as const };
}
