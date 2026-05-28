"use server";

import { revalidatePath } from "next/cache";

import {
  notifySellerSettlementPaid,
} from "@/app/actions/seller-finance";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  adminConfirmSellerSettlement,
  adminMarkSellerSettlementPaid,
  generateSellerSettlementRecord,
  getAdminSellerSettlementRecords,
} from "@/lib/data/seller-settlement-records";
import { getSellerById } from "@/lib/data/sellers";
import { createNotification } from "@/lib/notifications/create";
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

  if (result.sellerUserId) {
    await createNotification(
      result.sellerUserId,
      "settlement_ready",
      "정산이 확정됐어요",
      "관리자가 정산을 확정했어요. 입금 일정을 확인해 주세요.",
      "/seller/finance/settlements",
    );
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

  if (result.sellerUserId && result.netPayoutAmount != null) {
    await notifySellerSettlementPaid(result.sellerUserId, result.netPayoutAmount, null);
  }

  revalidatePath("/admin/settlements");
  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "입금 완료 처리됐어요." };
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

  await createNotification(
    seller.userId,
    "settlement_ready",
    "정산 내역 확인 요청",
    `${formatSettlementPeriod(input.periodStart, input.periodEnd)} 정산 내역을 확인해 주세요.`,
    `/seller/finance/settlements?record=${result.recordId}`,
  );

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
