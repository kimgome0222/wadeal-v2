const KOREAN_MOBILE_PATTERN = /^010\d{8}$/;

/** Strip non-digits and return digits-only storage form. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

/** Korean mobile: 010 + 8 digits (11 digits total). */
export function validateKoreanMobile(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return KOREAN_MOBILE_PATTERN.test(normalized);
}

/** Display helper: 010-1234-5678 */
export function formatKoreanMobile(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!KOREAN_MOBILE_PATTERN.test(normalized)) {
    return phone.trim();
  }

  return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`;
}

export function isPhonePresent(phone: string | null | undefined): boolean {
  return Boolean(phone && normalizePhone(phone).length > 0);
}
