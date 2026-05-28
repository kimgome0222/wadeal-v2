"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrderById } from "@/lib/data/orders";
import {
  createSupportTicket,
  getSupportTicketByIdForAdmin,
  updateOrderCancelRequest,
  updateOrderRefundRequest,
  updateSupportTicketAdmin,
  type AdminUpdateSupportTicketInput,
} from "@/lib/data/support-tickets";
import { notifyRefundUpdated } from "@/lib/notifications/order-events";
import { notifySupportReply, notifySupportResolved } from "@/lib/notifications/support-events";
import {
  canRequestCancel,
  canRequestRefund,
  isSupportTicketStatus,
  isSupportTicketType,
  type SupportTicketStatus,
  type SupportTicketType,
} from "@/lib/support/ticket-rules";

export type CreateSupportTicketActionInput = {
  orderId?: string | null;
  productId?: string | null;
  dealId?: string | null;
  type: SupportTicketType;
  title: string;
  content: string;
};

export async function createSupportTicketAction(input: CreateSupportTicketActionInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (!isSupportTicketType(input.type)) {
    return { success: false, error: "invalid_input" as const };
  }

  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || !content) {
    return { success: false, error: "invalid_input" as const };
  }

  let orderId = input.orderId?.trim() || null;
  let productId = input.productId?.trim() || null;

  if (orderId) {
    const order = await getUserOrderById(user.id, orderId);
    if (!order) {
      return { success: false, error: "not_found" as const };
    }

    productId = productId ?? order.productId;
  }

  const result = await createSupportTicket({
    userId: user.id,
    orderId,
    productId,
    dealId: input.dealId?.trim() || null,
    type: input.type,
    title,
    content,
  });

  if (result.success) {
    revalidatePath("/support");
    revalidatePath("/mypage/orders");
  }

  return result;
}

export async function requestOrderCancelAction(input: {
  orderId: string;
  reason: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const order = await getUserOrderById(user.id, input.orderId);
  if (!order) {
    return { success: false, error: "not_found" as const };
  }

  if (!canRequestCancel(order)) {
    return { success: false, error: "not_eligible" as const };
  }

  const reason = input.reason.trim();
  if (!reason) {
    return { success: false, error: "invalid_input" as const };
  }

  const orderUpdate = await updateOrderCancelRequest(user.id, input.orderId, reason);
  if (!orderUpdate.success) {
    return orderUpdate;
  }

  const ticketResult = await createSupportTicket({
    userId: user.id,
    orderId: input.orderId,
    productId: order.productId,
    type: "cancel",
    title: `[취소 요청] ${order.productName}`,
    content: reason,
  });

  if (!ticketResult.success) {
    return ticketResult;
  }

  revalidatePath("/support");
  revalidatePath("/mypage/orders");

  return { success: true, ticketId: ticketResult.id };
}

export async function requestOrderRefundAction(input: {
  orderId: string;
  reason: string;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const order = await getUserOrderById(user.id, input.orderId);
  if (!order) {
    return { success: false, error: "not_found" as const };
  }

  if (!canRequestRefund(order)) {
    return { success: false, error: "not_eligible" as const };
  }

  const reason = input.reason.trim();
  if (!reason) {
    return { success: false, error: "invalid_input" as const };
  }

  const orderUpdate = await updateOrderRefundRequest(user.id, input.orderId, reason);
  if (!orderUpdate.success) {
    return orderUpdate;
  }

  const ticketResult = await createSupportTicket({
    userId: user.id,
    orderId: input.orderId,
    productId: order.productId,
    type: "refund",
    title: `[환불 요청] ${order.productName}`,
    content: reason,
  });

  if (!ticketResult.success) {
    return ticketResult;
  }

  revalidatePath("/support");
  revalidatePath("/mypage/orders");

  return { success: true, ticketId: ticketResult.id };
}

export async function adminReplySupportTicketAction(input: {
  ticketId: string;
  adminReply: string;
  status?: SupportTicketStatus;
}) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  const adminReply = input.adminReply.trim();
  if (!adminReply) {
    return { success: false, error: "invalid_input" as const };
  }

  const status = input.status ?? "answered";
  if (!isSupportTicketStatus(status)) {
    return { success: false, error: "invalid_input" as const };
  }

  const before = await getSupportTicketByIdForAdmin(input.ticketId);
  const result = await updateSupportTicketAdmin({
    ticketId: input.ticketId,
    adminReply,
    status,
  });

  if (!result.success || !result.ticket) {
    return result;
  }

  await logAdminAction({
    adminUserId: user.id,
    action: ADMIN_ACTIONS.SUPPORT_REPLY,
    targetType: ADMIN_TARGET_TYPES.SUPPORT_TICKET,
    targetId: input.ticketId,
    beforeData: before
      ? {
          ticketId: before.id,
          status: before.status,
          adminReply: before.adminReply,
          title: before.title,
        }
      : null,
    afterData: {
      ticketId: result.ticket.id,
      status: result.ticket.status,
      adminReply: result.ticket.adminReply,
      title: result.ticket.title,
    },
  });

  await notifySupportReply({
    userId: result.ticket.userId,
    ticketTitle: result.ticket.title,
    ticketId: result.ticket.id,
  });

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${input.ticketId}`);
  revalidatePath("/support");
  revalidatePath(`/support/${input.ticketId}`);
  revalidatePath("/notifications");

  return result;
}

export async function adminUpdateSupportTicketStatusAction(
  input: AdminUpdateSupportTicketInput,
) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  if (input.status && !isSupportTicketStatus(input.status)) {
    return { success: false, error: "invalid_input" as const };
  }

  const result = await updateSupportTicketAdmin(input);

  if (result.success && result.ticket) {
    if (input.status === "resolved" || input.status === "closed") {
      await notifySupportResolved({
        userId: result.ticket.userId,
        ticketTitle: result.ticket.title,
        ticketId: result.ticket.id,
      });
    }

    revalidatePath("/admin/support");
    revalidatePath(`/admin/support/${input.ticketId}`);
    revalidatePath("/support");
    revalidatePath(`/support/${input.ticketId}`);
    revalidatePath("/notifications");
  }

  return result;
}

export async function notifyOrderRefundStatusChange(input: {
  userId: string;
  productName: string;
}) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  await notifyRefundUpdated({
    userId: input.userId,
    productName: input.productName,
  });

  revalidatePath("/notifications");

  return { success: true as const };
}
