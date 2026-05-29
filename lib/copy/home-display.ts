import { normalizeDisplayCopy } from "@/lib/copy/display-copy";

/** Maps legacy group-buy home copy to celloh shopping copy (display only). */
export function normalizeHomeDisplayTitle(title: string): string {
  return normalizeDisplayCopy(title);
}

export function normalizeHomeBadgeLabel(badge: string): string {
  const normalized = normalizeDisplayCopy(badge);

  if (normalized === "마감임박" || normalized === "오늘 마감") {
    return "인기";
  }

  return normalized || badge;
}
