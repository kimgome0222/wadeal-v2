"use server";

import { revalidatePath } from "next/cache";

import {
  buildFallbackOrderTimeline,
  getOrderTimelines,
} from "@/lib/data/order-timelines";
import {
  submitExchangeReturnRequest,
  submitOrderCancelRequest,
} from "@/lib/data/order-claims";
import { getServerAuthUser } from "@/lib/auth/server-session";

type OrderClaimResult = {
  ok: boolean;
  message: string;
};

export async function requestOrderCancelAction(orderId: string): Promise<OrderClaimResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (!orderId.trim()) {
    return { ok: false, message: "주문 정보를 확인할 수 없어요." };
  }

  const result = await submitOrderCancelRequest(user.id, orderId);
  if (result.ok) {
    revalidatePath("/mypage/orders");
  }

  return result;
}

export async function requestExchangeReturnAction(orderId: string): Promise<OrderClaimResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (!orderId.trim()) {
    return { ok: false, message: "주문 정보를 확인할 수 없어요." };
  }

  const result = await submitExchangeReturnRequest(user.id, orderId);
  if (result.ok) {
    revalidatePath("/mypage/orders");
  }

  return result;
}

export async function getOrderTimelinesAction(orderId: string) {
  const user = await getServerAuthUser();
  if (!user || !orderId.trim()) {
    return [];
  }

  const entries = await getOrderTimelines(orderId);
  if (entries.length > 0) {
    return entries;
  }

  const { getUserOrderById } = await import("@/lib/data/orders");
  const order = await getUserOrderById(user.id, orderId);
  if (!order) {
    return [];
  }

  return buildFallbackOrderTimeline(order);
}
