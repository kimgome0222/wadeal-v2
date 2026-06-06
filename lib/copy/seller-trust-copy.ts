import type { SellerBadgeId, SellerProfile } from "@/lib/sellers/types";

/** Customer-facing trust copy — mock 기준, 법적 보증·100% 안전 표현 금지 */
export const SELLER_TRUST_MOCK_DISCLAIMER =
  "표시 정보는 mock·운영 기준이며, 법적 보증이나 거래 안전을 보장하지 않습니다.";

/** Buyer-facing badge labels (softer than seller-center labels) */
export const SELLER_TRUST_BADGE_LABELS: Record<SellerBadgeId, string> = {
  verified: "입점 정보 확인",
  popular: "우수 판매자",
  high_repurchase: "재구매 많음",
  fast_response: "응답률 높음",
  best_seller: "리뷰 우수",
  new_seller: "신규 입점",
};

export const SELLER_TRUST_HINTS = {
  verified: "입점 시 사업자·기본 정보를 확인했어요. (mock)",
  productReview: "상품 등록 전 기본 정보를 검수해요. (mock)",
  fastResponse: "문의 응답률이 높은 편이에요. (mock)",
  highRepurchase: "재구매 고객이 많은 편이에요. (mock)",
} as const;

export function getSellerTrustHints(profile: SellerProfile): string[] {
  const hints: string[] = [];

  if (profile.isVerified || profile.badges.includes("verified")) {
    hints.push(SELLER_TRUST_HINTS.verified);
  }

  hints.push(SELLER_TRUST_HINTS.productReview);

  if (profile.inquiryResponseRate >= 85 || profile.badges.includes("fast_response")) {
    hints.push(SELLER_TRUST_HINTS.fastResponse);
  }

  if (profile.repurchaseRate >= 35 || profile.badges.includes("high_repurchase")) {
    hints.push(SELLER_TRUST_HINTS.highRepurchase);
  }

  return [...new Set(hints)].slice(0, 4);
}

export function formatRepurchaseRate(rate: number): string {
  return `${rate}%`;
}

export function formatInquiryResponseRate(rate: number): string {
  return `${rate}%`;
}
