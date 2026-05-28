import type { CouponDiscountType, CouponRow } from "@/lib/discounts/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminCouponListItem = {
  id: string;
  code: string;
  name: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  usageLimit: number | null;
  startsAt: string;
  endsAt: string | null;
};

export type AdminCouponDetail = AdminCouponListItem & {
  description: string | null;
  maxDiscountAmount: number | null;
  perUserLimit: number;
};

function mapCoupon(row: CouponRow, usageCount: number): AdminCouponListItem {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    discountType: row.discount_type,
    discountValue: row.discount_value,
    minOrderAmount: row.min_order_amount,
    isActive: row.is_active,
    usageCount,
    usageLimit: row.usage_limit,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  };
}

export async function getAdminCoupons(): Promise<AdminCouponListItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data: coupons, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !coupons) {
    console.error("[admin-coupons] list:", error?.message);
    return [];
  }

  const { data: usageRows } = await supabase
    .from("coupon_usages")
    .select("coupon_id");

  const usageMap = new Map<string, number>();
  for (const row of (usageRows ?? []) as Array<{ coupon_id: string }>) {
    const id = row.coupon_id;
    usageMap.set(id, (usageMap.get(id) ?? 0) + 1);
  }

  return (coupons as CouponRow[]).map((row) =>
    mapCoupon(row, usageMap.get(row.id) ?? 0),
  );
}

export async function getAdminCouponById(id: string): Promise<AdminCouponDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const { count } = await supabase
    .from("coupon_usages")
    .select("id", { count: "exact", head: true })
    .eq("coupon_id", id);

  const row = data as CouponRow & {
    description: string | null;
    max_discount_amount: number | null;
    per_user_limit: number;
  };
  const base = mapCoupon(row, count ?? 0);
  return {
    ...base,
    description: row.description ?? null,
    maxDiscountAmount: row.max_discount_amount ?? null,
    perUserLimit: row.per_user_limit ?? 1,
  };
}

export type AdminCouponFormInput = {
  code: string;
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  startsAt: string;
  endsAt: string;
  usageLimit: string;
  perUserLimit: string;
  isActive: boolean;
};

export function parseAdminCouponForm(raw: AdminCouponFormInput) {
  return {
    code: raw.code.trim().toUpperCase(),
    name: raw.name.trim(),
    description: raw.description.trim() || null,
    discountType: raw.discountType,
    discountValue: Math.max(0, Math.round(Number(raw.discountValue) || 0)),
    minOrderAmount: Math.max(0, Math.round(Number(raw.minOrderAmount) || 0)),
    maxDiscountAmount:
      raw.maxDiscountAmount.trim() ?
        Math.max(0, Math.round(Number(raw.maxDiscountAmount) || 0))
      : null,
    startsAt: raw.startsAt ? new Date(raw.startsAt).toISOString() : new Date().toISOString(),
    endsAt: raw.endsAt.trim() ? new Date(raw.endsAt).toISOString() : null,
    usageLimit:
      raw.usageLimit.trim() ? Math.max(1, Math.round(Number(raw.usageLimit) || 0)) : null,
    perUserLimit: Math.max(1, Math.round(Number(raw.perUserLimit) || 1)),
    isActive: raw.isActive,
  };
}

export async function upsertAdminCoupon(
  input: ReturnType<typeof parseAdminCouponForm> & { id?: string },
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!input.code || !input.name) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: input.id ?? "mock-coupon" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase.rpc("admin_upsert_coupon", {
    p_id: input.id ?? null,
    p_code: input.code,
    p_name: input.name,
    p_description: input.description,
    p_discount_type: input.discountType,
    p_discount_value: input.discountValue,
    p_min_order_amount: input.minOrderAmount,
    p_max_discount_amount: input.maxDiscountAmount,
    p_starts_at: input.startsAt,
    p_ends_at: input.endsAt,
    p_usage_limit: input.usageLimit,
    p_per_user_limit: input.perUserLimit,
    p_is_active: input.isActive,
  });

  if (error) {
    console.error("[admin-coupons] upsert:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: data as string };
}

export async function toggleAdminCouponActive(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean }> {
  const coupon = await getAdminCouponById(id);
  if (!coupon) {
    return { success: false };
  }

  const result = await upsertAdminCoupon({
    id,
    code: coupon.code,
    name: coupon.name,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minOrderAmount: coupon.minOrderAmount,
    maxDiscountAmount: coupon.maxDiscountAmount,
    startsAt: coupon.startsAt,
    endsAt: coupon.endsAt,
    usageLimit: coupon.usageLimit,
    perUserLimit: coupon.perUserLimit,
    isActive,
  });

  return { success: result.success };
}
