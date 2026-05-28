import { shouldUseMockData } from "@/lib/env/runtime";
import type { SupportTicketRow } from "@/lib/database/types";
import type { SupportTicketListItem } from "@/lib/data/support-tickets-shared";
import { countOpenEscalatedSupportTickets } from "@/lib/data/support-tickets-shared";
import {
  buildMypagePaginatedResult,
  paginateArray,
  resolveMypagePagination,
  type MypagePaginatedResult,
  type MypagePaginationOptions,
} from "@/lib/pagination/mypage";
import {
  isSupportTicketStatus,
  isSupportTicketType,
  normalizeSupportTicketStatus,
  normalizeSupportTicketType,
  type SupportTicketStatus,
  type SupportTicketType,
} from "@/lib/support/ticket-rules";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type {
  SupportTicketEscalatedFilter,
  SupportTicketListItem,
  SupportTicketStatusFilter,
  SupportTicketTypeFilter,
} from "@/lib/data/support-tickets-shared";

export {
  countOpenEscalatedSupportTickets,
  filterSupportTickets,
  isEscalatedSupportTicket,
  parseSupportEscalatedFilter,
  parseSupportStatusFilter,
  parseSupportTypeFilter,
} from "@/lib/data/support-tickets-shared";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[support-tickets] using mock fallback: ${context}`);
  }
}

export type CreateSupportTicketInput = {
  userId: string;
  orderId?: string | null;
  productId?: string | null;
  dealId?: string | null;
  type: SupportTicketType;
  title: string;
  content: string;
};

export type CreateSupportTicketResult = {
  success: boolean;
  id?: string;
  error?: "invalid_input" | "save_failed" | "not_found" | "forbidden";
};

export type AdminUpdateSupportTicketInput = {
  ticketId: string;
  status?: SupportTicketStatus;
  adminReply?: string | null;
};

export type AdminUpdateSupportTicketResult = {
  success: boolean;
  ticket?: SupportTicketListItem;
  error?: "invalid_input" | "not_found" | "save_failed";
};

const mockSupportTickets: SupportTicketListItem[] = [
  {
    id: "mock-ticket-1",
    userId: "00000000-0000-4000-8000-000000000001",
    orderId: "mock-order-2",
    productId: "wd-vacuum-001",
    dealId: null,
    type: "shipping",
    title: "배송 일정 문의",
    content: "언제쯤 발송되나요?",
    status: "answered",
    adminReply: "내일 출고 예정입니다.",
    createdAt: "2026-05-22T10:00:00.000Z",
    createdAtLabel: "2026.05.22",
    updatedAt: "2026-05-22T12:00:00.000Z",
    resolvedAt: null,
    orderProductName: "초경량 무선 청소기",
  },
];

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function mapSupportTicketRow(row: Record<string, unknown>): SupportTicketListItem {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    orderId: (row.order_id as string | null) ?? null,
    productId: (row.product_id as string | null) ?? null,
    dealId: (row.deal_id as string | null) ?? null,
    type: normalizeSupportTicketType(row.type as string | undefined),
    title: row.title as string,
    content: row.content as string,
    status: normalizeSupportTicketStatus(row.status as string | undefined),
    adminReply: (row.admin_reply as string | null) ?? null,
    createdAt: row.created_at as string,
    createdAtLabel: formatDateLabel(row.created_at as string),
    updatedAt: row.updated_at as string,
    resolvedAt: (row.resolved_at as string | null) ?? null,
    orderProductName: (row.order_product_name as string | null | undefined) ?? null,
  };
}

function getMockTicketsForUser(userId: string): SupportTicketListItem[] {
  return mockSupportTickets
    .filter((ticket) => ticket.userId === userId)
    .map((ticket) => ({ ...ticket }));
}

function getMockTicketById(ticketId: string): SupportTicketListItem | null {
  const ticket = mockSupportTickets.find((item) => item.id === ticketId);
  return ticket ? { ...ticket } : null;
}

export async function createSupportTicket(
  input: CreateSupportTicketInput,
): Promise<CreateSupportTicketResult> {
  const title = input.title.trim();
  const content = input.content.trim();

  if (!title || !content || !isSupportTicketType(input.type)) {
    return { success: false, error: "invalid_input" };
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const id = `mock-ticket-${Date.now()}`;
      mockSupportTickets.unshift({
        id,
        userId: input.userId,
        orderId: input.orderId ?? null,
        productId: input.productId ?? null,
        dealId: input.dealId ?? null,
        type: input.type,
        title,
        content,
        status: "open",
        adminReply: null,
        createdAt: now,
        createdAtLabel: formatDateLabel(now),
        updatedAt: now,
        resolvedAt: null,
      });
      return { success: true, id };
    }

    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: input.userId,
      order_id: input.orderId ?? null,
      product_id: input.productId ?? null,
      deal_id: input.dealId ?? null,
      type: input.type,
      title,
      content,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[support-tickets] createSupportTicket:", error.message);
    }
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function getSupportTicketsForUser(userId: string): Promise<SupportTicketListItem[]>;
export async function getSupportTicketsForUser(
  userId: string,
  options: MypagePaginationOptions,
): Promise<MypagePaginatedResult<SupportTicketListItem>>;
export async function getSupportTicketsForUser(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<SupportTicketListItem[] | MypagePaginatedResult<SupportTicketListItem>> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getSupportTicketsForUser");
      const all = getMockTicketsForUser(userId);
      if (options) {
        return paginateArray(all, options);
      }
      return all;
    }
    return options ? buildMypagePaginatedResult([], 0, 1, options.pageSize ?? 10) : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      const all = getMockTicketsForUser(userId);
      if (options) {
        return paginateArray(all, options);
      }
      return all;
    }
    return options ? buildMypagePaginatedResult([], 0, 1, options.pageSize ?? 10) : [];
  }

  let query = supabase
    .from("support_tickets")
    .select(
      "id, user_id, order_id, product_id, deal_id, type, title, content, status, admin_reply, created_at, updated_at, resolved_at",
      options ? { count: "exact" } : undefined,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options) {
    const { pageSize, offset } = resolveMypagePagination(options);
    query = query.range(offset, offset + pageSize - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[support-tickets] getSupportTicketsForUser:", error.message);
    }
    if (shouldUseMockData()) {
      const all = getMockTicketsForUser(userId);
      if (options) {
        return paginateArray(all, options);
      }
      return all;
    }
    return options ? buildMypagePaginatedResult([], 0, 1, options.pageSize ?? 10) : [];
  }

  const items = (data ?? []).map((row) => mapSupportTicketRow(row as Record<string, unknown>));

  if (options) {
    const { page, pageSize } = resolveMypagePagination(options);
    return buildMypagePaginatedResult(items, count ?? items.length, page, pageSize);
  }

  return items;
}

export async function getSupportTicketByIdForUser(
  userId: string,
  ticketId: string,
): Promise<SupportTicketListItem | null> {
  if (ticketId.startsWith("mock-ticket-")) {
    const ticket = getMockTicketById(ticketId);
    return ticket?.userId === userId ? ticket : null;
  }

  const tickets = await getSupportTicketsForUser(userId);
  return tickets.find((ticket) => ticket.id === ticketId) ?? null;
}

export async function countOpenEscalatedSupportTicketsForAdmin(): Promise<number> {
  const tickets = await getAllSupportTicketsForAdmin();
  return countOpenEscalatedSupportTickets(tickets);
}

export async function getAllSupportTicketsForAdmin(): Promise<SupportTicketListItem[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getAllSupportTicketsForAdmin");
      return mockSupportTickets.map((ticket) => ({ ...ticket }));
    }
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      return mockSupportTickets.map((ticket) => ({ ...ticket }));
    }
    return [];
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      "id, user_id, order_id, product_id, deal_id, type, title, content, status, admin_reply, created_at, updated_at, resolved_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[support-tickets] getAllSupportTicketsForAdmin:", error.message);
    }
    if (shouldUseMockData()) {
      return mockSupportTickets.map((ticket) => ({ ...ticket }));
    }
    return [];
  }

  return (data ?? []).map((row) => mapSupportTicketRow(row as Record<string, unknown>));
}

export async function getSupportTicketByIdForAdmin(
  ticketId: string,
): Promise<SupportTicketListItem | null> {
  if (ticketId.startsWith("mock-ticket-")) {
    return getMockTicketById(ticketId);
  }

  const tickets = await getAllSupportTicketsForAdmin();
  return tickets.find((ticket) => ticket.id === ticketId) ?? null;
}

export async function updateSupportTicketAdmin(
  input: AdminUpdateSupportTicketInput,
): Promise<AdminUpdateSupportTicketResult> {
  if (input.status && !isSupportTicketStatus(input.status)) {
    return { success: false, error: "invalid_input" };
  }

  const existing =
    input.ticketId.startsWith("mock-ticket-") ?
      getMockTicketById(input.ticketId)
    : await getSupportTicketByIdForAdmin(input.ticketId);

  if (!existing) {
    return { success: false, error: "not_found" };
  }

  const now = new Date().toISOString();
  const nextStatus = input.status ?? existing.status;
  const nextReply =
    input.adminReply !== undefined ? input.adminReply?.trim() || null : existing.adminReply;
  const resolvedAt =
    nextStatus === "resolved" || nextStatus === "closed" ?
      existing.resolvedAt ?? now
    : existing.resolvedAt;

  if (input.ticketId.startsWith("mock-ticket-")) {
    const index = mockSupportTickets.findIndex((item) => item.id === input.ticketId);
    if (index === -1) {
      return { success: false, error: "not_found" };
    }

    mockSupportTickets[index] = {
      ...mockSupportTickets[index],
      status: nextStatus,
      adminReply: nextReply,
      updatedAt: now,
      resolvedAt,
    };

    return { success: true, ticket: { ...mockSupportTickets[index] } };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, ticket: existing };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const patch: Partial<SupportTicketRow> = {
    updated_at: now,
  };

  if (input.status) {
    patch.status = input.status;
  }

  if (input.adminReply !== undefined) {
    patch.admin_reply = nextReply;
  }

  if (resolvedAt) {
    patch.resolved_at = resolvedAt;
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .update(patch as Partial<SupportTicketRow>)
    .eq("id", input.ticketId)
    .select(
      "id, user_id, order_id, product_id, deal_id, type, title, content, status, admin_reply, created_at, updated_at, resolved_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[support-tickets] updateSupportTicketAdmin:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return {
    success: true,
    ticket: mapSupportTicketRow(data as Record<string, unknown>),
  };
}

export async function updateOrderCancelRequest(
  userId: string,
  orderId: string,
  reason: string,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" | "forbidden" }> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "save_failed" };
  }

  if (orderId.startsWith("mock-order-")) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ cancel_reason: trimmedReason })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[support-tickets] updateOrderCancelRequest:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export async function updateOrderRefundRequest(
  userId: string,
  orderId: string,
  reason: string,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" | "forbidden" }> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();

  if (orderId.startsWith("mock-order-")) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      refund_reason: trimmedReason,
      refund_requested_at: now,
    })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[support-tickets] updateOrderRefundRequest:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}
