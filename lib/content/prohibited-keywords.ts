const PROHIBITED_KEYWORDS = [
  "불법",
  "마약",
  "총기",
  "도박",
  "성인물",
  "가품",
  "위조",
  "해킹",
  "대출",
  "사칭",
  "전문의약품",
  "담배",
  "전자담배",
  "성인용품",
] as const;

const WARNING_KEYWORDS = [
  "치료",
  "완치",
  "의약",
  "정품 보장",
  "100% 효과",
  "주름 제거",
  "미백 보장",
  "무조건 안전",
  "평생 A/S",
  "100% 순면",
  "100% 국산",
  "명품",
] as const;

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function matchKeywords(text: string, keywords: readonly string[]): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  return keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function detectProhibitedKeywords(text: string): string[] {
  return matchKeywords(text, PROHIBITED_KEYWORDS);
}

export function detectWarningKeywords(text: string): string[] {
  return matchKeywords(text, WARNING_KEYWORDS);
}

export function detectAllReviewKeywords(text: string): {
  prohibited: string[];
  warning: string[];
} {
  const prohibited = detectProhibitedKeywords(text);
  const warning = detectWarningKeywords(text).filter(
    (keyword) => !prohibited.includes(keyword),
  );

  return { prohibited, warning };
}

export function hasProhibitedKeywords(text: string): boolean {
  return detectProhibitedKeywords(text).length > 0;
}

export function hasWarningKeywords(text: string): boolean {
  return detectWarningKeywords(text).length > 0;
}
