import { headers } from "next/headers";

import { extractClientIp, hashIpAddress } from "@/lib/share/ip-hash";

export type AdminRequestContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export async function getAdminRequestContext(): Promise<AdminRequestContext> {
  const headerStore = await headers();
  const ip = extractClientIp(headerStore.get("x-forwarded-for"));
  const userAgent = headerStore.get("user-agent");

  return {
    ipHash: hashIpAddress(ip),
    userAgent: userAgent ?? null,
  };
}
