import { CATEGORY_CATALOG } from "@/lib/categories/catalog";

export type AdminCategoryRow = {
  slug: string;
  name: string;
  visible: boolean;
  displayOrder: number;
  subcategories: { slug: string; name: string; visible: boolean; displayOrder: number }[];
  connectedRoutes: string[];
};

export type AdminBanner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  startsAt: string;
  endsAt: string;
  visible: boolean;
  device: "mobile" | "pc" | "all";
  position: "home-main" | "home-mid" | "category";
};

export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "live" | "ended";
  heroImageUrl: string;
  linkedCategorySlugs: string[];
};

const STORE_KEY = Symbol.for("wadeal.adminCommerceStore");

type AdminCommerceStore = {
  categories: AdminCategoryRow[];
  banners: AdminBanner[];
  events: AdminEvent[];
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function buildInitialCategories(): AdminCategoryRow[] {
  return CATEGORY_CATALOG.map((category, index) => ({
    slug: category.slug,
    name: category.label,
    visible: true,
    displayOrder: index + 1,
    subcategories: category.subcategories.map((sub, subIndex) => ({
      slug: sub.slug,
      name: sub.label,
      visible: true,
      displayOrder: subIndex + 1,
    })),
    connectedRoutes: ["/", "/search", `/category/${category.slug}`],
  }));
}

export function buildInitialBanners(): AdminBanner[] {
  return [
    {
      id: "BN-HOME-001",
      title: "오늘 24시 마감 공동구매",
      imageUrl: "/wadeal-wordmark.svg",
      linkUrl: "/search?sort=deadline",
      startsAt: "2026-05-29 00:00",
      endsAt: "2026-05-29 23:59",
      visible: true,
      device: "all",
      position: "home-main",
    },
    {
      id: "BN-HOME-002",
      title: "첫 구매 혜택",
      imageUrl: "/wadeal-wordmark.svg",
      linkUrl: "/mypage/benefits",
      startsAt: "2026-05-29 00:00",
      endsAt: "2026-06-30 23:59",
      visible: true,
      device: "mobile",
      position: "home-mid",
    },
  ];
}

export function buildInitialEvents(): AdminEvent[] {
  return [
    {
      id: "EVT-DEADLINE",
      title: "오늘 마감 공동구매",
      description: "마감 임박 딜을 모은 기획전입니다.",
      startsAt: "2026-05-29 00:00",
      endsAt: "2026-05-29 23:59",
      status: "live",
      heroImageUrl: "/wadeal-wordmark.svg",
      linkedCategorySlugs: ["food", "living"],
    },
    {
      id: "EVT-BABY",
      title: "육아 필수템 공동구매",
      description: "출산·육아 카테고리 기획전입니다.",
      startsAt: "2026-06-01 00:00",
      endsAt: "2026-06-14 23:59",
      status: "scheduled",
      heroImageUrl: "/wadeal-wordmark.svg",
      linkedCategorySlugs: ["baby"],
    },
  ];
}

function getStore(): AdminCommerceStore {
  const globalStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: AdminCommerceStore;
  };

  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = {
      categories: buildInitialCategories(),
      banners: buildInitialBanners(),
      events: buildInitialEvents(),
    };
  }

  return globalStore[STORE_KEY]!;
}

function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export function listAdminCategories(): AdminCategoryRow[] {
  return clone(
    [...getStore().categories].sort((left, right) => left.displayOrder - right.displayOrder),
  );
}

export function listAdminBanners(): AdminBanner[] {
  return clone(getStore().banners);
}

export function listAdminEvents(): AdminEvent[] {
  return clone(getStore().events);
}

export function toggleCategoryVisibility(slug: string): boolean {
  const category = getStore().categories.find((row) => row.slug === slug);
  if (!category) {
    return false;
  }
  category.visible = !category.visible;
  return true;
}

export function moveCategoryOrder(slug: string, direction: "up" | "down"): boolean {
  const categories = [...getStore().categories].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
  const index = categories.findIndex((row) => row.slug === slug);
  if (index < 0) {
    return false;
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= categories.length) {
    return false;
  }

  const currentOrder = categories[index]!.displayOrder;
  categories[index]!.displayOrder = categories[swapIndex]!.displayOrder;
  categories[swapIndex]!.displayOrder = currentOrder;
  return true;
}

export function addAdminBanner(input: Omit<AdminBanner, "id">): AdminBanner {
  const banner: AdminBanner = { ...input, id: nextId("BN") };
  getStore().banners.unshift(banner);
  return clone(banner);
}

export function deleteAdminBanner(bannerId: string): boolean {
  const store = getStore();
  const before = store.banners.length;
  store.banners = store.banners.filter((banner) => banner.id !== bannerId);
  return store.banners.length < before;
}

export function updateAdminBannerVisibility(bannerId: string, visible: boolean): boolean {
  const banner = getStore().banners.find((row) => row.id === bannerId);
  if (!banner) {
    return false;
  }
  banner.visible = visible;
  return true;
}

export function addAdminEvent(input: Omit<AdminEvent, "id">): AdminEvent {
  const event: AdminEvent = { ...input, id: nextId("EVT") };
  getStore().events.unshift(event);
  return clone(event);
}

export function deleteAdminEvent(eventId: string): boolean {
  const store = getStore();
  const before = store.events.length;
  store.events = store.events.filter((event) => event.id !== eventId);
  return store.events.length < before;
}
