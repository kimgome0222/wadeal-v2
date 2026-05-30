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

/** 1~9 → N+, 10+ → comma format, 10000+ → 9,999+ */
export function formatReviewCountLabel(count: number): string {
  if (count <= 0) {
    return "1+";
  }
  if (count <= 9) {
    return `${count}+`;
  }
  return formatReviewCount(count);
}

/** 카드 표시용 — "리뷰 128" */
export function formatReviewCountDisplay(count: number): string {
  return `리뷰 ${formatReviewCountLabel(count)}`;
}

function resolveReviewCount(deal: Deal): number {
  if (deal.participants > 0) {
    return Math.max(1, Math.round(deal.participants / 3));
  }

  const seed = deal.id + deal.slug.length;
  return (seed % 9000) + 1;
}

export function formatSoldCount(count: number): string {
  if (count <= 0) {
    return "판매 1+";
  }
  if (count < 10) {
    return `판매 ${count}+`;
  }
  if (count < 10_000) {
    return `판매 ${count.toLocaleString("ko-KR")}`;
  }
  return "판매 9,999+";
}

function resolveSoldCount(deal: Deal): number {
  const sold = deal.soldQuantity ?? 0;
  if (sold > 0) {
    return sold;
  }
  if (deal.participants > 0) {
    return deal.participants;
  }

  const seed = deal.id + deal.slug.length * 7;
  return (seed % 9000) + 1;
}

export function getProductCardSoldLabel(deal: Deal): string {
  return formatSoldCount(resolveSoldCount(deal));
}

export function getProductCardReviewMeta(deal: Deal): ProductCardReviewMeta {
  const count = resolveReviewCount(deal);
  const score =
    deal.participants > 0 ?
      Math.min(5, 4 + deal.participants / 120).toFixed(1)
    : (4 + (deal.id % 10) / 10).toFixed(1);

  return {
    score,
    countLabel: formatReviewCountLabel(count),
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
