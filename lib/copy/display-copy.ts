/** celloh 브랜드 표시 문구 (UI only) */
export const CELLOH_BRAND = {
  name: "celloh",
  tagline: "누가 만들었는지 알고 사세요.",
  subTagline: "좋은 상품은 좋은 판매자에게서 시작됩니다.",
  philosophy: "판매자를 알면, 상품이 보입니다.",
  description:
    "좋은 상품은 좋은 판매자에게서 시작됩니다. 판매자를 알면, 상품이 보입니다.",
} as const;

const EXACT_REPLACEMENTS: Record<string, string> = {
  와딜: "celloh",
  Wadeal: "celloh",
  WADEAL: "celloh",
  Celloh: "celloh",
  CELLOH: "celloh",
  "와딜 | 공동구매": "celloh",
  "celloh | 공동구매": "celloh",
  "내 공동구매": "내 쇼핑",
  "참여한 공동구매": "구매/관심 상품",
  "공동구매 알림": "관심 상품 알림",
  "공구 내역": "구매 내역",
  "공구 상태": "주문 상태",
  "친구와 공구 참여": "친구에게 celloh 소개하기",
  "같이 사면 더 저렴": "좋은 판매자의 상품을 함께 발견해보세요",
  "와딜 운영팀": "celloh 운영팀",
  "Wadeal 서비스": "celloh 서비스",
  "Wadeal 공동구매": "celloh",
  "공동구매 서비스": "쇼핑 서비스",
  "공동구매 상품": "판매 상품",
  "공구 등록": "상품 등록",
  "공구 관리": "상품 관리",
  "공구 참여": "구매하기",
  "공구가": "혜택가",
  "참여하기": "구매하기",
  "공구 승인": "상품 승인",
  "공구 종료": "판매 종료",
  "공동구매 관리": "상품 관리",
  "공동구매 주문": "주문",
  "공구 신고": "상품 신고",
  "공동구매 리뷰": "리뷰",
  "참여 주문": "주문",
  "오늘 마감 공동구매": "추천 판매자의 상품",
  "마감 공동구매": "지금 주목할 상품",
  "마감 임박": "지금 주목할 상품",
  "공동구매 진행중": "추천 상품",
  "공구 특가": "인기 상품",
  "모집 인원": "혜택 기준",
  "인원 달성": "혜택 달성",
};

const PATTERN_REPLACEMENTS: { pattern: RegExp; value: string }[] = [
  { pattern: /공동\s*구매/g, value: "셀러 상품" },
  { pattern: /그룹\s*구매/gi, value: "셀러 상품" },
  { pattern: /group\s*buy/gi, value: "셀러 상품" },
  { pattern: /groupbuy/gi, value: "셀러 상품" },
  { pattern: /팀\s*구매/g, value: "셀러 상품" },
  { pattern: /공구(?!가)/g, value: "상품" },
];

/** Maps legacy Wadeal/group-buy copy to celloh shopping copy (display only). */
export function normalizeDisplayCopy(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (EXACT_REPLACEMENTS[trimmed]) {
    return EXACT_REPLACEMENTS[trimmed];
  }

  let result = trimmed;
  for (const [from, to] of Object.entries(EXACT_REPLACEMENTS)) {
    if (from.length > 4) {
      result = result.split(from).join(to);
    }
  }

  for (const { pattern, value } of PATTERN_REPLACEMENTS) {
    result = result.replace(pattern, value);
  }

  return result;
}
