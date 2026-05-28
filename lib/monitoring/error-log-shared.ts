export const ERROR_LEVELS = ["info", "warning", "error", "critical"] as const;
export type ErrorLevel = (typeof ERROR_LEVELS)[number];

export const ERROR_SOURCES = [
  "checkout",
  "payment",
  "webhook",
  "finalize_deal",
  "shipping",
  "review",
  "support",
  "admin",
  "auth",
] as const;
export type ErrorSource = (typeof ERROR_SOURCES)[number];

export function getErrorLevelLabel(level: ErrorLevel): string {
  const labels: Record<ErrorLevel, string> = {
    info: "정보",
    warning: "경고",
    error: "오류",
    critical: "치명",
  };
  return labels[level];
}

export function getErrorSourceLabel(source: ErrorSource): string {
  const labels: Record<ErrorSource, string> = {
    checkout: "체크아웃",
    payment: "결제",
    webhook: "웹훅",
    finalize_deal: "공구 마감",
    shipping: "배송",
    review: "리뷰",
    support: "고객센터",
    admin: "관리자",
    auth: "인증",
  };
  return labels[source];
}
