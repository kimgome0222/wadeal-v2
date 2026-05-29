"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";

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

/** DB 연결 전: 검증만 수행 */
export async function saveBannerAction(formData: FormData) {
  await ensureAdmin();
  requireValue(formData, "title");
  requireValue(formData, "linkUrl");
  revalidatePath("/admin/banners");
}

export async function deleteBannerAction(formData: FormData) {
  await ensureAdmin();
  requireValue(formData, "bannerId");
  revalidatePath("/admin/banners");
}

export async function saveEventAction(formData: FormData) {
  await ensureAdmin();
  requireValue(formData, "title");
  requireValue(formData, "status");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateCategoryVisibilityAction(formData: FormData) {
  await ensureAdmin();
  requireValue(formData, "slug");
  revalidatePath("/admin/categories");
}

export async function deleteEventAction(formData: FormData) {
  await ensureAdmin();
  requireValue(formData, "eventId");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
