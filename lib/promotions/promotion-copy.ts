/** 홈·컬렉션 프로모션 노출 문구 — mock 기준, 법무 검토 전 과장 표현 금지 */

import { HOME_SECTION_COPY } from "@/lib/copy/home-section-copy";

export const PROMOTION_HOME_SUBTITLES = {
  "today-special": HOME_SECTION_COPY["today-special"].subtitle,
  "ending-sale": HOME_SECTION_COPY["ending-sale"].subtitle,
  "weekend-special": HOME_SECTION_COPY["weekend-special"].subtitle,
  "coupon-sale": HOME_SECTION_COPY["coupon-sale"].subtitle,
  lowest: HOME_SECTION_COPY.lowest.subtitle,
  "only-celloh": HOME_SECTION_COPY["only-celloh"].subtitle,
  "celloh-coupon": HOME_SECTION_COPY["celloh-coupon"].subtitle,
  repurchase: HOME_SECTION_COPY.repurchase.subtitle,
  "new-sellers": HOME_SECTION_COPY["new-sellers"].subtitle,
  live: HOME_SECTION_COPY.live.subtitle,
  recommended: HOME_SECTION_COPY.recommended.subtitle,
  popular: HOME_SECTION_COPY.popular.subtitle,
  new: HOME_SECTION_COPY.new.subtitle,
  seasonal: HOME_SECTION_COPY.seasonal.subtitle,
  ranking: HOME_SECTION_COPY.ranking.subtitle,
} as const;

export type PromotionCopySlug = keyof typeof PROMOTION_HOME_SUBTITLES;

export const PROMOTION_COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "today-special": HOME_SECTION_COPY["today-special"].shortDescription,
  "ending-sale": HOME_SECTION_COPY["ending-sale"].shortDescription,
  "weekend-special": HOME_SECTION_COPY["weekend-special"].shortDescription,
  "coupon-sale": HOME_SECTION_COPY["coupon-sale"].shortDescription,
  "only-celloh": HOME_SECTION_COPY["only-celloh"].shortDescription,
  "celloh-coupon": HOME_SECTION_COPY["celloh-coupon"].shortDescription,
  lowest: HOME_SECTION_COPY.lowest.shortDescription,
  repurchase: HOME_SECTION_COPY.repurchase.shortDescription,
  "new-sellers": HOME_SECTION_COPY["new-sellers"].shortDescription,
  live: HOME_SECTION_COPY.live.shortDescription,
  recommended: HOME_SECTION_COPY.recommended.shortDescription,
  popular: HOME_SECTION_COPY.popular.shortDescription,
  new: HOME_SECTION_COPY.new.shortDescription,
  seasonal: HOME_SECTION_COPY.seasonal.shortDescription,
  ranking: HOME_SECTION_COPY.ranking.shortDescription,
  frequent: HOME_SECTION_COPY.frequent.shortDescription,
  "popular-sellers": HOME_SECTION_COPY["popular-sellers"].shortDescription,
};

export const COLLECTION_BADGE_LABELS: Record<string, string> = {
  "only-celloh": "ONLY CELLOH",
  "ending-sale": "오늘 마감",
  "coupon-sale": "쿠폰적용",
  "celloh-coupon": "셀로쿠폰",
  repurchase: "재구매 많음",
  new: "NEW",
};

/** 기획전별 문구 뱅크 — 5 variants each (mock, 과장·최저가 보장 금지) */
export const COLLECTION_COPY_BANK: Record<string, readonly string[]> = {
  "today-special": [
    "오늘만 더 좋은 가격으로 만나는 상품",
    "하루 특가, 오늘 확인해 보세요",
    "오늘의 큐레이션 특가를 모았어요",
    "지금 담기 좋은 오늘의 상품",
    "오늘 하루만 이 가격 (mock · 운영 일정)",
  ],
  "ending-sale": [
    "오늘 끝나는 혜택을 놓치지 마세요",
    "남은 시간 동안 더 좋은 가격으로 만나요",
    "마감 전 마지막으로 확인해 보세요",
    "오늘 밤 11:59까지 (mock · 운영 설정)",
    "마감세일 상품을 한곳에 모았어요",
  ],
  "weekend-special": [
    "이번 주말만 만나는 특별 가격",
    "주말에 담기 좋은 상품을 모았어요",
    "토·일 한정 혜택 (mock)",
    "주말 장보기 전에 확인해 보세요",
    "이번 주말 큐레이션 특가",
  ],
  "coupon-sale": [
    "쿠폰 적용가로 더 부담 없이 담아보세요",
    "쿠폰 쓰면 더 좋아지는 상품",
    "적용 가능 쿠폰 상품 모음 (mock)",
    "쿠폰 혜택 받을 수 있는 상품이에요",
    "쿠폰 적용가 참고용 표시",
  ],
  "only-celloh": [
    "celloh에서만 만나는 구성과 혜택",
    "Only Celloh 단독 구성 상품",
    "플랫폼만의 큐레이션 특가 (mock)",
    "셀로에서만 만나는 상품",
    "단독 구성·혜택 안내 (mock)",
  ],
  repurchase: [
    "다시 찾는 고객이 많은 상품이에요",
    "재구매 mock 기준 · 참고용",
    "한 번 쓰고 또 찾는 상품",
    "단골 고객이 많은 상품 모음",
    "재구매율 높은 상품 (mock 큐레이션)",
  ],
  new: [
    "새로 올라온 상품을 먼저 만나보세요",
    "신규 등록 상품 모음",
    "방금 입점한 상품을 확인해 보세요",
    "새로운 큐레이션 상품",
    "신규상품 · 최근 등록 순",
  ],
  seasonal: [
    "이번 달에 어울리는 상품 mock 큐레이션",
    "계절에 맞는 상품을 추천해요 (mock AI)",
    "월별 테마 상품 모음",
    "지금 시기에 담기 좋은 상품",
    "계절 추천 · 실제 AI API 미연동",
  ],
  "popular-sellers": [
    "고객이 자주 찾는 판매자를 소개해요",
    "인기 판매자 mock 기준",
    "믿고 보는 판매자를 만나보세요",
    "판매 실적·리뷰 참고 (mock)",
    "인기 판매자의 대표 상품",
  ],
  "new-sellers": [
    "새롭게 입점한 판매자를 만나보세요",
    "신규 입점 셀러 소개",
    "새로운 브랜드 스토리를 확인해 보세요",
    "입점 판매자 기획전 (mock)",
    "신규 셀러의 대표 상품",
  ],
};

export function getPromotionHomeSubtitle(slug: string): string | undefined {
  return PROMOTION_HOME_SUBTITLES[slug as PromotionCopySlug];
}

export function getPromotionCollectionDescription(slug: string, fallback: string): string {
  return PROMOTION_COLLECTION_DESCRIPTIONS[slug] ?? fallback;
}

export function getCollectionBadgeLabel(slug: string): string | undefined {
  return COLLECTION_BADGE_LABELS[slug];
}

export function getCollectionCopyVariant(slug: string, index = 0): string | undefined {
  const variants = COLLECTION_COPY_BANK[slug];
  if (!variants || variants.length === 0) {
    return undefined;
  }
  return variants[index % variants.length];
}
