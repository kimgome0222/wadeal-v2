import type { PopularSearchTerm } from "@/lib/search/types";

export const FALLBACK_SEARCH_TERMS: PopularSearchTerm[] = [
  { query: "감귤", count: 12 },
  { query: "청소기", count: 9 },
  { query: "세제", count: 7 },
  { query: "한우", count: 5 },
  { query: "생수", count: 4 },
  { query: "커피", count: 3 },
];

export function withSearchTermFallback(
  terms: PopularSearchTerm[],
  limit = 8,
): PopularSearchTerm[] {
  if (terms.length >= 3) {
    return terms.slice(0, limit);
  }

  const seen = new Set(terms.map((term) => term.query.toLowerCase()));
  const merged = [...terms];

  for (const fallback of FALLBACK_SEARCH_TERMS) {
    if (merged.length >= limit) {
      break;
    }
    if (seen.has(fallback.query.toLowerCase())) {
      continue;
    }
    seen.add(fallback.query.toLowerCase());
    merged.push(fallback);
  }

  return merged.slice(0, limit);
}
