"use server";

import { revalidatePath } from "next/cache";

import { requireSeller } from "@/lib/auth/require-seller";
import { registerSellerTrackingNumber } from "@/lib/data/seller-orders";
import { getCourierByCode } from "@/lib/shipping/couriers";

type ActionResult = { success: boolean; message: string };

export async function registerTrackingNumberAction(
  orderId: string,
  formData: FormData,
): Promise<ActionResult> {
  const seller = await requireSeller();

  const courierCode = String(formData.get("courierCode") ?? "").trim();
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  if (!courierCode || !trackingNumber) {
    return { success: false, message: "택배사와 송장번호를 입력해 주세요." };
  }

  if (!getCourierByCode(courierCode)) {
    return { success: false, message: "지원하지 않는 택배사예요." };
  }

  const result = await registerSellerTrackingNumber({
    sellerUserId: seller.userId,
    orderId,
    courierCode,
    trackingNumber,
  });

  if (!result.success) {
    if (result.error === "not_found") {
      return { success: false, message: "주문 정보를 찾을 수 없어요." };
    }
    if (result.error === "invalid_status") {
      return { success: false, message: "송장을 등록할 수 없는 주문 상태예요." };
    }
    return { success: false, message: "송장 등록에 실패했어요." };
  }

  revalidatePath(`/seller/orders/${orderId}`);
  revalidatePath("/seller/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/mypage/orders");
  return { success: true, message: "송장이 등록됐어요." };
}

/** @deprecated Use registerTrackingNumberAction */
export async function registerTrackingNumber(orderId: string, formData: FormData) {
  const result = await registerTrackingNumberAction(orderId, formData);
  if (!result.success) {
    throw new Error(result.message);
  }
}
