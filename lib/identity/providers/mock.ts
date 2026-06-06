import { isProductionRuntime } from "@/lib/env/runtime";
import { validateKoreanMobile } from "@/lib/identity/phone";
import type { IdentityProvider } from "@/lib/identity/providers/types";
import type {
  IdentityVerificationPayload,
  IdentityVerificationResult,
  PhoneVerificationResult,
} from "@/lib/identity/types";

function mockBlocked(): PhoneVerificationResult {
  return { success: false, error: "provider_unavailable" };
}

export const mockIdentityProvider: IdentityProvider = {
  kind: "mock",

  async verifyPhone(_userId: string, phone: string): Promise<PhoneVerificationResult> {
    if (isProductionRuntime()) {
      return mockBlocked();
    }

    if (!phone.trim()) {
      return { success: false, error: "missing_phone" };
    }

    if (!validateKoreanMobile(phone)) {
      return { success: false, error: "invalid_phone" };
    }

    return { success: true };
  },

  async verifyIdentity(
    _userId: string,
    payload: IdentityVerificationPayload,
  ): Promise<IdentityVerificationResult> {
    if (isProductionRuntime()) {
      return { success: false, error: "provider_unavailable" };
    }

    if (!payload.realName.trim() || !validateKoreanMobile(payload.phone)) {
      return { success: false, error: "invalid_input" };
    }

    return { success: true };
  },
};

/** Dev-only helper; blocked in production builds. */
export async function verifyPhoneMock(
  userId: string,
  phone: string,
): Promise<PhoneVerificationResult> {
  return mockIdentityProvider.verifyPhone(userId, phone);
}
