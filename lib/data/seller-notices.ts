import { shouldUseMockData } from "@/lib/env/runtime";
import {
  getSellerNoticeCategoryLabel,
  getSellerNoticeStatusLabel,
  isSellerNoticeCategory,
  isSellerNoticeStatus,
  type SellerNoticeCategory,
  type SellerNoticeStatus,
} from "@/lib/sellers/notice-types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type SellerNoticeRecord = {
  id: string;
  title: string;
  content: string;
  category: SellerNoticeCategory;
  categoryLabel: string;
  isImportant: boolean;
  attachmentUrls: string[];
  status: SellerNoticeStatus;
  statusLabel: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type SellerNoticeListFilter = {
  category?: SellerNoticeCategory | "all";
  query?: string;
};

export type SellerNoticeInput = {
  title: string;
  content: string;
  category: SellerNoticeCategory;
  isImportant?: boolean;
  attachmentUrls?: string[];
};

const mockNotices: SellerNoticeRecord[] = [
  {
    id: "mock-notice-1",
    title: "3월 정산 일정 안내",
    content: "3월 정산 내역은 4월 5일까지 확인해 주세요.",
    category: "settlement",
    categoryLabel: "정산",
    isImportant: true,
    attachmentUrls: [],
    status: "published",
    statusLabel: "게시됨",
    createdBy: null,
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T09:00:00.000Z",
    publishedAt: "2026-03-01T09:00:00.000Z",
  },
];

function parseAttachmentUrls(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function mapNoticeRow(row: Record<string, unknown>): SellerNoticeRecord {
  const category = row.category as string;
  const status = row.status as string;
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    category: isSellerNoticeCategory(category) ? category : "general",
    categoryLabel: getSellerNoticeCategoryLabel(category),
    isImportant: Boolean(row.is_important),
    attachmentUrls: parseAttachmentUrls(row.attachment_urls),
    status: isSellerNoticeStatus(status) ? status : "draft",
    statusLabel: getSellerNoticeStatusLabel(status),
    createdBy: (row.created_by as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    publishedAt: (row.published_at as string | null) ?? null,
  };
}

function applyListFilter(
  items: SellerNoticeRecord[],
  filter: SellerNoticeListFilter,
): SellerNoticeRecord[] {
  let result = items;
  if (filter.category && filter.category !== "all") {
    result = result.filter((item) => item.category === filter.category);
  }
  const query = filter.query?.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query),
    );
  }
  return result;
}

export async function getPublishedSellerNotices(
  filter: SellerNoticeListFilter = {},
  limit = 50,
): Promise<SellerNoticeRecord[]> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ?
        applyListFilter(mockNotices, filter).slice(0, limit)
      : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("seller_notices")
    .select("*")
    .eq("status", "published")
    .order("is_important", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (filter.category && filter.category !== "all") {
    query = query.eq("category", filter.category);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("[seller-notices] getPublishedSellerNotices:", error?.message);
    return [];
  }

  const items = data.map((row) => mapNoticeRow(row as Record<string, unknown>));
  return applyListFilter(items, filter);
}

export async function getRecentPublishedSellerNotices(limit = 5): Promise<SellerNoticeRecord[]> {
  return getPublishedSellerNotices({}, limit);
}

export async function getPublishedSellerNoticeById(id: string): Promise<SellerNoticeRecord | null> {
  if (!isSupabaseConfigured()) {
    return mockNotices.find((item) => item.id === id) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("seller_notices")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapNoticeRow(data as Record<string, unknown>);
}

export async function getAdminSellerNotices(): Promise<SellerNoticeRecord[]> {
  if (!isSupabaseConfigured()) {
    return mockNotices;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("seller_notices")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("[seller-notices] getAdminSellerNotices:", error?.message);
    return [];
  }

  return data.map((row) => mapNoticeRow(row as Record<string, unknown>));
}

export async function getAdminSellerNoticeById(id: string): Promise<SellerNoticeRecord | null> {
  if (!isSupabaseConfigured()) {
    return mockNotices.find((item) => item.id === id) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("seller_notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapNoticeRow(data as Record<string, unknown>);
}

export async function createSellerNotice(
  adminUserId: string,
  input: SellerNoticeInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || !content || !isSellerNoticeCategory(input.category)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-notice-new" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("seller_notices")
    .insert({
      title,
      content,
      category: input.category,
      is_important: input.isImportant ?? false,
      attachment_urls: input.attachmentUrls ?? [],
      status: "draft",
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[seller-notices] create:", error?.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function updateSellerNotice(
  noticeId: string,
  input: SellerNoticeInput,
): Promise<{ success: boolean; error?: string }> {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || !content || !isSellerNoticeCategory(input.category)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("seller_notices")
    .update({
      title,
      content,
      category: input.category,
      is_important: input.isImportant ?? false,
      attachment_urls: input.attachmentUrls ?? [],
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", noticeId);

  if (error) {
    console.error("[seller-notices] update:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function setSellerNoticeStatus(
  noticeId: string,
  status: SellerNoticeStatus,
): Promise<{ success: boolean; notice?: SellerNoticeRecord; error?: string }> {
  if (!isSellerNoticeStatus(status)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    const notice = mockNotices.find((item) => item.id === noticeId);
    return { success: true, notice };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    status,
    updated_at: now,
  };
  if (status === "published") {
    payload.published_at = now;
  }

  const { data, error } = await supabase
    .from("seller_notices")
    .update(payload as never)
    .eq("id", noticeId)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[seller-notices] setStatus:", error?.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, notice: mapNoticeRow(data as Record<string, unknown>) };
}

export async function getApprovedSellerIds(): Promise<string[]> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("sellers")
    .select("id")
    .eq("status", "approved");

  return (data ?? []).map((row) => row.id as string);
}
