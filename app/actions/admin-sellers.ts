"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { upsertSellerReviewChecksAdmin } from "@/lib/data/seller-review";
import { updateSellerStatusAdmin } from "@/lib/data/sellers";
import type { SellerReviewCheckKey } from "@/lib/sellers/review-checklist";
import type { SellerStatus } from "@/lib/sellers/types";
import { isSellerStatus } from "@/lib/sellers/types";

async function ensureAdmin() {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false as const, message: "로그인이 필요해요." };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false as const, message: "관리자만 처리할 수 있어요." };
  }

  return { ok: true as const };
}

export async function saveSellerReviewChecksAction(input: {
  sellerId: string;
  checks: Partial<Record<SellerReviewCheckKey, boolean>>;
}) {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, message: "로그인이 필요해요." };
  }

  const result = await upsertSellerReviewChecksAdmin(input.sellerId, input.checks, user.id);
  if (!result.success) {
    return { success: false as const, message: "체크리스트 저장에 실패했어요." };
  }

  revalidatePath(`/admin/sellers/${input.sellerId}/review`);
  return { success: true as const, message: "체크리스트를 저장했어요." };
}

export async function reviewSellerApplicationAction(input: {
  sellerId: string;
  decision: "approved" | "rejected" | "suspended" | "under_review";
  rejectedReason?: string;
}) {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false as const, message: auth.message };
  }

  if (!isSellerStatus(input.decision)) {
    return { success: false as const, message: "잘못된 상태값이에요." };
  }

  const result = await updateSellerStatusAdmin(input.sellerId, input.decision as SellerStatus, {
    rejectedReason: input.rejectedReason,
  });

  if (!result.success) {
    return { success: false as const, message: "판매자 상태 변경에 실패했어요." };
  }

  revalidatePath("/admin/sellers");
  revalidatePath(`/admin/sellers/${input.sellerId}/review`);
  revalidatePath("/seller");

  const messages: Record<string, string> = {
    approved: "판매자를 승인했어요.",
    rejected: "판매자 신청을 반려했어요.",
    suspended: "판매자 계정을 정지했어요.",
    under_review: "보완 심사 상태로 변경했어요.",
  };

  return { success: true as const, message: messages[input.decision] ?? "처리했어요." };
}
