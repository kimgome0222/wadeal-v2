export const VERIFICATION_STATUSES = [
  "unverified",
  "phone_verified",
  "identity_verified",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export type VerificationStatusSource = {
  phoneVerifiedAt?: string | null;
  ciHash?: string | null;
};

export function getVerificationStatus(
  source: VerificationStatusSource | null | undefined,
): VerificationStatus {
  if (source?.ciHash) {
    return "identity_verified";
  }

  if (source?.phoneVerifiedAt) {
    return "phone_verified";
  }

  return "unverified";
}

export function getVerificationStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case "identity_verified":
      return "본인인증 완료";
    case "phone_verified":
      return "휴대폰 인증 완료";
    default:
      return "미인증";
  }
}

export function isVerificationStatus(value: string): value is VerificationStatus {
  return (VERIFICATION_STATUSES as readonly string[]).includes(value);
}

export function getVerificationStatusBadgeClass(status: VerificationStatus): string {
  switch (status) {
    case "identity_verified":
      return "bg-green-50 text-green-700";
    case "phone_verified":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}
