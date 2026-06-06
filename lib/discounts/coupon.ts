import type { CouponDiscountType, CouponValidationError } from "@/lib/discounts/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ValidatedCoupon = {
  couponId: string;
  couponCode: string;
  couponName: string;
  discountType: CouponDiscountType;
  discountAmount: number;
  shippingFee: number;
};

export function calculateCouponDiscount(input: {
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  subtotalAmount: number;
}): number {
  const subtotal = Math.max(0, Math.round(input.subtotalAmount));

  switch (input.discountType) {
    case "fixed_amount":
      return Math.min(Math.round(input.discountValue), subtotal);
    case "percentage": {
      let discount = Math.round(subtotal * input.discountValue / 100);
      if (input.maxDiscountAmount != null) {
        discount = Math.min(discount, input.maxDiscountAmount);
      }
      return Math.min(discount, subtotal);
    }
    case "free_shipping":
      return 0;
    default:
      return 0;
  }
}

function mapCouponRpcError(message: string): CouponValidationError {
  if (message.includes("coupon_not_found")) return "coupon_not_found";
  if (message.includes("coupon_inactive")) return "coupon_inactive";
  if (message.includes("coupon_not_started")) return "coupon_not_started";
  if (message.includes("coupon_expired")) return "coupon_expired";
  if (message.includes("min_order_not_met")) return "min_order_not_met";
  if (message.includes("usage_limit_exceeded")) return "usage_limit_exceeded";
  if (message.includes("per_user_limit_exceeded")) return "per_user_limit_exceeded";
  if (message.includes("coupon_already_reserved")) return "coupon_already_reserved";
  return "invalid_subtotal";
}

export async function validateCoupon(input: {
  userId: string;
  couponCode: string;
  subtotalAmount: number;
  orderId?: string | null;
}): Promise<
  | { success: true; coupon: ValidatedCoupon }
  | { success: false; error: CouponValidationError }
> {
  const code = input.couponCode.trim();
  if (!code) {
    return { success: false, error: "coupon_not_found" };
  }

  if (!isSupabaseConfigured()) {
    const mockDiscount = calculateCouponDiscount({
      discountType: "fixed_amount",
      discountValue: 1000,
      maxDiscountAmount: null,
      subtotalAmount: input.subtotalAmount,
    });
    return {
      success: true,
      coupon: {
        couponId: "mock-coupon",
        couponCode: code.toUpperCase(),
        couponName: "테스트 쿠폰",
        discountType: "fixed_amount",
        discountAmount: mockDiscount,
        shippingFee: 0,
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "invalid_subtotal" };
  }

  const { data, error } = await supabase.rpc("apply_coupon", {
    p_user_id: input.userId,
    p_coupon_code: code,
    p_subtotal_amount: Math.round(input.subtotalAmount),
    p_order_id: input.orderId ?? null,
  });

  if (error) {
    return { success: false, error: mapCouponRpcError(error.message) };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { success: false, error: "coupon_not_found" };
  }

  return {
    success: true,
    coupon: {
      couponId: row.coupon_id as string,
      couponCode: row.coupon_code as string,
      couponName: row.coupon_name as string,
      discountType: row.discount_type as CouponDiscountType,
      discountAmount: row.discount_amount as number,
      shippingFee: (row.shipping_fee as number) ?? 0,
    },
  };
}
