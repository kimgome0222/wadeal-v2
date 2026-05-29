import type { SellerRecord } from "@/lib/sellers/types";
import { isSellerApproved } from "@/lib/sellers/types";

export type SellerSetupStatus = {
  hasApplication: boolean;
  isApproved: boolean;
  businessInfoComplete: boolean;
  settlementAccountComplete: boolean;
  canRegisterProducts: boolean;
  canManageSettlements: boolean;
  profileStatusLabel: string;
  businessVerificationLabel: string;
  productRegistrationLabel: string;
  settlementAccountLabel: string;
};

function isBusinessInfoComplete(seller: SellerRecord | null): boolean {
  if (!seller) {
    return false;
  }

  return (
    seller.companyName.trim().length > 0 &&
    seller.businessNumber.trim().replace(/\D/g, "").length >= 10 &&
    Boolean(seller.representativeName?.trim())
  );
}

function isSettlementAccountComplete(seller: SellerRecord | null): boolean {
  if (!seller) {
    return false;
  }

  return Boolean(
    seller.bankName?.trim() &&
      seller.accountNumber?.trim() &&
      seller.accountHolder?.trim(),
  );
}

export function getSellerSetupStatus(seller: SellerRecord | null): SellerSetupStatus {
  const hasApplication = seller != null;
  const isApproved = seller ? isSellerApproved(seller.status) : false;
  const businessInfoComplete = isBusinessInfoComplete(seller);
  const settlementAccountComplete = isSettlementAccountComplete(seller);
  const canRegisterProducts = isApproved && businessInfoComplete;
  const canManageSettlements =
    isApproved && businessInfoComplete && settlementAccountComplete;

  return {
    hasApplication,
    isApproved,
    businessInfoComplete,
    settlementAccountComplete,
    canRegisterProducts,
    canManageSettlements,
    profileStatusLabel:
      !hasApplication ? "미완료"
      : businessInfoComplete ? "완료"
      : "입력 필요",
    businessVerificationLabel:
      !hasApplication ? "사업자 인증 필요"
      : !isApproved ? "심사 중"
      : "인증 완료",
    productRegistrationLabel: canRegisterProducts ? "가능" : "사업자 정보 필요",
    settlementAccountLabel: settlementAccountComplete ? "등록 완료" : "미등록",
  };
}
