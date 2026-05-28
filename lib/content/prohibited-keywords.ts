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
] as const;

export function detectProhibitedKeywords(text: string): string[] {
  const normalized = text.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return PROHIBITED_KEYWORDS.filter((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function hasProhibitedKeywords(text: string): boolean {
  return detectProhibitedKeywords(text).length > 0;
}
