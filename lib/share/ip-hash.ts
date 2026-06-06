import { createHash } from "crypto";

const DEFAULT_SALT = "wadeal-referral-salt";

export function hashIpAddress(ip: string | null | undefined): string | null {
  if (!ip) {
    return null;
  }

  const salt = process.env.REFERRAL_IP_SALT ?? DEFAULT_SALT;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function extractClientIp(
  forwardedFor: string | null | undefined,
): string | null {
  if (!forwardedFor) {
    return null;
  }

  const first = forwardedFor.split(",")[0]?.trim();
  return first || null;
}
