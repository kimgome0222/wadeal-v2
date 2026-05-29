import type { Deal } from "@/lib/deals";
import { getDealBadgeLabel } from "@/lib/deals";
import { isProductionRuntime } from "@/lib/env/runtime";

const SAVED_KEY = "wadeal_saved_deals_v1";
const RECENT_KEY = "wadeal_recent_deals_v1";
const ACTIVITY_KEY = "wadeal_recent_activity_v1";
const MAX_RECENT = 5;
const MAX_ACTIVITY = 10;

export type DealSnapshot = {
  slug: string;
  productName: string;
  originalPrice: number;
  groupPrice: number;
  imageUrl: string;
  status: string;
  savedAt?: string;
  viewedAt?: string;
};

export type ActivityType = "alert" | "join" | "save";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  href: string;
  createdAt: string;
};

export const LOCAL_DATA_EVENTS = {
  saved: "wadeal:saved-updated",
  recent: "wadeal:recent-updated",
  activity: "wadeal:activity-updated",
} as const;

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
  } catch (error) {
    console.error("[storage] readJson:", key, error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("[storage] writeJson:", key, error);
  }
}

export function dealToSnapshot(deal: Deal): DealSnapshot {
  return {
    slug: deal.slug,
    productName: deal.title,
    originalPrice: deal.originalPrice,
    groupPrice: deal.groupPrice,
    imageUrl: deal.imageUrl,
    status: getDealBadgeLabel(deal),
  };
}

export function getSavedDeals(): DealSnapshot[] {
  return readJson<DealSnapshot[]>(SAVED_KEY, []);
}

export function isDealSaved(slug: string): boolean {
  return getSavedDeals().some((item) => item.slug === slug);
}

export function toggleSavedDeal(deal: Deal): boolean {
  const saved = getSavedDeals();
  const exists = saved.some((item) => item.slug === deal.slug);

  if (exists) {
    const next = saved.filter((item) => item.slug !== deal.slug);
    writeJson(SAVED_KEY, next);
    window.dispatchEvent(new Event(LOCAL_DATA_EVENTS.saved));
    return false;
  }

  const next = [{ ...dealToSnapshot(deal), savedAt: new Date().toISOString() }, ...saved];
  writeJson(SAVED_KEY, next);
  recordActivity({
    type: "save",
    title: "상품 찜하기",
    description: `${deal.title}을(를) 찜했어요.`,
    href: `/product/${deal.slug}`,
  });
  window.dispatchEvent(new Event(LOCAL_DATA_EVENTS.saved));
  return true;
}

export function getRecentDeals(): DealSnapshot[] {
  return readJson<DealSnapshot[]>(RECENT_KEY, []);
}

export function addRecentDeal(deal: Deal) {
  const snapshot = {
    ...dealToSnapshot(deal),
    viewedAt: new Date().toISOString(),
  };
  const filtered = getRecentDeals().filter((item) => item.slug !== deal.slug);
  const next = [snapshot, ...filtered].slice(0, MAX_RECENT);
  writeJson(RECENT_KEY, next);
  window.dispatchEvent(new Event(LOCAL_DATA_EVENTS.recent));
}

export function getRecentActivities(): ActivityItem[] {
  return readJson<ActivityItem[]>(ACTIVITY_KEY, []);
}

export function recordActivity(input: {
  type: ActivityType;
  title: string;
  description: string;
  href: string;
}) {
  const item: ActivityItem = {
    id: `${input.type}-${Date.now()}`,
    type: input.type,
    title: input.title,
    description: input.description,
    href: input.href,
    createdAt: new Date().toISOString(),
  };

  const next = [item, ...getRecentActivities()].slice(0, MAX_ACTIVITY);
  writeJson(ACTIVITY_KEY, next);
  window.dispatchEvent(new Event(LOCAL_DATA_EVENTS.activity));
}

export const exampleActivities: ActivityItem[] = [
  {
    id: "example-alert",
    type: "alert",
    title: "가격 알림 설정",
    description: "제주 고당도 감귤 3kg 목표가 알림을 설정했어요.",
    href: "/mypage/alerts",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "example-join",
    type: "join",
    title: "상품 구매",
    description: "초경량 무선 청소기 상품을 구매했어요.",
    href: "/mypage/orders",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "example-save",
    type: "save",
    title: "상품 찜하기",
    description: "한우 불고기 냉장팩 600g을(를) 찜했어요.",
    href: "/saved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export function getMypageActivities(limit = 3): ActivityItem[] {
  const stored = getRecentActivities();
  if (stored.length >= limit || isProductionRuntime()) {
    return stored.slice(0, limit);
  }

  const merged = [...stored];
  for (const example of exampleActivities) {
    if (merged.length >= limit) {
      break;
    }
    if (!merged.some((item) => item.type === example.type)) {
      merged.push(example);
    }
  }

  return merged.slice(0, limit);
}
