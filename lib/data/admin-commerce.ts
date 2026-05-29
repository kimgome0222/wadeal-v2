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

/** Cloud merge: 정적 catalog + fallback 운영 데이터 (DB migration 전) */
export const adminCategories: AdminCategoryRow[] = CATEGORY_CATALOG.map((category, index) => ({
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

export const adminBanners: AdminBanner[] = [
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

export const adminEvents: AdminEvent[] = [
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

export function getVisibleHomeBanners(): AdminBanner[] {
  return adminBanners.filter((banner) => banner.visible && banner.position.startsWith("home"));
}

export function getLiveEvents(): AdminEvent[] {
  return adminEvents.filter((event) => event.status === "live" || event.status === "scheduled");
}

export function getAdminEventById(id: string): AdminEvent | undefined {
  return adminEvents.find((event) => event.id === id);
}
