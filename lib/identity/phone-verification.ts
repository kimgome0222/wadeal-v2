import { normalizePhone, validateKoreanMobile } from "@/lib/identity/phone";

/**
 * TODO: Replace mock verification with a real SMS API (e.g. NCP SENS, Twilio).
 * Wire sendPhoneVerificationCode() to the provider and persist codes server-side.
 */

const CODE_TTL_MS = 5 * 60 * 1000;
const DEV_MOCK_CODE = "123456";

type PendingVerification = {
  code: string;
  expiresAt: number;
};

const pendingCodes = new Map<string, PendingVerification>();

function verificationKey(userId: string, phone: string): string {
  return `${userId}:${normalizePhone(phone)}`;
}

function generateVerificationCode(): string {
  if (process.env.NODE_ENV !== "production") {
    return DEV_MOCK_CODE;
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}

export function issuePhoneVerificationCode(userId: string, phone: string): {
  success: boolean;
  error?: "invalid_phone";
  /** Dev-only hint for local testing. */
  devCode?: string;
} {
  if (!validateKoreanMobile(phone)) {
    return { success: false, error: "invalid_phone" };
  }

  const code = generateVerificationCode();
  pendingCodes.set(verificationKey(userId, phone), {
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
  });

  return {
    success: true,
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}

export function verifyPhoneVerificationCode(
  userId: string,
  phone: string,
  code: string,
): { success: boolean; error?: "invalid_phone" | "code_missing" | "code_expired" | "code_mismatch" } {
  if (!validateKoreanMobile(phone)) {
    return { success: false, error: "invalid_phone" };
  }

  const normalizedCode = code.replace(/\D/g, "");
  if (!normalizedCode) {
    return { success: false, error: "code_missing" };
  }

  const pending = pendingCodes.get(verificationKey(userId, phone));
  if (!pending) {
    return { success: false, error: "code_missing" };
  }

  if (pending.expiresAt < Date.now()) {
    pendingCodes.delete(verificationKey(userId, phone));
    return { success: false, error: "code_expired" };
  }

  if (pending.code !== normalizedCode) {
    return { success: false, error: "code_mismatch" };
  }

  pendingCodes.delete(verificationKey(userId, phone));
  return { success: true };
}
