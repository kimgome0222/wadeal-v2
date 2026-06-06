const STORAGE_KEY = "wadeal.recent-searches";
const MAX_RECENT = 10;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed || typeof window === "undefined") {
    return readRecentSearches();
  }

  const next = [trimmed, ...readRecentSearches().filter((item) => item !== trimmed)].slice(
    0,
    MAX_RECENT,
  );

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }

  return next;
}

export function removeRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed || typeof window === "undefined") {
    return readRecentSearches();
  }

  const next = readRecentSearches().filter((item) => item !== trimmed);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }

  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
