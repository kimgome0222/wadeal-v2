"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  parseAdminCouponForm,
  toggleAdminCouponActive,
  upsertAdminCoupon,
  type AdminCouponFormInput,
} from "@/lib/data/admin-coupons";

type AdminCouponActionResult = {
  success: boolean;
  couponId?: string;
  error?: "login_required" | "forbidden" | "invalid_input" | "save_failed";
};

async function ensureAdmin(): Promise<
  { ok: true } | { ok: false; error: AdminCouponActionResult["error"] }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, error: "login_required" };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true };
}

export async function createAdminCouponAction(
  raw: AdminCouponFormInput,
): Promise<AdminCouponActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const parsed = parseAdminCouponForm(raw);
  if (!parsed.code || !parsed.name) {
    return { success: false, error: "invalid_input" };
  }

  const result = await upsertAdminCoupon(parsed);
  if (!result.success) {
    return { success: false, error: "save_failed" };
  }

  revalidatePath("/admin/coupons");
  return { success: true, couponId: result.id };
}

export async function updateAdminCouponAction(
  id: string,
  raw: AdminCouponFormInput,
): Promise<AdminCouponActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const parsed = parseAdminCouponForm(raw);
  const result = await upsertAdminCoupon({ ...parsed, id });
  if (!result.success) {
    return { success: false, error: "save_failed" };
  }

  revalidatePath("/admin/coupons");
  revalidatePath(`/admin/coupons/${id}/edit`);
  return { success: true, couponId: id };
}

export async function toggleAdminCouponActiveAction(
  id: string,
  isActive: boolean,
): Promise<AdminCouponActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const result = await toggleAdminCouponActive(id, isActive);
  if (!result.success) {
    return { success: false, error: "save_failed" };
  }

  revalidatePath("/admin/coupons");
  return { success: true, couponId: id };
}
