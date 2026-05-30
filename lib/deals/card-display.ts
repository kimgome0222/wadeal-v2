import type { Deal } from "@/lib/deals";

/** 상품 카드 → 상세 페이지 경로 (`/product/[id]` 라우트, id·slug 모두 조회 가능) */
export function getProductDetailHref(deal: Pick<Deal, "id" | "slug">): string {
  if (deal.id > 0) {
    return `/product/${deal.id}`;
  }

  return `/product/${deal.slug}`;
}

export function getDealPurchaseCountLabel(deal: Deal): string {
  const sold = deal.soldQuantity ?? 0;
  const count = Math.max(deal.participants, sold);
  return `${count.toLocaleString("ko-KR")}건 구매`;
}

/** @deprecated 카드 UI는 {@link getDealPurchaseCountLabel} 사용 */
export function getDealTodayParticipantLabel(deal: Deal): string {
  return getDealPurchaseCountLabel(deal);
}

export function getDealReviewScoreLabel(deal: Deal): { score: string; count: number } {
  const count = Math.max(1, Math.round(deal.participants / 3));
  const score = Math.min(5, 4 + deal.participants / 120).toFixed(1);
  return { score, count };
}

/** 상품카드용 평점 — 데이터 없으면 null */
export function getDealCardRating(deal: Deal): { score: string; count: number } | null {
  if (deal.participants <= 0) {
    return null;
  }

  const { score, count } = getDealReviewScoreLabel(deal);
  if (count <= 0) {
    return null;
  }

  return { score, count };
}

export function getDealRemainingLabel(deal: Deal): string | null {
  const remaining = Math.max(0, deal.targetParticipants - deal.participants);
  if (remaining <= 0) {
    return null;
  }

  return "판매 중";
}
