function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** 판매자명 → URL-safe 공개 프로필 id */
export function buildSellerId(name: string): string {
  const ascii = name
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (ascii.length >= 2) {
    return ascii;
  }

  return `s-${hashSeed(name).toString(36)}`;
}

/** 이전 slug 형식 (하위 호환 조회용) */
export function legacySellerRouteId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

const LEGACY_ROUTE_ALIASES: Record<string, string> = {
  "celloh-셀러": "celloh 셀러",
  "celloh-seller": "celloh 셀러",
};

export function normalizeSellerRouteId(routeId: string): string {
  try {
    return decodeURIComponent(routeId).trim();
  } catch {
    return routeId.trim();
  }
}

export function resolveSellerNameFromRouteId(routeId: string): string | null {
  const decoded = normalizeSellerRouteId(routeId);
  return LEGACY_ROUTE_ALIASES[decoded] ?? null;
}
