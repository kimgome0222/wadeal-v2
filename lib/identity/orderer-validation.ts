import { isPhonePresent, normalizePhone, validateKoreanMobile } from "@/lib/identity/phone";
import {
  getVerificationStatus,
  type VerificationStatus,
} from "@/lib/identity/verification-status";

export type OrdererValidationError =
  | "missing_name"
  | "missing_phone"
  | "invalid_phone"
  | "missing_address";

export type OrdererValidationInput = {
  realName: string | null | undefined;
  phone: string | null | undefined;
  phoneVerifiedAt?: string | null;
  ciHash?: string | null;
  hasDefaultAddress: boolean;
};

export type OrdererValidationSuccess = {
  ok: true;
  ordererName: string;
  ordererPhone: string;
  verificationStatus: VerificationStatus;
};

export type OrdererValidationResult =
  | OrdererValidationSuccess
  | { ok: false; error: OrdererValidationError };

export function validateOrdererInfo(input: OrdererValidationInput): OrdererValidationResult {
  if (!input.hasDefaultAddress) {
    return { ok: false, error: "missing_address" };
  }

  const ordererName = input.realName?.trim() ?? "";
  if (!ordererName) {
    return { ok: false, error: "missing_name" };
  }

  if (!isPhonePresent(input.phone)) {
    return { ok: false, error: "missing_phone" };
  }

  const ordererPhone = normalizePhone(input.phone ?? "");
  if (!validateKoreanMobile(ordererPhone)) {
    return { ok: false, error: "invalid_phone" };
  }

  return {
    ok: true,
    ordererName,
    ordererPhone,
    verificationStatus: getVerificationStatus({
      phoneVerifiedAt: input.phoneVerifiedAt,
      ciHash: input.ciHash,
    }),
  };
}

export function getOrdererValidationMessage(error: OrdererValidationError): string {
  switch (error) {
    case "missing_name":
      return "주문자 이름을 입력해 주세요.";
    case "missing_phone":
      return "주문자 휴대폰 번호를 입력해 주세요.";
    case "invalid_phone":
      return "010으로 시작하는 휴대폰 번호를 입력해 주세요.";
    case "missing_address":
      return "배송지를 등록해 주세요.";
    default:
      return "주문자 정보를 확인해 주세요.";
  }
}
