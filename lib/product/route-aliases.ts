/**
 * QA·문서용 legacy product/checkout route aliases (mock env).
 * DB 변경 없음 — mock catalog lookup만 정규화.
 */
export const PRODUCT_ROUTE_ALIASES: Record<string, string> = {
  "1": "wd-jeju-citrus-5kg",
  "11": "wd-wipes-001",
};

export function resolveProductRouteId(id: string): string {
  const trimmed = id.trim();
  return PRODUCT_ROUTE_ALIASES[trimmed] ?? trimmed;
}

export function resolveCheckoutRouteId(id: string): string {
  return resolveProductRouteId(id);
}

/** 문서·QA 스모크용 필수 route */
export const CELLOH_REQUIRED_ROUTES = {
  customer: [
    "/",
    "/search",
    "/category/food",
    "/category/living",
    "/category/beauty",
    "/category/fashion",
    "/category/digital",
    "/category/pet",
    "/product/1",
    "/product/11",
    "/join-cart",
    "/checkout/wd-wipes-001",
    "/mypage",
    "/notifications",
  ],
  collections: [
    "/collections/today-special",
    "/collections/recommended",
    "/collections/celloh-coupon",
    "/collections/ending-sale",
    "/collections/popular",
    "/collections/weekend-special",
    "/collections/ranking",
    "/collections/lowest",
    "/collections/only-celloh",
    "/collections/coupon-sale",
    "/collections/repurchase",
    "/collections/seasonal",
    "/collections/new",
    "/collections/popular-sellers",
    "/collections/new-sellers",
    "/collections/live",
  ],
  policies: [
    "/membership",
    "/invite",
    "/support",
    "/policies/privacy",
    "/policies/terms",
    "/policies/refund",
    "/policies/shipping",
    "/policies/payment",
    "/policies/referral",
    "/policies/seller",
  ],
  sellers: [
    "/sellers/moon-fruit",
    "/sellers/living-lab",
    "/sellers/lumi-beauty",
    "/sellers/celloh-fresh",
    "/sellers/celloh",
  ],
  sellerCenter: [
    "/seller/dashboard",
    "/seller/products",
    "/seller/orders",
    "/seller/reviews",
    "/seller/settlements",
  ],
  admin: ["/admin/dashboard"],
} as const;

export const CELLOH_SAFE_FALLBACK_ROUTES = [
  "/product/unknown-route-audit",
  "/sellers/unknown-route-audit",
  "/collections/unknown-route-audit",
] as const;
