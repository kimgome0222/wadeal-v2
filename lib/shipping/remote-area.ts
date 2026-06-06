/** Jeju and common island/remote postal prefixes (5-digit, no hyphen). */
const REMOTE_POSTAL_PREFIXES = [
  "63000",
  "63100",
  "63200",
  "63300",
  "63400",
  "63500",
  "63600",
  "63700",
  "63800",
  "63900",
  "58700",
  "58800",
  "58900",
  "59100",
  "59200",
  "59300",
  "59400",
  "59500",
  "59600",
  "59700",
  "59800",
] as const;

const JEJU_PREFIX = "63";

function normalizePostalCode(postalCode: string | null | undefined): string {
  return (postalCode ?? "").replace(/\D/g, "").slice(0, 5);
}

export function isRemoteAreaPostalCode(postalCode: string | null | undefined): boolean {
  const digits = normalizePostalCode(postalCode);
  if (digits.length < 2) {
    return false;
  }

  if (digits.startsWith(JEJU_PREFIX)) {
    return true;
  }

  return REMOTE_POSTAL_PREFIXES.some((prefix) => digits.startsWith(prefix.slice(0, 3)));
}

export function inferRegionFromPostalCode(postalCode: string | null | undefined): string | null {
  const digits = normalizePostalCode(postalCode);
  if (!digits) {
    return null;
  }

  if (digits.startsWith(JEJU_PREFIX)) {
    return "제주";
  }

  if (isRemoteAreaPostalCode(digits)) {
    return "도서산간";
  }

  return null;
}
