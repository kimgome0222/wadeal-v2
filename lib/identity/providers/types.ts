import type {
  IdentityProviderKind,
  IdentityVerificationPayload,
  IdentityVerificationResult,
  PhoneVerificationResult,
} from "@/lib/identity/types";

export interface IdentityProvider {
  readonly kind: IdentityProviderKind;
  verifyPhone(userId: string, phone: string): Promise<PhoneVerificationResult>;
  verifyIdentity(
    userId: string,
    payload: IdentityVerificationPayload,
  ): Promise<IdentityVerificationResult>;
}
