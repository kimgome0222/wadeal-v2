import type { Deal } from "@/lib/deals";

export type CatalogIndex = {
  slugs: Set<string>;
  ids: Set<number>;
  bySlug: Map<string, Deal>;
};

export function buildCatalogIndex(catalog: Deal[]): CatalogIndex {
  return {
    slugs: new Set(catalog.map((deal) => deal.slug)),
    ids: new Set(catalog.map((deal) => deal.id)),
    bySlug: new Map(catalog.map((deal) => [deal.slug, deal])),
  };
}

export function isDealInCatalog(
  deal: Pick<Deal, "id" | "slug">,
  catalog: Deal[] | CatalogIndex,
): boolean {
  if (Array.isArray(catalog)) {
    const index = buildCatalogIndex(catalog);
    return index.slugs.has(deal.slug) || (deal.id > 0 && index.ids.has(deal.id));
  }

  return (
    catalog.slugs.has(deal.slug) || (deal.id > 0 && catalog.ids.has(deal.id))
  );
}

/** 카탈로그에 존재하는 상품만 반환 (slug·id 기준) */
export function filterDealsInCatalog(deals: Deal[], catalog: Deal[]): Deal[] {
  if (catalog.length === 0) {
    return deals;
  }

  const index = buildCatalogIndex(catalog);
  return deals.filter((deal) => isDealInCatalog(deal, index));
}
