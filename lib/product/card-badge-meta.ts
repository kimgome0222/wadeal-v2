import type { Deal } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";

/** 관리자/mock optional 카드 배지 — DB schema 변경 없음 */
export type ProductCardBadgeMeta = {
  badgeLabel: string;
  variant: "primary" | "coupon";
  urgencyLabel?: string;
  couponText?: string;
};

export type ProductCardReviewMeta = {
  score: string;
  countLabel: string;
};

const BADGE_PRESETS = [
  "특가세일",
  "추천상품",
  "마감세일",
  "주말특가",
  "ONLY CELLOH",
] as const;

export function formatReviewCount(count: number): string {
  if (count >= 10_000) {
    return "9,999+";
  }
  return count.toLocaleString("ko-KR");
}

export function getProductCardReviewMeta(deal: Deal): ProductCardReviewMeta | null {
  if (deal.participants <= 0) {
    return null;
  }

  const { score, count } = getDealReviewScoreLabel(deal);
  return {
    score,
    countLabel: formatReviewCount(count),
  };
}

/** slug/id 기반 mock badge — badgeLabel 없으면 null */
export function resolveProductCardBadgeMeta(deal: Deal): ProductCardBadgeMeta | null {
  const seed = deal.id + deal.slug.length;

  if (deal.badge?.includes("ONLY") || seed % 11 === 0) {
    return {
      badgeLabel: "ONLY CELLOH",
      variant: "primary",
      couponText: seed % 2 === 0 ? "20% 쿠폰" : undefined,
    };
  }

  if (deal.endsInMinutes > 0 && deal.endsInMinutes <= 360) {
    const hours = Math.floor(deal.endsInMinutes / 60);
    const mins = deal.endsInMinutes % 60;
    return {
      badgeLabel: "마감세일",
      variant: "primary",
      urgencyLabel: `마감 ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`,
    };
  }

  if (seed % 5 === 0) {
    return {
      badgeLabel: "주말특가",
      variant: "primary",
      urgencyLabel: "주말특가 오늘까지",
    };
  }

  if (seed % 4 === 0) {
    return {
      badgeLabel: BADGE_PRESETS[seed % BADGE_PRESETS.length] ?? "특가세일",
      variant: "primary",
    };
  }

  if (seed % 3 === 0) {
    return {
      badgeLabel: seed % 2 === 0 ? "10% 쿠폰" : "쿠폰 3,000원",
      variant: "coupon",
      couponText: seed % 2 === 0 ? "20% 쿠폰" : "쿠폰 3,000원",
    };
  }

  return null;
}

export function isOnlyCellohDeal(deal: Deal): boolean {
  const meta = resolveProductCardBadgeMeta(deal);
  return meta?.badgeLabel === "ONLY CELLOH" || deal.badge?.includes("ONLY") === true;
}
