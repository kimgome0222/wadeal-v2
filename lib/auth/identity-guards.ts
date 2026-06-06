import { getVerificationStatus } from "@/lib/identity/verification-status";
import type { UserProfile } from "@/lib/profile/types";

export type CheckoutIdentityBlockReason =
  | "missing_name"
  | "missing_phone"
  | "invalid_phone"
  | "missing_address"
  | "phone_not_verified";

export function isPhoneVerificationRequiredForCheckout(): boolean {
  const flag = process.env.REQUIRE_PHONE_VERIFICATION_FOR_CHECKOUT;
  if (flag === "false" || flag === "0") {
    return false;
  }
  return true;
}

export function isPhoneVerificationRequiredForSellerApply(): boolean {
  const flag = process.env.REQUIRE_PHONE_VERIFICATION_FOR_SELLER_APPLY;
  if (flag === "false" || flag === "0") {
    return false;
  }
  return isPhoneVerificationRequiredForCheckout();
}

export function getCheckoutIdentityBlockReason(input: {
  realName: string | null | undefined;
  phone: string | null | undefined;
  phoneVerifiedAt?: string | null;
  hasDefaultAddress: boolean;
  requirePhoneVerification?: boolean;
}): CheckoutIdentityBlockReason | null {
  const requirePhoneVerification =
    input.requirePhoneVerification ?? isPhoneVerificationRequiredForCheckout();

  if (!input.hasDefaultAddress) {
    return "missing_address";
  }

  const ordererName = input.realName?.trim() ?? "";
  if (!ordererName) {
    return "missing_name";
  }

  const phone = input.phone?.replace(/\D/g, "") ?? "";
  if (!phone) {
    return "missing_phone";
  }

  if (!/^010\d{8}$/.test(phone)) {
    return "invalid_phone";
  }

  if (requirePhoneVerification) {
    const status = getVerificationStatus({
      phoneVerifiedAt: input.phoneVerifiedAt,
    });
    if (status === "unverified") {
      return "phone_not_verified";
    }
  }

  return null;
}

export function getCheckoutIdentityBlockMessage(
  reason: CheckoutIdentityBlockReason,
): string {
  switch (reason) {
    case "missing_name":
      return "주문자 이름을 입력해 주세요.";
    case "missing_phone":
      return "주문자 휴대폰 번호를 입력해 주세요.";
    case "invalid_phone":
      return "010으로 시작하는 휴대폰 번호를 입력해 주세요.";
    case "missing_address":
      return "배송지를 등록해 주세요.";
    case "phone_not_verified":
      return "휴대폰 본인인증을 완료한 뒤 주문할 수 있어요.";
    default:
      return "주문자 정보를 확인해 주세요.";
  }
}

export function isCheckoutBlockedByIdentity(profile: UserProfile | null | undefined): boolean {
  if (!profile) {
    return true;
  }

  return (
    getCheckoutIdentityBlockReason({
      realName: profile.realName,
      phone: profile.phone,
      phoneVerifiedAt: profile.phoneVerifiedAt,
      hasDefaultAddress: true,
    }) != null
  );
}

export function isPhoneVerifiedForProfile(profile: UserProfile | null | undefined): boolean {
  if (!profile) {
    return false;
  }

  return profile.verificationStatus !== "unverified";
}
