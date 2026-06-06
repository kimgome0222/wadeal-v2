import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

/** localStorage — 상품 기본정보만 (개인정보/프로파일 저장 없음) */
export type RecentProductSnapshot = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  viewedAt: string;
};

export const RECENT_PRODUCTS_KEY = "celloh-recent-products";
const LEGACY_RECENT_KEY = "wadeal_recent_deals_v1";
export const MAX_RECENT_PRODUCTS = 20;

export const RECENT_PRODUCTS_EVENT = "celloh:recent-products-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(RECENT_PRODUCTS_EVENT));
  } catch {
    // ignore quota errors
  }
}

function migrateLegacyRecentProducts(): RecentProductSnapshot[] {
  const legacy = readJson<
    Array<{
      slug: string;
      productName: string;
      groupPrice: number;
      imageUrl: string;
      viewedAt?: string;
    }>
  >(LEGACY_RECENT_KEY, []);

  return legacy.map((item) => ({
    id: item.slug,
    slug: item.slug,
    name: item.productName,
    image: item.imageUrl,
    price: item.groupPrice,
    viewedAt: item.viewedAt ?? new Date().toISOString(),
  }));
}

/** SSR safe — browser only */
export function readRecentProducts(): RecentProductSnapshot[] {
  const current = readJson<RecentProductSnapshot[]>(RECENT_PRODUCTS_KEY, []);
  if (current.length > 0) {
    return current;
  }

  const migrated = migrateLegacyRecentProducts();
  if (migrated.length > 0) {
    writeJson(RECENT_PRODUCTS_KEY, migrated.slice(0, MAX_RECENT_PRODUCTS));
    return migrated.slice(0, MAX_RECENT_PRODUCTS);
  }

  return [];
}

export function dealToRecentProductSnapshot(deal: Deal): RecentProductSnapshot {
  const { applicablePrice } = getTierProgress(deal);
  return {
    id: String(deal.id),
    slug: deal.slug,
    name: deal.title,
    image: deal.imageUrl?.trim() || "",
    price: applicablePrice,
    viewedAt: new Date().toISOString(),
  };
}

/** PDP 진입 시 호출 — client only */
export function addRecentProduct(deal: Deal) {
  if (!isBrowser()) {
    return;
  }

  const snapshot = dealToRecentProductSnapshot(deal);
  const next = [
    snapshot,
    ...readRecentProducts().filter((item) => item.slug !== deal.slug),
  ].slice(0, MAX_RECENT_PRODUCTS);

  writeJson(RECENT_PRODUCTS_KEY, next);
}

export function readRecentProductSlugs(): string[] {
  return readRecentProducts().map((item) => item.slug);
}

/** catalog에서 최근 본 상품 Deal 목록 — SSR/catalog sync용 */
export function resolveRecentProductDeals(
  catalog: Deal[],
  snapshots: RecentProductSnapshot[],
  limit = MAX_RECENT_PRODUCTS,
): Deal[] {
  const slugs = snapshots.map((item) => item.slug);
  return slugs
    .map((slug) => catalog.find((deal) => deal.slug === slug))
    .filter((deal): deal is Deal => deal != null)
    .slice(0, limit);
}
