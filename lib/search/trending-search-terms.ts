/** 급상승 검색어 mock — 1시간 단위 로테이션 (DB 없음) */

const TRENDING_POOL = [
  "제주 감귤",
  "유기농 샐러드",
  "무선 이어폰",
  "스킨케어 세트",
  "강아지 사료",
  "주방 수납",
  "친환경 세제",
  "홈카페 원두",
  "아기 이유식",
  "캠핑 의자",
  "프리미엄 한우",
  "실내 슬리퍼",
  "선크림",
  "노트북 파우치",
  "celloh 셀러",
  "특가 공구",
  "신규 입점",
  "오늘의 추천",
  "배송 빠른",
  "리뷰 많은",
];

function hashHour(seed: number): number {
  return Math.abs((seed * 2654435761) | 0);
}

export type TrendingSearchTerm = {
  rank: number;
  term: string;
};

/** 현재 시간 슬롯 기준 1~10위 */
export function getTrendingSearchTerms(limit = 10): TrendingSearchTerm[] {
  const hourSlot = Math.floor(Date.now() / 3_600_000);
  const offset = hashHour(hourSlot) % TRENDING_POOL.length;

  return Array.from({ length: Math.min(limit, TRENDING_POOL.length) }, (_, index) => {
    const term = TRENDING_POOL[(offset + index) % TRENDING_POOL.length]!;
    return { rank: index + 1, term };
  });
}

export function getTrendingSearchHourLabel(): string {
  const hourSlot = Math.floor(Date.now() / 3_600_000);
  const base = new Date(hourSlot * 3_600_000);
  const hh = base.getHours().toString().padStart(2, "0");
  return `${hh}:00 기준`;
}
