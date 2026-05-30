export type HomeQuickMenuItemType = "seller" | "product" | "category" | "event";

export type HomeQuickMenuItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
  type: HomeQuickMenuItemType;
};

/**
 * 홈 Quick Menu — 단일 source of truth.
 * slug는 food/living/beauty/fashion/digital/pet 기준 (`/category/living`, not `/category/life`).
 */
export const HOME_QUICK_MENU_ITEMS: HomeQuickMenuItem[] = [
  {
    id: "popular-sellers",
    label: "인기판매자",
    glyph: "👑",
    href: "/sellers?sort=popular",
    type: "seller",
  },
  {
    id: "new-sellers",
    label: "신규입점",
    glyph: "✨",
    href: "/sellers?sort=new",
    type: "seller",
  },
  {
    id: "best",
    label: "베스트",
    glyph: "🏆",
    href: "/search?sort=best",
    type: "product",
  },
  {
    id: "special",
    label: "특가",
    glyph: "💰",
    href: "/search?filter=deal",
    type: "product",
  },
  {
    id: "food",
    label: "식품",
    glyph: "🍎",
    href: "/category/food",
    type: "category",
  },
  {
    id: "living",
    label: "생활",
    glyph: "🏠",
    href: "/category/living",
    type: "category",
  },
  {
    id: "beauty",
    label: "뷰티",
    glyph: "💄",
    href: "/category/beauty",
    type: "category",
  },
  {
    id: "fashion",
    label: "패션",
    glyph: "👕",
    href: "/category/fashion",
    type: "category",
  },
  {
    id: "pet",
    label: "반려",
    glyph: "🐾",
    href: "/category/pet",
    type: "category",
  },
  {
    id: "events",
    label: "이벤트",
    glyph: "🎁",
    href: "/search?filter=event",
    type: "event",
  },
];
