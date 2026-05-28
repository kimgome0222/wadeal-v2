import type { ProductShippingProfile, ShippingType } from "@/lib/shipping/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_SHIPPING: ProductShippingProfile = {
  shippingFee: 3000,
  freeShippingThreshold: null,
  shippingType: "paid",
  isFreeShipping: false,
  remoteAreaExtraFee: 3000,
};

const PRODUCT_SHIPPING_SELECT =
  "shipping_fee, free_shipping_threshold, shipping_type, is_free_shipping, remote_area_extra_fee";

function normalizeShippingType(value: string | null | undefined): ShippingType {
  if (value === "free" || value === "conditional_free" || value === "paid") {
    return value;
  }
  return "paid";
}

function mapProductShippingRow(row: Record<string, unknown>): ProductShippingProfile {
  return {
    shippingFee: Math.max(0, Math.round((row.shipping_fee as number) ?? 0)),
    freeShippingThreshold:
      row.free_shipping_threshold == null
        ? null
        : Math.max(0, Math.round(row.free_shipping_threshold as number)),
    shippingType: normalizeShippingType(row.shipping_type as string | undefined),
    isFreeShipping: Boolean(row.is_free_shipping),
    remoteAreaExtraFee: Math.max(0, Math.round((row.remote_area_extra_fee as number) ?? 0)),
  };
}

export async function getProductShippingBySlug(
  productSlug: string,
): Promise<ProductShippingProfile> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SHIPPING;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? DEFAULT_SHIPPING : DEFAULT_SHIPPING;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SHIPPING_SELECT)
    .eq("slug", productSlug)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[product-shipping] getProductShippingBySlug:", error.message);
    }
    return DEFAULT_SHIPPING;
  }

  return mapProductShippingRow(data as Record<string, unknown>);
}

export { DEFAULT_SHIPPING };
