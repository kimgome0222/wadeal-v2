import {
  listAdminBanners,
  listAdminCategories,
  listAdminEvents,
  type AdminBanner,
  type AdminCategoryRow,
  type AdminEvent,
} from "@/lib/data/admin-commerce-store";

export type { AdminBanner, AdminCategoryRow, AdminEvent };

export function getAdminCategories(): AdminCategoryRow[] {
  return listAdminCategories();
}

export function getAdminBanners(): AdminBanner[] {
  return listAdminBanners();
}

export function getAdminEvents(): AdminEvent[] {
  return listAdminEvents();
}

function isBannerActive(banner: AdminBanner, now = new Date()): boolean {
  if (!banner.visible) {
    return false;
  }

  const start = new Date(banner.startsAt.replace(" ", "T"));
  const end = new Date(banner.endsAt.replace(" ", "T"));
  return now >= start && now <= end;
}

export function getVisibleHomeBanners(): AdminBanner[] {
  return getAdminBanners().filter(
    (banner) => banner.position.startsWith("home") && isBannerActive(banner),
  );
}

export function getLiveEvents(): AdminEvent[] {
  return getAdminEvents().filter((event) => event.status === "live" || event.status === "scheduled");
}

export function getAdminEventById(id: string): AdminEvent | undefined {
  return getAdminEvents().find((event) => event.id === id);
}

export function getPrimaryHomeBanner(): AdminBanner | null {
  return getVisibleHomeBanners().find((banner) => banner.position === "home-main") ?? null;
}
