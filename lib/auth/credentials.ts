const RESERVED_USERNAMES = new Set([
  "admin",
  "root",
  "test",
  "seller",
  "manager",
  "wadeal",
  "support",
  "system",
  "guest",
  "null",
  "undefined",
]);

const USERNAME_PATTERN = /^[a-z0-9_]{6,20}$/;

export type UsernameValidationResult =
  | { valid: true }
  | { valid: false; error: "invalid_format" | "reserved" | "empty" };

export type PasswordValidationResult =
  | { valid: true; score: number }
  | {
      valid: false;
      error:
        | "too_short"
        | "weak"
        | "contains_username"
        | "repeated_chars"
        | "empty";
    };

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function validateUsername(value: string): UsernameValidationResult {
  const username = normalizeUsername(value);
  if (!username) {
    return { valid: false, error: "empty" };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return { valid: false, error: "invalid_format" };
  }
  if (RESERVED_USERNAMES.has(username)) {
    return { valid: false, error: "reserved" };
  }
  return { valid: true };
}

function countCharClasses(password: string): number {
  let count = 0;
  if (/[a-z]/.test(password)) count += 1;
  if (/[A-Z]/.test(password)) count += 1;
  if (/[0-9]/.test(password)) count += 1;
  if (/[^a-zA-Z0-9]/.test(password)) count += 1;
  return count;
}

function hasRepeatedOrSequentialChars(password: string): boolean {
  if (/(.)\1{2,}/.test(password)) {
    return true;
  }
  const lower = password.toLowerCase();
  for (let index = 0; index < lower.length - 2; index += 1) {
    const a = lower.charCodeAt(index);
    const b = lower.charCodeAt(index + 1);
    const c = lower.charCodeAt(index + 2);
    if (b === a + 1 && c === b + 1) {
      return true;
    }
  }
  return false;
}

export function validatePassword(
  password: string,
  username?: string,
): PasswordValidationResult {
  const value = password.trim();
  if (!value) {
    return { valid: false, error: "empty" };
  }
  if (value.length < 10) {
    return { valid: false, error: "too_short" };
  }
  if (countCharClasses(value) < 3) {
    return { valid: false, error: "weak" };
  }
  if (username) {
    const normalizedUsername = normalizeUsername(username);
    if (
      normalizedUsername &&
      value.toLowerCase().includes(normalizedUsername)
    ) {
      return { valid: false, error: "contains_username" };
    }
  }
  if (hasRepeatedOrSequentialChars(value)) {
    return { valid: false, error: "repeated_chars" };
  }
  return { valid: true, score: countCharClasses(value) };
}

export function usernameToAuthEmail(username: string): string {
  return `${normalizeUsername(username)}@users.wadeal.local`;
}

export function maskUsername(username: string): string {
  const normalized = normalizeUsername(username);
  if (normalized.length <= 2) {
    return `${normalized[0] ?? "*"}*`;
  }
  const visiblePrefix = normalized.slice(0, 2);
  const visibleSuffix = normalized.slice(-2);
  const maskedLength = Math.max(3, normalized.length - 4);
  return `${visiblePrefix}${"*".repeat(maskedLength)}${visibleSuffix}`;
}

export function getUsernameValidationMessage(
  result: UsernameValidationResult,
): string {
  if (result.valid) {
    return "";
  }
  switch (result.error) {
    case "empty":
      return "아이디를 입력해 주세요.";
    case "invalid_format":
      return "아이디는 6~20자의 영문 소문자, 숫자, _ 만 사용할 수 있어요.";
    case "reserved":
      return "사용할 수 없는 아이디예요.";
    default:
      return "아이디를 확인해 주세요.";
  }
}

export function getPasswordValidationMessage(
  result: PasswordValidationResult,
): string {
  if (result.valid) {
    return "";
  }
  switch (result.error) {
    case "empty":
      return "비밀번호를 입력해 주세요.";
    case "too_short":
      return "비밀번호는 10자 이상이어야 해요.";
    case "weak":
      return "영문 대/소문자, 숫자, 특수문자 중 3종 이상을 포함해 주세요.";
    case "contains_username":
      return "비밀번호에 아이디를 포함할 수 없어요.";
    case "repeated_chars":
      return "반복되거나 연속된 문자는 사용할 수 없어요.";
    default:
      return "비밀번호를 확인해 주세요.";
  }
}
