import type { AdminCouponListItem } from "@/lib/data/admin-coupons";
import type { CouponDiscountType } from "@/lib/discounts/types";

/** 쿠폰 종류 mock — DB 지급 없음 */
export type MockCouponKind =
  | "cart"
  | "product"
  | "referral"
  | "membership"
  | "first_purchase"
  | "repurchase"
  | "weekend"
  | "ending_sale";

export type MockCouponCatalogItem = AdminCouponListItem & {
  kind: MockCouponKind;
  kindLabel: string;
  maxDiscountAmount: number | null;
  targetCategories: string[];
  targetProducts: string;
  stackable: boolean;
  issuanceLimit: number | null;
  status: "scheduled" | "live" | "ended";
};

export const MOCK_COUPON_KIND_LABELS: Record<MockCouponKind, string> = {
  cart: "장바구니 금액 쿠폰",
  product: "상품 쿠폰",
  referral: "친구추천 쿠폰",
  membership: "멤버십 쿠폰",
  first_purchase: "첫구매 쿠폰",
  repurchase: "재구매 쿠폰",
  weekend: "주말 쿠폰",
  ending_sale: "마감세일 쿠폰",
};

function mockCoupon(input: Omit<MockCouponCatalogItem, "kindLabel">): MockCouponCatalogItem {
  return {
    ...input,
    kindLabel: MOCK_COUPON_KIND_LABELS[input.kind],
  };
}

export const MOCK_COUPON_CATALOG: MockCouponCatalogItem[] = [
  mockCoupon({
    id: "mock-cart-30k",
    code: "TIER30K",
    name: "3만원 장바구니 쿠폰",
    kind: "cart",
    discountType: "fixed_amount" satisfies CouponDiscountType,
    discountValue: 3_000,
    minOrderAmount: 30_000,
    maxDiscountAmount: 3_000,
    isActive: true,
    usageCount: 128,
    usageLimit: null,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: null,
    targetCategories: ["전체"],
    targetProducts: "전체 상품",
    stackable: false,
    issuanceLimit: null,
    status: "live",
  }),
  mockCoupon({
    id: "mock-product-food",
    code: "FOOD10",
    name: "식품 10% 상품 쿠폰",
    kind: "product",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 15_000,
    maxDiscountAmount: 5_000,
    isActive: true,
    usageCount: 42,
    usageLimit: 500,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: "2026-06-30T23:59:59.000Z",
    targetCategories: ["food"],
    targetProducts: "식품 카테고리",
    stackable: false,
    issuanceLimit: 1_000,
    status: "live",
  }),
  mockCoupon({
    id: "mock-referral-invite",
    code: "INVITE3K",
    name: "친구추천 가입 쿠폰",
    kind: "referral",
    discountType: "fixed_amount",
    discountValue: 3_000,
    minOrderAmount: 10_000,
    maxDiscountAmount: 3_000,
    isActive: true,
    usageCount: 18,
    usageLimit: null,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    targetCategories: ["전체"],
    targetProducts: "신규 가입자 1회",
    stackable: false,
    issuanceLimit: null,
    status: "live",
  }),
  mockCoupon({
    id: "mock-membership-ship",
    code: "MEMSHIP-FREE",
    name: "멤버십 무료배송 쿠폰",
    kind: "membership",
    discountType: "free_shipping",
    discountValue: 0,
    minOrderAmount: 20_000,
    maxDiscountAmount: 3_000,
    isActive: false,
    usageCount: 0,
    usageLimit: 500,
    startsAt: "2026-07-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    targetCategories: ["전체"],
    targetProducts: "멤버십 회원",
    stackable: false,
    issuanceLimit: 500,
    status: "scheduled",
  }),
  mockCoupon({
    id: "mock-first-purchase",
    code: "FIRST5K",
    name: "첫구매 5,000원 쿠폰",
    kind: "first_purchase",
    discountType: "fixed_amount",
    discountValue: 5_000,
    minOrderAmount: 30_000,
    maxDiscountAmount: 5_000,
    isActive: true,
    usageCount: 67,
    usageLimit: 2_000,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    targetCategories: ["전체"],
    targetProducts: "첫 주문 1회",
    stackable: false,
    issuanceLimit: 2_000,
    status: "live",
  }),
  mockCoupon({
    id: "mock-repurchase",
    code: "REBUY2K",
    name: "재구매 2,000원 쿠폰",
    kind: "repurchase",
    discountType: "fixed_amount",
    discountValue: 2_000,
    minOrderAmount: 20_000,
    maxDiscountAmount: 2_000,
    isActive: true,
    usageCount: 31,
    usageLimit: 1_000,
    startsAt: "2026-05-01T00:00:00.000Z",
    endsAt: "2026-09-30T23:59:59.000Z",
    targetCategories: ["전체"],
    targetProducts: "재구매 고객",
    stackable: false,
    issuanceLimit: 1_000,
    status: "live",
  }),
  mockCoupon({
    id: "mock-weekend",
    code: "WEEKEND7",
    name: "주말 7% 쿠폰",
    kind: "weekend",
    discountType: "percentage",
    discountValue: 7,
    minOrderAmount: 25_000,
    maxDiscountAmount: 7_000,
    isActive: true,
    usageCount: 12,
    usageLimit: 300,
    startsAt: "2026-05-31T00:00:00.000Z",
    endsAt: "2026-06-01T23:59:59.000Z",
    targetCategories: ["living", "beauty"],
    targetProducts: "주말특가 상품",
    stackable: false,
    issuanceLimit: 300,
    status: "scheduled",
  }),
  mockCoupon({
    id: "mock-ending-sale",
    code: "LASTCALL5",
    name: "마감세일 5,000원 쿠폰",
    kind: "ending_sale",
    discountType: "fixed_amount",
    discountValue: 5_000,
    minOrderAmount: 40_000,
    maxDiscountAmount: 5_000,
    isActive: true,
    usageCount: 9,
    usageLimit: 200,
    startsAt: "2026-05-29T00:00:00.000Z",
    endsAt: "2026-05-29T23:59:59.000Z",
    targetCategories: ["전체"],
    targetProducts: "마감세일 상품",
    stackable: false,
    issuanceLimit: 200,
    status: "live",
  }),
];

export type MockUserCoupon = {
  id: string;
  name: string;
  code: string;
  discountLabel: string;
  minOrderLabel: string;
  expiresAt: string;
  status: "available" | "used" | "expired";
};

export const MOCK_USER_COUPONS: MockUserCoupon[] = [
  {
    id: "user-coupon-1",
    name: "3만원 장바구니 쿠폰",
    code: "TIER30K",
    discountLabel: "3,000원 할인",
    minOrderLabel: "30,000원 이상",
    expiresAt: "2026-06-30",
    status: "available",
  },
  {
    id: "user-coupon-2",
    name: "친구추천 가입 쿠폰",
    code: "INVITE3K",
    discountLabel: "3,000원 할인",
    minOrderLabel: "10,000원 이상",
    expiresAt: "2026-07-15",
    status: "available",
  },
  {
    id: "user-coupon-3",
    name: "첫구매 5,000원 쿠폰",
    code: "FIRST5K",
    discountLabel: "5,000원 할인",
    minOrderLabel: "30,000원 이상",
    expiresAt: "2026-05-20",
    status: "expired",
  },
];

export function getMockAdminCoupons(): MockCouponCatalogItem[] {
  return MOCK_COUPON_CATALOG;
}

export function getMockUserCoupons(): MockUserCoupon[] {
  return MOCK_USER_COUPONS;
}
