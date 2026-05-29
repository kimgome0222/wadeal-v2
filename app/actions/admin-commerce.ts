"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  createAdminBanner,
  createAdminEvent,
  moveAdminCategoryOrder,
  removeAdminBanner,
  removeAdminEvent,
  setAdminBannerVisibility,
  toggleAdminCategoryVisibility,
} from "@/lib/data/admin-commerce";

async function ensureAdmin() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin");
  }
}

function requireValue(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  if (!value) {
    throw new Error(`${key} 값이 필요합니다.`);
  }
  return value;
}

function optionalValue(formData: FormData, key: string, fallback = "") {
  return formData.get(key)?.toString().trim() ?? fallback;
}

type AdminBannerPosition = "home-main" | "home-mid" | "category";

export async function saveBannerAction(formData: FormData) {
  await ensureAdmin();

  const title = requireValue(formData, "title");
  const linkUrl = requireValue(formData, "linkUrl");
  const imageUrl = optionalValue(formData, "imageUrl", "/wadeal-wordmark.svg");
  const startsAt = optionalValue(formData, "startsAt", "2026-01-01 00:00");
  const endsAt = optionalValue(formData, "endsAt", "2099-12-31 23:59");
  const device = optionalValue(formData, "device", "all") as "mobile" | "pc" | "all";
  const position = optionalValue(formData, "position", "home-main") as AdminBannerPosition;
  const visible = formData.get("visible") !== "off";

  await createAdminBanner({
    title,
    imageUrl,
    linkUrl,
    startsAt,
    endsAt,
    visible,
    device,
    position,
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBannerAction(formData: FormData) {
  await ensureAdmin();
  const bannerId = requireValue(formData, "bannerId");
  await removeAdminBanner(bannerId);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerVisibilityAction(formData: FormData) {
  await ensureAdmin();
  const bannerId = requireValue(formData, "bannerId");
  const visible = formData.get("visible") === "true";
  await setAdminBannerVisibility(bannerId, visible);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function saveEventAction(formData: FormData) {
  await ensureAdmin();

  const title = requireValue(formData, "title");
  const status = requireValue(formData, "status") as "scheduled" | "live" | "ended";
  const description = optionalValue(formData, "description", "와딜 기획전");
  const startsAt = optionalValue(formData, "startsAt", "2026-01-01 00:00");
  const endsAt = optionalValue(formData, "endsAt", "2099-12-31 23:59");
  const heroImageUrl = optionalValue(formData, "heroImageUrl", "/wadeal-wordmark.svg");
  const linkedCategorySlugs = optionalValue(formData, "linkedCategorySlugs", "all")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  await createAdminEvent({
    title,
    description,
    startsAt,
    endsAt,
    status,
    heroImageUrl,
    linkedCategorySlugs,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateCategoryVisibilityAction(formData: FormData) {
  await ensureAdmin();
  const slug = requireValue(formData, "slug");
  await toggleAdminCategoryVisibility(slug);
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function moveCategoryOrderAction(formData: FormData) {
  await ensureAdmin();
  const slug = requireValue(formData, "slug");
  const direction = requireValue(formData, "direction") as "up" | "down";
  await moveAdminCategoryOrder(slug, direction);
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

export async function deleteEventAction(formData: FormData) {
  await ensureAdmin();
  const eventId = requireValue(formData, "eventId");
  await removeAdminEvent(eventId);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
