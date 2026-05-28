"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  calculateSettlementForDeal,
  cancelAdminSettlement,
  confirmAdminSettlement,
  getAdminSettlementById,
  markAdminSettlementPaid,
} from "@/lib/data/settlements";

type AdminSettlementActionResult = {
  success: boolean;
  message: string;
  settlementId?: string;
};

async function ensureAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; message: string }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, message: "로그인이 필요해요." };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, message: "관리자만 처리할 수 있어요." };
  }

  return { ok: true, userId: user.id };
}

function revalidateSettlementPaths(settlementId?: string) {
  revalidatePath("/admin/settlements");

  if (settlementId) {
    revalidatePath(`/admin/settlements/${settlementId}`);
  }
}

function settlementLogSnapshot(
  settlement: Awaited<ReturnType<typeof getAdminSettlementById>>,
) {
  if (!settlement) {
    return null;
  }

  return {
    settlementId: settlement.id,
    status: settlement.status,
    settlementAmount: settlement.settlementAmount,
    supplierId: settlement.supplierId,
    productId: settlement.productId,
    dealId: settlement.dealId,
  };
}

export async function calculateSettlementAction(
  dealId: string,
): Promise<AdminSettlementActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const result = await calculateSettlementForDeal(dealId);

  if (result.success) {
    revalidateSettlementPaths(result.settlementId);
    return {
      success: true,
      message: result.message ?? "정산이 생성됐어요.",
      settlementId: result.settlementId,
    };
  }

  const messages: Record<string, string> = {
    deal_not_found: "공동구매를 찾을 수 없어요.",
    no_supplier: "연결된 공급사가 없어요.",
    no_orders: "정산할 주문이 없어요.",
    not_finalized: "마감된 공동구매만 정산할 수 있어요.",
    not_configured: "Supabase 설정을 확인해 주세요.",
    save_failed: "정산 처리 중 오류가 발생했어요.",
  };

  return {
    success: false,
    message: result.message ?? messages[result.error ?? "save_failed"] ?? "정산에 실패했어요.",
  };
}

export async function confirmSettlementAction(
  settlementId: string,
): Promise<AdminSettlementActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const before = await getAdminSettlementById(settlementId);
  const result = await confirmAdminSettlement(settlementId);

  if (result.success) {
    const after = await getAdminSettlementById(settlementId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.SETTLEMENT_CONFIRM,
      targetType: ADMIN_TARGET_TYPES.SETTLEMENT,
      targetId: settlementId,
      beforeData: settlementLogSnapshot(before),
      afterData: settlementLogSnapshot(after),
    });
    revalidateSettlementPaths(settlementId);
    return { success: true, message: "정산이 확정됐어요.", settlementId };
  }

  return {
    success: false,
    message:
      result.error === "invalid_status"
        ? "대기 상태의 정산만 확정할 수 있어요."
        : "정산 확정에 실패했어요.",
  };
}

export async function markSettlementPaidAction(
  settlementId: string,
): Promise<AdminSettlementActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const before = await getAdminSettlementById(settlementId);
  const result = await markAdminSettlementPaid(settlementId);

  if (result.success) {
    const after = await getAdminSettlementById(settlementId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.SETTLEMENT_PAID,
      targetType: ADMIN_TARGET_TYPES.SETTLEMENT,
      targetId: settlementId,
      beforeData: settlementLogSnapshot(before),
      afterData: settlementLogSnapshot(after),
    });
    revalidateSettlementPaths(settlementId);
    return { success: true, message: "지급 완료로 변경했어요.", settlementId };
  }

  return {
    success: false,
    message:
      result.error === "invalid_status"
        ? "확정된 정산만 지급 완료 처리할 수 있어요."
        : "지급 처리에 실패했어요.",
  };
}

export async function cancelSettlementAction(
  settlementId: string,
): Promise<AdminSettlementActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const result = await cancelAdminSettlement(settlementId);

  if (result.success) {
    revalidateSettlementPaths(settlementId);
    return { success: true, message: "정산이 취소됐어요.", settlementId };
  }

  return {
    success: false,
    message:
      result.error === "invalid_status"
        ? "현재 상태에서는 취소할 수 없어요."
        : "정산 취소에 실패했어요.",
  };
}
