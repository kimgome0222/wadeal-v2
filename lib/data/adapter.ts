import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import { parsePriceTiersJson } from "@/lib/pricing/tiers";
import { normalizeProductType } from "@/lib/products/product-type";
import type {
  DealWithProductRow,
  PriceTier,
  PriceTierRow,
} from "@/lib/types";

function formatEndsIn(minutes: number): string {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function getEndsInMinutes(endsAt: string): number {
  const diffMs = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / 60_000));
}

export function mapPriceTierRow(row: PriceTierRow): PriceTier {
  return {
    id: row.id,
    order: row.tier_order,
    requiredParticipants: row.required_participants,
    price: row.price,
  };
}

export function mapDealRow(
  row: DealWithProductRow,
  options?: { saved?: boolean },
): Deal {
  const product = row.products;
  const endsInMinutes = getEndsInMinutes(row.ends_at);

  return {
    id: product.legacy_id ?? 0,
    dealId: row.id,
    slug: product.slug,
    title: product.name || row.title,
    section: row.section as DealSectionCategory,
    categoryTags: (product.category_tags ?? []) as CategorySlug[],
    imageUrl: product.image_url ?? "",
    originalPrice: product.original_price,
    groupPrice: row.group_price,
    lowestPrice: row.lowest_price,
    priceTiers: parsePriceTiersJson(row.price_tiers),
    participants: row.current_participants,
    targetParticipants: row.target_participants,
    endsIn: formatEndsIn(endsInMinutes),
    endsInMinutes,
    endsAt: row.ends_at,
    dealStatus: row.status,
    badge: row.badge ?? "",
    description: product.description,
    brandName: product.brand_name ?? null,
    searchKeywords: product.keywords ?? [],
    saved: options?.saved,
    productType: normalizeProductType(product.product_type),
    stockQuantity: product.stock_quantity ?? null,
    soldQuantity: product.sold_quantity ?? 0,
    minOrderQuantity: product.min_order_quantity ?? 1,
    maxOrderQuantity: product.max_order_quantity ?? 99,
    perUserLimit: product.per_user_limit ?? null,
    isSoldOut: product.is_sold_out ?? false,
    soldOutAt: product.sold_out_at ?? null,
    targetQuantity: row.target_quantity ?? null,
    currentQuantity: row.current_quantity ?? 0,
    maxQuantity: row.max_quantity ?? null,
  };
}

export function mapDealRows(
  rows: DealWithProductRow[],
  savedSlugs?: Set<string>,
): Deal[] {
  return rows.map((row) =>
    mapDealRow(row, { saved: savedSlugs?.has(row.products.slug) }),
  );
}
