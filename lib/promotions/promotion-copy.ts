/** 홈·컬렉션 프로모션 노출 문구 — mock 기준, 법무 검토 전 과장 표현 금지 */

export const PROMOTION_HOME_SUBTITLES = {
  "today-special": "오늘 하루만 이 가격 (mock)",
  "ending-sale": "오늘 밤 11:59까지",
  "weekend-special": "이번 주말 한정",
  "coupon-sale": "쿠폰 적용가로 더 저렴하게",
  lowest: "최근 7일 기준 최저가 mock · 실제 최저가 보장 아님",
  "only-celloh": "celloh에서만 만나는 구성",
  "celloh-coupon": "셀로쿠폰 적용 상품 모음",
  repurchase: "재구매율 mock 기준 · 추천 참고용",
  "new-sellers": "신규 입점 판매자 기획전",
  live: "라이브커머스 준비 중",
} as const;

export type PromotionCopySlug = keyof typeof PROMOTION_HOME_SUBTITLES;

export const PROMOTION_COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "today-special":
    "오늘 하루 특별 가격으로 만나는 상품이에요. (mock · 운영 일정에 따라 변경될 수 있어요)",
  "ending-sale":
    "오늘 밤 11:59까지 마감되는 특가 상품이에요. (mock · 실제 마감 시각은 운영 설정에 따릅니다)",
  "weekend-special":
    "이번 주말 한정으로 열리는 특가 상품이에요. (mock · 토·일 운영 가정)",
  "coupon-sale":
    "쿠폰 적용가로 더 저렴하게 구매할 수 있는 상품이에요. (mock 쿠폰가 표시)",
  "only-celloh":
    "celloh에서만 만나는 구성과 혜택을 담은 상품이에요. (mock · 단독 구성 안내)",
  "celloh-coupon":
    "셀로쿠폰을 적용할 수 있는 상품 모음이에요. (mock · 실제 지급·적용은 운영 정책에 따릅니다)",
  lowest:
    "최근 7일 기준 최저가 mock으로 표시된 상품이에요. 실제 최저가·가격 보장이 아닙니다.",
  repurchase:
    "재구매율이 높은 상품을 mock 기준으로 모았어요. 추천 참고용입니다.",
  "new-sellers":
    "새롭게 입점한 판매자의 대표 상품을 만나보세요. (기획전 mock)",
  live: "라이브커머스 준비 중이에요. 함께 보면 좋은 추천상품을 둘러보세요.",
};

export function getPromotionHomeSubtitle(slug: string): string | undefined {
  return PROMOTION_HOME_SUBTITLES[slug as PromotionCopySlug];
}

export function getPromotionCollectionDescription(slug: string, fallback: string): string {
  return PROMOTION_COLLECTION_DESCRIPTIONS[slug] ?? fallback;
}
