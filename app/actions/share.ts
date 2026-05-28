"use server";

import { headers } from "next/headers";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import {
  extractClientIp,
  hashIpAddress,
  logReferralVisit,
  logShare,
  type ShareChannel,
} from "@/lib/share";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function ensureProfile(user: NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await syncAuthUserToPublicProfile(user, supabase);
}

export async function logShareAction(input: {
  productSlug: string;
  channel: ShareChannel;
  referralCode?: string | null;
}) {
  const user = await getServerAuthUser();
  if (user) {
    await ensureProfile(user);
  }

  return logShare({
    productSlug: input.productSlug,
    channel: input.channel,
    userId: user?.id ?? null,
    referralCode: input.referralCode ?? null,
  });
}

export async function trackReferralVisitAction(input: {
  referralCode: string;
  productSlug: string;
}) {
  const headerStore = await headers();
  const user = await getServerAuthUser();
  const ip = extractClientIp(headerStore.get("x-forwarded-for"));
  const userAgent = headerStore.get("user-agent");

  return logReferralVisit({
    referralCode: input.referralCode,
    productSlug: input.productSlug,
    visitorUserId: user?.id ?? null,
    ipHash: hashIpAddress(ip),
    userAgent,
  });
}
