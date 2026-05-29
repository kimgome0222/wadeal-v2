"use server";

import {
  getFeaturedSearchTerms,
  getSearchSuggestions,
  logSearchQuery,
} from "@/lib/data/search";

export async function fetchSearchSuggestionsAction(query: string) {
  const suggestions = await getSearchSuggestions(query, 6);
  return { suggestions };
}

export async function fetchFeaturedSearchTermsAction(limit = 8) {
  const terms = await getFeaturedSearchTerms(limit);
  return { terms };
}

export async function logSearchQueryAction(input: { query: string; resultCount: number }) {
  await logSearchQuery(input);
}
