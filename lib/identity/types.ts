import type { VerificationStatus } from "@/lib/identity/verification-status";

/** Safe user identity fields exposed to the client (never includes ci_hash / di_hash). */
export type UserIdentityProfile = {
  userId: string;
  realName: string | null;
  phone: string | null;
  birthDate: string | null;
  phoneVerifiedAt: string | null;
  verificationStatus: VerificationStatus;
};

export type UpdateUserIdentityInput = {
  realName: string;
  phone: string;
};

export type PhoneVerificationResult = {
  success: boolean;
  error?: "login_required" | "invalid_phone" | "missing_phone" | "already_verified" | "provider_unavailable" | "save_failed";
};

export type IdentityProviderKind = "mock" | "nice" | "pass" | "toss";

export type IdentityVerificationPayload = {
  realName: string;
  phone: string;
  birthDate?: string | null;
  ciHash?: string | null;
  diHash?: string | null;
};

export type IdentityVerificationResult = {
  success: boolean;
  error?: string;
};
