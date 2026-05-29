"use server";

import { revalidatePath } from "next/cache";

import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  confirmSellerSettlementRecord,
  getSellerSettlementRecordById,
  requestSellerSettlementPayout,
} from "@/lib/data/seller-settlement-records";
import {
  createSellerBilling,
  paySellerBillingWithToss,
} from "@/lib/data/seller-billings";
import { updateSellerBankAccount } from "@/lib/data/sellers";
import { notifyAdminSettlementPending } from "@/lib/notifications/admin-events";
import {
  validateBankAccountInput,
  verifyBankAccountHolder,
} from "@/lib/sellers/bank-account";
import type { SellerBillingPaymentMode } from "@/lib/settlements/seller-settlement-types";

type ActionResult = { success: boolean; message: string };

export async function confirmSellerSettlementAction(
  recordId: string,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const record = await getSellerSettlementRecordById(seller.id, recordId);
  if (!record) {
    return { success: false, message: "정산 내역을 찾을 수 없어요." };
  }

  const result = await confirmSellerSettlementRecord(seller.id, recordId);
  if (!result.success) {
    return { success: false, message: "확인 처리에 실패했어요." };
  }

  await notifyAdminSettlementPending({
    sellerName: seller.companyName,
    recordId,
  });

  revalidatePath("/seller/finance/settlements");
  return { success: true, message: "정산 내역 확인이 완료됐어요." };
}

export async function requestSellerSettlementPayoutAction(
  recordId: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const bankName = formData.get("bankName")?.toString().trim() ?? "";
  const accountNumber = formData.get("accountNumber")?.toString().trim() ?? "";
  const accountHolder = formData.get("accountHolder")?.toString().trim() ?? "";

  if (!bankName || !accountNumber || !accountHolder) {
    return { success: false, message: "정산 계좌 정보를 모두 입력해 주세요." };
  }

  const validationError = validateBankAccountInput({
    bankName,
    accountNumber,
    accountHolder,
  });
  if (validationError) {
    return { success: false, message: validationError };
  }

  const result = await requestSellerSettlementPayout({
    sellerId: seller.id,
    recordId,
    bankName,
    accountNumber,
    accountHolder,
  });

  if (!result.success) {
    if (result.error === "migration_required") {
      return {
        success: false,
        message: "출금요청 기능 준비 중이에요. migration 049 적용 후 이용할 수 있어요.",
      };
    }
    return { success: false, message: "출금요청 가능한 정산건이 아니에요." };
  }

  await notifyAdminSettlementPending({
    sellerName: seller.companyName,
    recordId,
  });

  revalidatePath("/seller/finance/settlements");
  revalidatePath("/admin/settlements");
  return { success: true, message: "출금요청이 접수됐어요." };
}

export async function requestSellerSettlementPayoutFormAction(
  recordId: string,
  formData: FormData,
): Promise<void> {
  await requestSellerSettlementPayoutAction(recordId, formData);
}

export async function updateSellerBankAccountAction(input: {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const validationError = validateBankAccountInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const result = await updateSellerBankAccount(user.id, input);
  if (!result.success) {
    return { success: false, message: "계좌 정보 저장에 실패했어요." };
  }

  revalidatePath("/seller/settings/account");
  return { success: true, message: "정산 계좌가 저장됐어요." };
}

export async function verifySellerBankAccountAction(input: {
  bankName: string;
  accountNumber: string;
}): Promise<{ success: boolean; message: string; accountHolder?: string }> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const result = await verifyBankAccountHolder(input);
  return {
    success: result.ok,
    message: result.message,
    accountHolder: result.accountHolder,
  };
}

export async function createSellerBillingAction(input: {
  billingType: "ad_fee" | "extra_charge";
  amount: number;
  paymentMode: SellerBillingPaymentMode;
  description?: string;
}): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  if (input.amount <= 0) {
    return { success: false, message: "금액을 확인해 주세요." };
  }

  const result = await createSellerBilling({
    sellerId: seller.id,
    billingType: input.billingType,
    amount: input.amount,
    paymentMode: input.paymentMode,
    description: input.description,
  });

  if (!result.success) {
    return { success: false, message: "청구 내역 생성에 실패했어요." };
  }

  revalidatePath("/seller/finance/billing");
  return {
    success: true,
    message:
      input.paymentMode === "settlement_deduction" ?
        "다음 정산 시 차감 예정으로 등록됐어요."
      : "결제 대기 청구가 생성됐어요.",
  };
}

export async function paySellerBillingAction(billingId: string): Promise<ActionResult> {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, message: "로그인이 필요해요." };
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    return { success: false, message: "승인된 판매자만 이용할 수 있어요." };
  }

  const result = await paySellerBillingWithToss(seller.id, billingId);
  revalidatePath("/seller/finance/billing");
  return { success: result.success, message: result.message };
}
