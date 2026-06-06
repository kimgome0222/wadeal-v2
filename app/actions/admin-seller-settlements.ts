"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  adminConfirmSellerSettlement,
  adminMarkSellerSettlementPaid,
  adminRejectSellerSettlementPayout,
  generateSellerSettlementRecord,
  getAdminSellerSettlementRecords,
} from "@/lib/data/seller-settlement-records";
import { getSellerById } from "@/lib/data/sellers";
import {
  notifySellerSettlementConfirmed,
  notifySellerSettlementPaid,
  notifySellerSettlementPayoutRejected,
} from "@/lib/notifications/seller-events";
import { formatSettlementPeriod } from "@/lib/settlements/seller-settlement-types";

type ActionResult = { success: boolean; message: string };

export async function adminConfirmSellerSettlementAction(
  recordId: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자 권한이 필요해요." };
  }

  const result = await adminConfirmSellerSettlement(recordId);
  if (!result.success) {
    return { success: false, message: "정산 확정에 실패했어요." };
  }

  if (result.sellerId) {
    await notifySellerSettlementConfirmed({
      sellerId: result.sellerId,
      periodLabel: "정산",
    });
  }

  revalidatePath("/admin/settlements");
  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "판매자 정산이 확정됐어요." };
}

export async function adminPaySellerSettlementAction(recordId: string): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자 권한이 필요해요." };
  }

  const result = await adminMarkSellerSettlementPaid(recordId);
  if (!result.success) {
    return { success: false, message: "입금 완료 처리에 실패했어요." };
  }

  if (result.sellerId && result.netPayoutAmount != null) {
    await notifySellerSettlementPaid({
      sellerId: result.sellerId,
      amount: result.netPayoutAmount,
      receiptReference: null,
    });
  }

  revalidatePath("/admin/settlements");
  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "입금 완료 처리됐어요." };
}

export async function adminRejectSellerSettlementPayoutAction(
  recordId: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자 권한이 필요해요." };
  }

  const rejectReason = formData.get("rejectReason")?.toString().trim() ?? "";
  if (!rejectReason) {
    return { success: false, message: "거절 사유를 입력해 주세요." };
  }

  const result = await adminRejectSellerSettlementPayout(recordId, rejectReason);
  if (!result.success) {
    return { success: false, message: "출금요청 거절 처리에 실패했어요." };
  }

  if (result.sellerId) {
    await notifySellerSettlementPayoutRejected({
      sellerId: result.sellerId,
      reason: rejectReason,
    });
  }

  revalidatePath("/admin/settlements");
  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "출금요청을 거절했어요." };
}

export async function adminRejectSellerSettlementPayoutFormAction(
  recordId: string,
  formData: FormData,
): Promise<void> {
  await adminRejectSellerSettlementPayoutAction(recordId, formData);
}

export async function adminGenerateSellerSettlementAction(input: {
  sellerId: string;
  periodStart: string;
  periodEnd: string;
}): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, message: "관리자 권한이 필요해요." };
  }

  const seller = await getSellerById(input.sellerId);
  if (!seller) {
    return { success: false, message: "판매자를 찾을 수 없어요." };
  }

  const result = await generateSellerSettlementRecord({
    sellerId: seller.id,
    sellerUserId: seller.userId,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
  });

  if (!result.success || !result.recordId) {
    return { success: false, message: "정산 명세 생성에 실패했어요." };
  }

  await notifySellerSettlementConfirmed({
    sellerId: seller.id,
    periodLabel: formatSettlementPeriod(input.periodStart, input.periodEnd),
    recordId: result.recordId,
  });

  revalidatePath("/admin/settlements");
  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "판매자 정산 명세가 생성됐어요." };
}

export async function loadAdminSellerSettlementRecordsAction() {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return [];
  }

  return getAdminSellerSettlementRecords();
}
