"use server";

import { revalidatePath } from "next/cache";

import { ADMIN_ACTIONS, ADMIN_TARGET_TYPES } from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  createSellerNotice,
  getAdminSellerNoticeById,
  setSellerNoticeStatus,
  updateSellerNotice,
  type SellerNoticeInput,
} from "@/lib/data/seller-notices";
import { notifyAllSellersNoticePublished } from "@/lib/notifications/seller-events";
import { isSellerNoticeCategory } from "@/lib/sellers/notice-types";

type ActionResult = { success: boolean; message: string; id?: string };

async function ensureAdmin() {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false as const, error: "login_required" as const };
  }
  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return { ok: false as const, error: "forbidden" as const };
  }
  return { ok: true as const, userId: user.id };
}

function parseInput(input: {
  title: string;
  content: string;
  category: string;
  isImportant?: boolean;
  attachmentUrls?: string[];
}): SellerNoticeInput | null {
  if (!isSellerNoticeCategory(input.category)) {
    return null;
  }
  return {
    title: input.title,
    content: input.content,
    category: input.category,
    isImportant: input.isImportant ?? false,
    attachmentUrls: input.attachmentUrls ?? [],
  };
}

export async function createAdminSellerNoticeAction(input: {
  title: string;
  content: string;
  category: string;
  isImportant?: boolean;
}): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: "권한이 없어요." };
  }

  const parsed = parseInput(input);
  if (!parsed) {
    return { success: false, message: "입력값을 확인해 주세요." };
  }

  const result = await createSellerNotice(auth.userId, parsed);
  if (!result.success || !result.id) {
    return { success: false, message: "공지 저장에 실패했어요." };
  }

  await logAdminAction({
    adminUserId: auth.userId,
    action: ADMIN_ACTIONS.SELLER_NOTICE_CREATE,
    targetType: ADMIN_TARGET_TYPES.SELLER_NOTICE,
    targetId: result.id,
    afterData: parsed,
  });

  revalidatePath("/admin/seller-notices");
  return { success: true, message: "임시저장됐어요.", id: result.id };
}

export async function updateAdminSellerNoticeAction(input: {
  noticeId: string;
  title: string;
  content: string;
  category: string;
  isImportant?: boolean;
}): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: "권한이 없어요." };
  }

  const before = await getAdminSellerNoticeById(input.noticeId);
  const parsed = parseInput(input);
  if (!parsed || !before) {
    return { success: false, message: "입력값을 확인해 주세요." };
  }

  const result = await updateSellerNotice(input.noticeId, parsed);
  if (!result.success) {
    return { success: false, message: "공지 수정에 실패했어요." };
  }

  await logAdminAction({
    adminUserId: auth.userId,
    action: ADMIN_ACTIONS.SELLER_NOTICE_UPDATE,
    targetType: ADMIN_TARGET_TYPES.SELLER_NOTICE,
    targetId: input.noticeId,
    beforeData: before,
    afterData: parsed,
  });

  revalidatePath("/admin/seller-notices");
  revalidatePath(`/admin/seller-notices/${input.noticeId}/edit`);
  revalidatePath("/seller/notices");
  return { success: true, message: "수정됐어요." };
}

export async function publishAdminSellerNoticeAction(noticeId: string): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: "권한이 없어요." };
  }

  const result = await setSellerNoticeStatus(noticeId, "published");
  if (!result.success || !result.notice) {
    return { success: false, message: "게시에 실패했어요." };
  }

  await notifyAllSellersNoticePublished({
    noticeId: result.notice.id,
    title: result.notice.title,
  });

  await logAdminAction({
    adminUserId: auth.userId,
    action: ADMIN_ACTIONS.SELLER_NOTICE_PUBLISH,
    targetType: ADMIN_TARGET_TYPES.SELLER_NOTICE,
    targetId: noticeId,
    afterData: { status: "published" },
  });

  revalidatePath("/admin/seller-notices");
  revalidatePath("/seller/notices");
  revalidatePath("/seller/dashboard");
  return { success: true, message: "게시됐어요. 판매자 알림을 발송했어요." };
}

export async function archiveAdminSellerNoticeAction(noticeId: string): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: "권한이 없어요." };
  }

  const result = await setSellerNoticeStatus(noticeId, "archived");
  if (!result.success) {
    return { success: false, message: "보관 처리에 실패했어요." };
  }

  await logAdminAction({
    adminUserId: auth.userId,
    action: ADMIN_ACTIONS.SELLER_NOTICE_ARCHIVE,
    targetType: ADMIN_TARGET_TYPES.SELLER_NOTICE,
    targetId: noticeId,
    afterData: { status: "archived" },
  });

  revalidatePath("/admin/seller-notices");
  revalidatePath("/seller/notices");
  return { success: true, message: "보관됐어요." };
}
