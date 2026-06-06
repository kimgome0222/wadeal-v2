import { TRENDING_SEARCH_POOL } from "@/lib/search/search-data";

/** 급상승 검색어 mock — 1시간 단위 로테이션 (DB 없음) */

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
  const offset = hashHour(hourSlot) % TRENDING_SEARCH_POOL.length;

  return Array.from({ length: Math.min(limit, TRENDING_SEARCH_POOL.length) }, (_, index) => {
    const term = TRENDING_SEARCH_POOL[(offset + index) % TRENDING_SEARCH_POOL.length]!;
    return { rank: index + 1, term };
  });
}

export function getTrendingSearchHourLabel(): string {
  const hourSlot = Math.floor(Date.now() / 3_600_000);
  const base = new Date(hourSlot * 3_600_000);
  const hh = base.getHours().toString().padStart(2, "0");
  return `${hh}:00 기준`;
}
