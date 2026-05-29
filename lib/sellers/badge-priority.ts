import type { SellerBadgeId } from "./types";

/** 카드·레일에서 강조할 배지 우선순위 (인증 → 신규 → 인기 → 빠른 응답). */
export const CARD_BADGE_PRIORITY: SellerBadgeId[] = [
  "verified",
  "new_seller",
  "popular",
  "fast_response",
  "best_seller",
  "high_repurchase",
];

export function pickSellerBadgesForCard(
  badges: SellerBadgeId[],
  limit = 3,
): SellerBadgeId[] {
  const ordered = CARD_BADGE_PRIORITY.filter((id) => badges.includes(id));
  const rest = badges.filter((id) => !ordered.includes(id));

  return [...ordered, ...rest].slice(0, limit);
}
