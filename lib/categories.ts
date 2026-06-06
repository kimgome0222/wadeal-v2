import type { DealSortOption } from "@/lib/search/types";

export type CategorySlug =
  | "all"
  | "recommended"
  | "popular"
  | "new-sellers"
  | "closing-soon"
  | "food"
  | "digital"
  | "fashion"
  | "living"
  | "beauty"
  | "pet"
  | "baby"
  | "local";

/** 카테고리·검색 목록 상단 pill */
export const homeCategoryChips: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "전체", slug: "all" },
  { label: "추천", slug: "recommended" },
  { label: "인기", slug: "popular" },
  { label: "신규", slug: "new-sellers" },
  { label: "식품", slug: "food" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "패션", slug: "fashion" },
  { label: "디지털", slug: "digital" },
  { label: "반려", slug: "pet" },
  { label: "키즈", slug: "baby" },
  { label: "선물", slug: "local" },
];

export type HomeCategoryIcon = {
  id: string;
  label: string;
  glyph: string;
  tone: string;
  href: string;
};

const iconTone = "bg-white text-wadeal-ink ring-1 ring-wadeal-line/80";

/** 홈 상단 탐색 — 짧은 테마·카테고리 (마켓컬리형) */
export const homeCategoryIcons: HomeCategoryIcon[] = [
  { id: "all", label: "전체", glyph: "⊞", tone: iconTone, href: "/category/all" },
  {
    id: "recommended",
    label: "오늘의 추천",
    glyph: "✦",
    tone: iconTone,
    href: "/category/recommended",
  },
  {
    id: "popular",
    label: "인기 상품",
    glyph: "★",
    tone: iconTone,
    href: "/category/popular",
  },
  {
    id: "new-sellers",
    label: "신규 입점",
    glyph: "◎",
    tone: iconTone,
    href: "/category/new-sellers",
  },
  { id: "food", label: "식품", glyph: "🍎", tone: iconTone, href: "/category/food" },
  { id: "living", label: "생활용품", glyph: "🏠", tone: iconTone, href: "/category/living" },
  { id: "beauty", label: "뷰티", glyph: "✨", tone: iconTone, href: "/category/beauty" },
  { id: "fashion", label: "패션", glyph: "👕", tone: iconTone, href: "/category/fashion" },
  {
    id: "kitchen",
    label: "키친",
    glyph: "🍳",
    tone: iconTone,
    href: "/category/living?sub=living-kitchen",
  },
  {
    id: "home-deco",
    label: "홈데코",
    glyph: "🪴",
    tone: iconTone,
    href: "/category/living?sub=living-storage",
  },
  { id: "digital", label: "디지털", glyph: "📱", tone: iconTone, href: "/category/digital" },
  { id: "pet", label: "반려동물", glyph: "🐾", tone: iconTone, href: "/category/pet" },
  { id: "kids", label: "키즈", glyph: "🧸", tone: iconTone, href: "/category/baby" },
  {
    id: "gift",
    label: "선물",
    glyph: "🎁",
    tone: iconTone,
    href: "/category/local?sub=local-gift",
  },
];

export const categoryNavItems: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "전체", slug: "all" },
  { label: "추천", slug: "recommended" },
  { label: "인기", slug: "popular" },
  { label: "식품", slug: "food" },
  { label: "디지털", slug: "digital" },
  { label: "패션", slug: "fashion" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "반려", slug: "pet" },
];

export const categoryTitles: Record<CategorySlug, string> = {
  all: "전체",
  recommended: "오늘의 추천",
  popular: "인기 상품",
  "new-sellers": "신규 입점",
  "closing-soon": "인기 상품",
  food: "식품",
  digital: "디지털",
  fashion: "패션",
  living: "생활용품",
  beauty: "뷰티",
  pet: "반려동물",
  baby: "키즈",
  local: "선물",
};

/** 테마형 카테고리 — 상품 전체 대상, 정렬만 다름 */
export const themeCategorySlugs = new Set<CategorySlug>([
  "all",
  "recommended",
  "popular",
  "new-sellers",
  "closing-soon",
]);

export const themeCategoryDefaultSort: Partial<Record<CategorySlug, DealSortOption>> = {
  recommended: "seller-trust",
  popular: "popular",
  "new-sellers": "seller-new",
  "closing-soon": "popular",
};

export function isCategorySlug(slug: string): slug is CategorySlug {
  return slug in categoryTitles;
}

export function isThemeCategorySlug(slug: CategorySlug): boolean {
  return themeCategorySlugs.has(slug);
}

/** @deprecated slug 기반 — {@link homeCategoryIcons} 의 href 사용 */
export function getHomeCategoryHref(slug: CategorySlug): string {
  return slug === "all" ? "/category/all" : `/category/${slug}`;
}
