/**
 * Mock catalog and UI helpers. Server pages should load deals via `@/lib/data`;
 * this module is used as fallback when Supabase env vars are not set (dev only).
 */
import type { CategorySlug } from "@/lib/categories";
import type { PriceTierEntry } from "@/lib/pricing/tiers";
import { inventoryFromDeal, isSoldOut } from "@/lib/products/inventory";
import type { DealStatus } from "@/lib/types";

export type DealSectionCategory = "main" | "closing" | "rising" | "food" | "daily";

export type Deal = {
  id: number;
  dealId?: string;
  slug: string;
  title: string;
  section: DealSectionCategory;
  categoryTags: CategorySlug[];
  imageUrl: string;
  originalPrice: number;
  groupPrice: number;
  lowestPrice: number;
  priceTiers?: PriceTierEntry[];
  participants: number;
  targetParticipants: number;
  endsIn: string;
  endsInMinutes: number;
  endsAt?: string;
  dealStatus?: DealStatus;
  badge: string;
  description?: string | null;
  brandName?: string | null;
  searchKeywords?: string[];
  saved?: boolean;
  productType?: import("@/lib/products/product-type").ProductType;
  stockQuantity?: number | null;
  soldQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  perUserLimit?: number | null;
  isSoldOut?: boolean;
  soldOutAt?: string | null;
  targetQuantity?: number | null;
  currentQuantity?: number;
  maxQuantity?: number | null;
};

export { canJoinDeal, isDealClosed, isDealPastDeadline } from "@/lib/deals/lifecycle";

const GROUPBUY_TIERS = {
  citrus: [
    { minQty: 1, price: 39900 },
    { minQty: 10, price: 29900 },
    { minQty: 30, price: 24900 },
    { minQty: 50, price: 18900 },
  ],
  skincare: [
    { minQty: 1, price: 89000 },
    { minQty: 10, price: 64900 },
    { minQty: 30, price: 54900 },
    { minQty: 50, price: 44900 },
  ],
  dogfood: [
    { minQty: 1, price: 89000 },
    { minQty: 10, price: 69900 },
    { minQty: 30, price: 59900 },
    { minQty: 50, price: 49900 },
  ],
  babyFood: [
    { minQty: 1, price: 42000 },
    { minQty: 10, price: 32900 },
    { minQty: 30, price: 26900 },
    { minQty: 50, price: 21900 },
  ],
  seaweed: [
    { minQty: 1, price: 35000 },
    { minQty: 10, price: 27900 },
    { minQty: 30, price: 21900 },
    { minQty: 50, price: 17900 },
  ],
  towel: [
    { minQty: 1, price: 45900 },
    { minQty: 10, price: 34900 },
    { minQty: 30, price: 26900 },
    { minQty: 50, price: 21900 },
  ],
} as const satisfies Record<string, PriceTierEntry[]>;

/** Dev-only fallback catalog — mirrors `supabase/seed.sql` production rows. */
export const deals: Deal[] = [
  {
    id: 101,
    slug: "wd-olive-oil-500",
    title: "프리미엄 올리브오일 500ml",
    section: "main",
    categoryTags: ["all", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    originalPrice: 28900,
    groupPrice: 23900,
    lowestPrice: 23900,
    participants: 0,
    targetParticipants: 9999,
    endsIn: "720:00",
    endsInMinutes: 43200,
    badge: "인기",
    productType: "normal",
    brandName: "올리브하우스",
    searchKeywords: ["올리브오일", "EVOO", "식품"],
  },
  {
    id: 102,
    slug: "wd-earbuds-case",
    title: "무선 이어폰 하드 케이스",
    section: "rising",
    categoryTags: ["all", "digital"],
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
    originalPrice: 15900,
    groupPrice: 12900,
    lowestPrice: 12900,
    participants: 0,
    targetParticipants: 9999,
    endsIn: "720:00",
    endsInMinutes: 43200,
    badge: "신규",
    productType: "normal",
    brandName: "TechPouch",
    searchKeywords: ["이어폰케이스", "액세서리"],
  },
  {
    id: 103,
    slug: "wd-jeju-citrus-5kg",
    title: "제주 감귤 5kg",
    section: "main",
    categoryTags: ["all", "local", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80",
    originalPrice: 39900,
    groupPrice: 24900,
    lowestPrice: 18900,
    priceTiers: [...GROUPBUY_TIERS.citrus],
    participants: 118,
    targetParticipants: 150,
    endsIn: "48:00",
    endsInMinutes: 2880,
    badge: "마감임박",
    productType: "groupbuy",
    brandName: "제주Farm",
    searchKeywords: ["감귤", "제주", "지역특산"],
    saved: true,
  },
  {
    id: 104,
    slug: "wd-premium-skincare",
    title: "프리미엄 화장품 5종 세트",
    section: "rising",
    categoryTags: ["all", "beauty"],
    imageUrl:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    originalPrice: 89000,
    groupPrice: 54900,
    lowestPrice: 44900,
    priceTiers: [...GROUPBUY_TIERS.skincare],
    participants: 62,
    targetParticipants: 100,
    endsIn: "120:00",
    endsInMinutes: 7200,
    badge: "인기",
    productType: "groupbuy",
    brandName: "GlowLab",
    searchKeywords: ["스킨케어", "화장품", "뷰티"],
    saved: true,
  },
  {
    id: 105,
    slug: "wd-dogfood-10kg",
    title: "반려견 사료 10kg",
    section: "daily",
    categoryTags: ["all", "pet"],
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    originalPrice: 89000,
    groupPrice: 59900,
    lowestPrice: 49900,
    priceTiers: [...GROUPBUY_TIERS.dogfood],
    participants: 95,
    targetParticipants: 120,
    endsIn: "168:00",
    endsInMinutes: 10080,
    badge: "인기",
    productType: "groupbuy",
    brandName: "PetNature",
    searchKeywords: ["강아지사료", "반려동물"],
  },
  {
    id: 106,
    slug: "wd-baby-food-12",
    title: "유기농 아기 이유식 12팩",
    section: "food",
    categoryTags: ["all", "baby", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    originalPrice: 42000,
    groupPrice: 26900,
    lowestPrice: 21900,
    priceTiers: [...GROUPBUY_TIERS.babyFood],
    participants: 44,
    targetParticipants: 80,
    endsIn: "96:00",
    endsInMinutes: 5760,
    badge: "급상승",
    productType: "groupbuy",
    brandName: "BabyFresh",
    searchKeywords: ["이유식", "육아", "유기농"],
  },
  {
    id: 107,
    slug: "wd-wando-seaweed",
    title: "완도 미역 500g 5봉",
    section: "food",
    categoryTags: ["all", "local", "food"],
    imageUrl:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    originalPrice: 35000,
    groupPrice: 21900,
    lowestPrice: 17900,
    priceTiers: [...GROUPBUY_TIERS.seaweed],
    participants: 71,
    targetParticipants: 90,
    endsIn: "144:00",
    endsInMinutes: 8640,
    badge: "인기",
    productType: "groupbuy",
    brandName: "완도바다",
    searchKeywords: ["미역", "완도", "지역특산"],
  },
  {
    id: 108,
    slug: "wd-hotel-towel-6",
    title: "호텔 순면 수건 6장",
    section: "closing",
    categoryTags: ["all", "living"],
    imageUrl:
      "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=80",
    originalPrice: 45900,
    groupPrice: 26900,
    lowestPrice: 21900,
    priceTiers: [...GROUPBUY_TIERS.towel],
    participants: 147,
    targetParticipants: 160,
    endsIn: "24:00",
    endsInMinutes: 1440,
    badge: "마감임박",
    productType: "groupbuy",
    brandName: "HomeLinens",
    searchKeywords: ["수건", "생활용품", "순면"],
    saved: true,
  },
];

export const currency = new Intl.NumberFormat("ko-KR");

export function getDealDiscount(deal: Deal) {
  return Math.round(
    ((deal.originalPrice - deal.groupPrice) / deal.originalPrice) * 100,
  );
}

export function getDealRemaining(deal: Deal) {
  return Math.max(0, deal.targetParticipants - deal.participants);
}

export function getDealProgress(deal: Deal) {
  if (isDealGroupBuySucceeded(deal)) {
    return 100;
  }

  return Math.min(
    100,
    Math.round((deal.participants / deal.targetParticipants) * 100),
  );
}

const URGENCY_REMAINING_THRESHOLD = 10;
const URGENCY_PROGRESS_THRESHOLD = 70;

export function shouldShowDealUrgency(deal: Deal) {
  if (isDealGroupBuySucceeded(deal)) {
    return false;
  }

  const remaining = getDealRemaining(deal);
  if (remaining <= 0) {
    return false;
  }
  return (
    remaining <= URGENCY_REMAINING_THRESHOLD ||
    getDealProgress(deal) >= URGENCY_PROGRESS_THRESHOLD
  );
}

export function isDealGroupBuySucceeded(deal: Deal) {
  return deal.participants >= deal.targetParticipants;
}

export function isDealSoldOut(deal: Deal): boolean {
  return isSoldOut(inventoryFromDeal(deal));
}

export function getDealBadgeLabel(deal: Deal) {
  if (isDealSoldOut(deal)) {
    return "품절";
  }

  if (isDealGroupBuySucceeded(deal)) {
    return "공동구매 성공";
  }

  if (deal.badge === "마감임박") {
    return "오늘 마감";
  }
  if (deal.badge === "인기" || deal.badge === "급상승") {
    return "인기";
  }
  return "공동구매 진행중";
}

export function getDealById(id: string) {
  return deals.find((deal) => deal.slug === id || deal.id.toString() === id);
}

export function getDealsBySection(section: DealSectionCategory) {
  return deals.filter((deal) => deal.section === section);
}

export function getDealsByCategorySlug(slug: CategorySlug) {
  if (slug === "all") {
    return [...deals];
  }
  return deals.filter((deal) => deal.categoryTags.includes(slug));
}

export function getSavedDeals() {
  return deals.filter((deal) => deal.saved);
}

export type SortTab = "popular" | "closing" | "discount";

export function sortDeals(list: Deal[], sort: SortTab) {
  const sorted = [...list];
  if (sort === "popular") {
    return sorted.sort((a, b) => b.participants - a.participants);
  }
  if (sort === "closing") {
    return sorted.sort((a, b) => a.endsInMinutes - b.endsInMinutes);
  }
  return sorted.sort((a, b) => getDealDiscount(b) - getDealDiscount(a));
}

const HOME_SECTION_LIMIT = 4;

export function getTodayGroupBuyDeals(deals: Deal[], limit = HOME_SECTION_LIMIT): Deal[] {
  const todayDeals = deals.filter((deal) => deal.section === "main");
  return (todayDeals.length > 0 ? todayDeals : deals).slice(0, limit);
}

export function getClosingSoonDeals(deals: Deal[], limit = HOME_SECTION_LIMIT): Deal[] {
  return sortDeals(deals, "closing").slice(0, limit);
}

export function getPopularDeals(deals: Deal[], limit = HOME_SECTION_LIMIT): Deal[] {
  return sortDeals(deals, "popular").slice(0, limit);
}

export function getRecentJoinedDeals(deals: Deal[], limit = HOME_SECTION_LIMIT): Deal[] {
  return [...deals]
    .sort((a, b) => {
      const aScore = a.participants + (a.soldQuantity ?? 0);
      const bScore = b.participants + (b.soldQuantity ?? 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function getNewDeals(deals: Deal[], limit = HOME_SECTION_LIMIT): Deal[] {
  return [...deals].sort((a, b) => b.id - a.id).slice(0, limit);
}

/** @deprecated Use getDealsBySection */
export function getDealsByCategory(category: DealSectionCategory) {
  return getDealsBySection(category);
}
