"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrderById } from "@/lib/data/orders";
import {
  canShowExchangeReturnButton,
  canShowOrderCancelButton,
} from "@/lib/orders/order-claims";

type OrderClaimResult = {
  ok: boolean;
  message: string;
};

/**
 * TODO: Wire to order cancellation workflow (payment void/refund, inventory restore).
 */
export async function requestOrderCancelAction(orderId: string): Promise<OrderClaimResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (!orderId.trim()) {
    return { ok: false, message: "주문 정보를 확인할 수 없어요." };
  }

  const order = await getUserOrderById(user.id, orderId);
  if (!order) {
    return { ok: false, message: "주문을 찾을 수 없어요." };
  }

  if (!canShowOrderCancelButton(order)) {
    return { ok: false, message: "배송 전 주문만 취소할 수 있어요." };
  }

  revalidatePath("/mypage/orders");
  return { ok: true, message: "주문 취소 요청이 접수됐어요. (처리 연동 준비 중)" };
}

/**
 * TODO: Wire to exchange/return claim workflow and support ticket creation.
 */
export async function requestExchangeReturnAction(orderId: string): Promise<OrderClaimResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (!orderId.trim()) {
    return { ok: false, message: "주문 정보를 확인할 수 없어요." };
  }

  const order = await getUserOrderById(user.id, orderId);
  if (!order) {
    return { ok: false, message: "주문을 찾을 수 없어요." };
  }

  if (!canShowExchangeReturnButton(order)) {
    return { ok: false, message: "배송 완료 후 교환/반품을 신청할 수 있어요." };
  }

  revalidatePath("/mypage/orders");
  return { ok: true, message: "교환/반품 신청이 접수됐어요. (처리 연동 준비 중)" };
}
