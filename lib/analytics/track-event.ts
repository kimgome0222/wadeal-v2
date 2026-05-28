export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "search"
  | "add_to_cart"
  | "join_deal"
  | "share"
  | "save_deal"
  | "checkout_start"
  | "checkout_complete";

type AnalyticsProvider = (name: AnalyticsEventName, payload: AnalyticsPayload) => void;

const providers: AnalyticsProvider[] = [];

/**
 * Register a future analytics backend (GA4, Meta Pixel, etc.).
 * Call once during app bootstrap when env keys are present.
 */
export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  providers.push(provider);
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  const enriched = {
    ...payload,
    event: name,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", enriched);
  }

  for (const provider of providers) {
    try {
      provider(name, enriched);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[analytics] provider error:", error);
      }
    }
  }
}
