"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  approveRefundRequest,
  rejectRefundRequest,
} from "@/lib/data/refunds";

type ActionResult = {
  ok: boolean;
  message: string;
};

export async function approveRefundRequestAction(refundId: string): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { ok: false, message: "관리자만 처리할 수 있어요." };
  }

  if (!refundId.trim()) {
    return { ok: false, message: "환불 요청 정보를 확인할 수 없어요." };
  }

  const result = await approveRefundRequest({
    refundId,
    adminUserId: user.id,
  });

  if (!result.ok) {
    const message =
      result.error === "already_processed" ? "이미 처리된 요청이에요."
      : result.error === "not_found" ? "환불 요청을 찾을 수 없어요."
      : "승인 처리에 실패했어요.";
    return { ok: false, message };
  }

  revalidatePath("/admin/refunds");
  revalidatePath("/admin/orders");
  revalidatePath("/mypage/orders");
  revalidatePath("/notifications");

  return { ok: true, message: "환불/취소 요청을 승인했어요." };
}

export async function rejectRefundRequestAction(
  refundId: string,
  rejectedReason: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { ok: false, message: "관리자만 처리할 수 있어요." };
  }

  if (!refundId.trim()) {
    return { ok: false, message: "환불 요청 정보를 확인할 수 없어요." };
  }

  const result = await rejectRefundRequest({
    refundId,
    adminUserId: user.id,
    rejectedReason,
  });

  if (!result.ok) {
    const message =
      result.error === "invalid_input" ? "반려 사유를 입력해 주세요."
      : result.error === "already_processed" ? "이미 처리된 요청이에요."
      : result.error === "not_found" ? "환불 요청을 찾을 수 없어요."
      : "반려 처리에 실패했어요.";
    return { ok: false, message };
  }

  revalidatePath("/admin/refunds");
  revalidatePath("/admin/orders");
  revalidatePath("/mypage/orders");
  revalidatePath("/notifications");

  return { ok: true, message: "환불/취소 요청을 반려했어요." };
}
