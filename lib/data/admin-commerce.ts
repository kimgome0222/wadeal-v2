import {
  addAdminBanner,
  addAdminEvent,
  buildInitialCategories,
  deleteAdminBanner,
  deleteAdminEvent,
  listAdminBanners,
  listAdminCategories,
  listAdminEvents,
  moveCategoryOrder,
  toggleCategoryVisibility,
  updateAdminBannerVisibility,
  type AdminBanner,
  type AdminCategoryRow,
  type AdminEvent,
} from "@/lib/data/admin-commerce-store";
import {
  fetchAdminBannersFromDb,
  fetchAdminEventsFromDb,
  fetchCategoryOverridesFromDb,
  insertAdminBannerDb,
  insertAdminEventDb,
  mergeCategoriesWithOverrides,
  seedAdminCmsIfEmpty,
  upsertCategoryOverrideDb,
  deleteAdminBannerDb,
  deleteAdminEventDb,
  updateAdminBannerVisibilityDb,
} from "@/lib/data/admin-commerce-db";

export type { AdminBanner, AdminCategoryRow, AdminEvent };

async function syncCategoryToDb(category: AdminCategoryRow): Promise<void> {
  const probe = await fetchCategoryOverridesFromDb();
  if (probe === null) {
    return;
  }

  await upsertCategoryOverrideDb({
    slug: category.slug,
    visible: category.visible,
    displayOrder: category.displayOrder,
  });
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  const base = buildInitialCategories();
  const overrides = await fetchCategoryOverridesFromDb();
  if (overrides && overrides.size > 0) {
    return mergeCategoriesWithOverrides(base, overrides);
  }

  return listAdminCategories();
}

export async function getAdminBanners(): Promise<AdminBanner[]> {
  await seedAdminCmsIfEmpty();
  const fromDb = await fetchAdminBannersFromDb();
  if (fromDb !== null) {
    return fromDb;
  }

  return listAdminBanners();
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  await seedAdminCmsIfEmpty();
  const fromDb = await fetchAdminEventsFromDb();
  if (fromDb !== null) {
    return fromDb;
  }

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

export async function getVisibleHomeBanners(): Promise<AdminBanner[]> {
  const banners = await getAdminBanners();
  return banners.filter(
    (banner) => banner.position.startsWith("home") && isBannerActive(banner),
  );
}

export async function getLiveEvents(): Promise<AdminEvent[]> {
  const events = await getAdminEvents();
  return events.filter((event) => event.status === "live" || event.status === "scheduled");
}

export async function getAdminEventById(id: string): Promise<AdminEvent | undefined> {
  const events = await getAdminEvents();
  return events.find((event) => event.id === id);
}

export async function getPrimaryHomeBanner(): Promise<AdminBanner | null> {
  const banners = await getVisibleHomeBanners();
  return banners.find((banner) => banner.position === "home-main") ?? null;
}

export async function createAdminBanner(input: Omit<AdminBanner, "id">): Promise<void> {
  const saved = await insertAdminBannerDb(input);
  if (!saved) {
    addAdminBanner(input);
  }
}

export async function removeAdminBanner(bannerId: string): Promise<void> {
  const deleted = await deleteAdminBannerDb(bannerId);
  if (!deleted) {
    deleteAdminBanner(bannerId);
  }
}

export async function setAdminBannerVisibility(bannerId: string, visible: boolean): Promise<void> {
  const updated = await updateAdminBannerVisibilityDb(bannerId, visible);
  if (!updated) {
    updateAdminBannerVisibility(bannerId, visible);
  }
}

export async function createAdminEvent(input: Omit<AdminEvent, "id">): Promise<void> {
  const saved = await insertAdminEventDb(input);
  if (!saved) {
    addAdminEvent(input);
  }
}

export async function removeAdminEvent(eventId: string): Promise<void> {
  const deleted = await deleteAdminEventDb(eventId);
  if (!deleted) {
    deleteAdminEvent(eventId);
  }
}

export async function toggleAdminCategoryVisibility(slug: string): Promise<boolean> {
  const toggled = toggleCategoryVisibility(slug);
  if (!toggled) {
    return false;
  }

  const category = listAdminCategories().find((row) => row.slug === slug);
  if (category) {
    await syncCategoryToDb(category);
  }

  return true;
}

export async function moveAdminCategoryOrder(
  slug: string,
  direction: "up" | "down",
): Promise<boolean> {
  const moved = moveCategoryOrder(slug, direction);
  if (!moved) {
    return false;
  }

  const categories = listAdminCategories();
  await Promise.all(categories.map((category) => syncCategoryToDb(category)));
  return true;
}
