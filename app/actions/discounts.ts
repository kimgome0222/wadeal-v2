"use server";

import { revalidatePath } from "next/cache";

import { calculateOrderTotal } from "@/lib/discounts/calculate-order-total";
import { getPointBalance } from "@/lib/discounts/points";
import type { OrderDiscountBreakdown } from "@/lib/discounts/types";
import { getServerAuthUser } from "@/lib/auth/server-session";

export async function validateAndPreviewDiscountsAction(input: {
  subtotalAmount: number;
  couponCode?: string | null;
  pointAmount?: number;
  shippingFee?: number;
}): Promise<
  | { success: true; breakdown: OrderDiscountBreakdown; pointBalance: number; maxUsablePoints: number }
  | { success: false; error: string; message?: string }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required", message: "로그인이 필요해요." };
  }

  const result = await calculateOrderTotal({
    userId: user.id,
    subtotalAmount: input.subtotalAmount,
    couponCode: input.couponCode,
    pointAmount: input.pointAmount,
    shippingFee: input.shippingFee ?? 0,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  const balance = await getPointBalance(user.id);
  const subtotalAfterCoupon =
    result.breakdown.subtotalAmount - result.breakdown.couponDiscountAmount;
  const maxUsable = Math.min(Math.max(0, subtotalAfterCoupon), balance);

  return {
    success: true,
    breakdown: result.breakdown,
    pointBalance: balance,
    maxUsablePoints: maxUsable,
  };
}

export async function revalidateCheckoutDiscounts(path: string) {
  revalidatePath(path);
}
