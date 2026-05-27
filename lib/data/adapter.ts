import type { CategorySlug } from "@/lib/categories";
import type { Deal, DealSectionCategory } from "@/lib/deals";
import type {
  DealWithProductRow,
  PriceTier,
  PriceTierRow,
} from "@/lib/database/types";

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
    slug: product.slug,
    title: row.title,
    section: row.section as DealSectionCategory,
    categoryTags: (product.category_tags ?? []) as CategorySlug[],
    imageUrl: product.image_url ?? "",
    originalPrice: product.original_price,
    groupPrice: row.group_price,
    lowestPrice: row.lowest_price,
    participants: row.current_participants,
    targetParticipants: row.target_participants,
    endsIn: formatEndsIn(endsInMinutes),
    endsInMinutes,
    badge: row.badge ?? "",
    saved: options?.saved,
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
