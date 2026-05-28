"use server";

import { revalidatePath } from "next/cache";

import { requireSeller } from "@/lib/auth/require-seller";
import { registerSellerTrackingNumber } from "@/lib/data/seller-orders";
import { getCourierByCode } from "@/lib/shipping/couriers";

export async function registerTrackingNumber(orderId: string, formData: FormData) {
  const seller = await requireSeller();

  const courierCode = String(formData.get("courierCode") ?? "").trim();
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  if (!courierCode || !trackingNumber) {
    throw new Error("택배사와 송장번호를 입력해주세요.");
  }

  if (!getCourierByCode(courierCode)) {
    throw new Error("지원하지 않는 택배사입니다.");
  }

  const result = await registerSellerTrackingNumber({
    sellerUserId: seller.userId,
    orderId,
    courierCode,
    trackingNumber,
  });

  if (!result.success) {
    if (result.error === "not_found") {
      throw new Error("주문 정보를 찾을 수 없습니다.");
    }
    if (result.error === "invalid_status") {
      throw new Error("송장을 등록할 수 없는 주문 상태입니다.");
    }
    throw new Error("송장 등록에 실패했습니다.");
  }

  revalidatePath(`/seller/orders/${orderId}`);
  revalidatePath("/seller/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/mypage/orders");
}
