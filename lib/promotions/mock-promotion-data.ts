/** Admin 프로모션 mock — DB 저장 없음 */

export type MockPromotionStatus = "scheduled" | "live" | "ended" | "hidden";

export type MockPromotionItem = {
  id: string;
  name: string;
  status: MockPromotionStatus;
  startsAt: string;
  endsAt: string;
  productCount: number;
  hasCoupon: boolean;
  placements: string[];
  collectionSlug?: string;
  previewHref?: string;
};

export const MOCK_PROMOTION_STATUS_LABELS: Record<MockPromotionStatus, string> = {
  scheduled: "예정",
  live: "진행중",
  ended: "종료",
  hidden: "숨김",
};

export const MOCK_PROMOTIONS: MockPromotionItem[] = [
  {
    id: "promo-today-special",
    name: "오늘의특가",
    status: "live",
    startsAt: "2026-05-29 00:00",
    endsAt: "2026-05-29 23:59",
    productCount: 12,
    hasCoupon: false,
    placements: ["홈 섹션", "Quick Menu"],
    collectionSlug: "today-special",
    previewHref: "/collections/today-special",
  },
  {
    id: "promo-ending-sale",
    name: "마감세일",
    status: "live",
    startsAt: "2026-05-29 00:00",
    endsAt: "2026-05-29 23:59",
    productCount: 10,
    hasCoupon: false,
    placements: ["홈 섹션", "Quick Menu"],
    collectionSlug: "ending-sale",
    previewHref: "/collections/ending-sale",
  },
  {
    id: "promo-weekend-special",
    name: "주말특가",
    status: "scheduled",
    startsAt: "2026-05-31 00:00",
    endsAt: "2026-06-01 23:59",
    productCount: 8,
    hasCoupon: false,
    placements: ["홈 섹션", "Quick Menu"],
    collectionSlug: "weekend-special",
    previewHref: "/collections/weekend-special",
  },
  {
    id: "promo-coupon-sale",
    name: "쿠폰세일",
    status: "live",
    startsAt: "2026-05-01 00:00",
    endsAt: "2026-06-30 23:59",
    productCount: 15,
    hasCoupon: true,
    placements: ["홈 섹션", "Quick Menu", "장바구니 tier 안내"],
    collectionSlug: "coupon-sale",
    previewHref: "/collections/coupon-sale",
  },
  {
    id: "promo-only-celloh",
    name: "셀로단독특가",
    status: "live",
    startsAt: "2026-05-01 00:00",
    endsAt: "2099-12-31 23:59",
    productCount: 6,
    hasCoupon: false,
    placements: ["홈 Only Celloh rail"],
    collectionSlug: "only-celloh",
    previewHref: "/collections/only-celloh",
  },
  {
    id: "promo-celloh-coupon",
    name: "셀로쿠폰",
    status: "live",
    startsAt: "2026-05-01 00:00",
    endsAt: "2026-12-31 23:59",
    productCount: 12,
    hasCoupon: true,
    placements: ["Quick Menu", "컬렉션"],
    collectionSlug: "celloh-coupon",
    previewHref: "/collections/celloh-coupon",
  },
  {
    id: "promo-repurchase",
    name: "재구매율 높은 상품",
    status: "live",
    startsAt: "2026-05-01 00:00",
    endsAt: "2099-12-31 23:59",
    productCount: 18,
    hasCoupon: false,
    placements: ["홈 섹션"],
    collectionSlug: "repurchase",
    previewHref: "/collections/repurchase",
  },
  {
    id: "promo-new-sellers",
    name: "신규 입점 판매자 기획전",
    status: "live",
    startsAt: "2026-05-15 00:00",
    endsAt: "2026-06-15 23:59",
    productCount: 4,
    hasCoupon: false,
    placements: ["홈 판매자 showcase", "컬렉션"],
    collectionSlug: "new-sellers",
    previewHref: "/collections/new-sellers",
  },
  {
    id: "promo-membership",
    name: "셀로 멤버십 혜택",
    status: "scheduled",
    startsAt: "2026-07-01 00:00",
    endsAt: "2099-12-31 23:59",
    productCount: 0,
    hasCoupon: true,
    placements: ["Quick Menu", "/membership"],
    previewHref: "/membership",
  },
  {
    id: "promo-referral",
    name: "지인초대 혜택",
    status: "live",
    startsAt: "2026-05-01 00:00",
    endsAt: "2099-12-31 23:59",
    productCount: 0,
    hasCoupon: true,
    placements: ["Quick Menu", "/invite"],
    previewHref: "/invite",
  },
  {
    id: "promo-live",
    name: "라이브커머스",
    status: "hidden",
    startsAt: "2026-08-01 00:00",
    endsAt: "2099-12-31 23:59",
    productCount: 0,
    hasCoupon: false,
    placements: ["준비중 배너"],
    collectionSlug: "live",
    previewHref: "/collections/live",
  },
];

export function getMockPromotions(): MockPromotionItem[] {
  return MOCK_PROMOTIONS;
}
