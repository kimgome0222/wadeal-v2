/** celloh analytics event names — no external send in this phase */
export type CellohEventName =
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "purchase_complete"
  | "coupon_apply"
  | "search_submit"
  | "category_click"
  | "quick_menu_click"
  | "seller_view"
  | "referral_share";

/** PII 금지 — 허용 payload 키만 사용 */
export type CellohEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

const BLOCKED_PAYLOAD_KEYS =
  /email|phone|address|token|password|name|recipient|orderer/i;

function sanitizePayload(payload?: CellohEventPayload): CellohEventPayload | undefined {
  if (!payload) {
    return undefined;
  }

  const sanitized: CellohEventPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (BLOCKED_PAYLOAD_KEYS.test(key)) {
      continue;
    }
    if (typeof value === "string" && value.length > 120) {
      continue;
    }
    sanitized[key] = value;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/**
 * Mock event tracker — production/no-op, no API calls.
 * Set NEXT_PUBLIC_CELLOH_ANALYTICS_DEBUG=1 in dev to log to console.
 */
export function trackCellohEvent(name: CellohEventName, payload?: CellohEventPayload): void {
  const safePayload = sanitizePayload(payload);

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_CELLOH_ANALYTICS_DEBUG === "1"
  ) {
    console.debug("[celloh-analytics]", name, safePayload ?? {});
  }
}
