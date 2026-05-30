/** Client/server 공통 — 최소 형식 검증 (PII 저장 없음) */

import {
  validateUsername,
  type UsernameValidationResult,
} from "@/lib/auth/credentials";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_PATTERN.test(trimmed);
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) {
    return false;
  }
  return PHONE_PATTERN.test(value.trim()) || /^01[0-9]{8,9}$/.test(digits);
}

/** 이메일 또는 휴대폰 번호 */
export function isValidEmailOrPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  return isValidEmail(trimmed) || isValidPhone(trimmed);
}

export function usernameValidationMessage(result: UsernameValidationResult): string | null {
  if (result.valid) {
    return null;
  }
  switch (result.error) {
    case "empty":
      return "아이디를 입력해 주세요.";
    case "invalid_format":
      return "아이디는 영문 소문자·숫자·_ 6~20자로 입력해 주세요.";
    case "reserved":
      return "사용할 수 없는 아이디예요.";
    default:
      return "아이디 형식을 확인해 주세요.";
  }
}

export { validateUsername };
