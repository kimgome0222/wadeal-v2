"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  approveAdminSellerProductRequest,
  rejectAdminSellerProductRequest,
} from "@/lib/data/admin-seller-product-requests";

type ActionResult = { success: boolean; message: string };

export async function approveSellerProductRequestAction(
  requestId: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자만 승인할 수 있어요." };
  }

  const result = await approveAdminSellerProductRequest(requestId, user.id);
  if (!result.success) {
    const messages: Record<string, string> = {
      not_found: "요청을 찾을 수 없어요.",
      invalid_state: "승인할 수 없는 상태예요.",
      invalid_input: "요청 정보가 올바르지 않아요.",
      seller_not_found: "판매자 정보를 찾을 수 없어요.",
      checklist_incomplete: "상품 검수 체크리스트를 확인해 주세요.",
      save_failed: "승인 처리에 실패했어요.",
      approve_failed: "상품 승인에 실패했어요.",
    };
    return {
      success: false,
      message: messages[result.error ?? "save_failed"] ?? "승인 처리에 실패했어요.",
    };
  }

  revalidatePath("/admin/product-requests");
  revalidatePath("/admin/seller-product-requests");
  revalidatePath("/admin/products");
  revalidatePath("/seller/products");
  revalidatePath("/seller/product-requests");
  return { success: true, message: "상품 등록 요청을 승인했어요." };
}

export async function rejectSellerProductRequestAction(
  requestId: string,
  reason: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자만 반려할 수 있어요." };
  }

  const result = await rejectAdminSellerProductRequest(requestId, user.id, reason);
  if (!result.success) {
    if (result.error === "invalid_input") {
      return { success: false, message: "반려 사유를 입력해 주세요." };
    }
    if (result.error === "not_found") {
      return { success: false, message: "요청을 찾을 수 없어요." };
    }
    if (result.error === "invalid_state") {
      return { success: false, message: "반려할 수 없는 상태예요." };
    }
    return { success: false, message: "반려 처리에 실패했어요." };
  }

  revalidatePath("/admin/product-requests");
  revalidatePath("/admin/seller-product-requests");
  revalidatePath("/seller/product-requests");
  return { success: true, message: "상품 등록 요청을 반려했어요." };
}
