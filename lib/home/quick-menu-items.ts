export type HomeQuickMenuItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
};

export const HOME_QUICK_MENU_ITEMS: HomeQuickMenuItem[] = [
  { id: "popular-sellers", label: "인기판매자", glyph: "👑", href: "/search?q=인기판매자" },
  { id: "new-sellers", label: "신규입점", glyph: "✨", href: "/category/new-sellers" },
  { id: "best", label: "베스트", glyph: "🏆", href: "/category/popular" },
  { id: "special", label: "특가", glyph: "💰", href: "/category/closing-soon" },
  { id: "food", label: "식품", glyph: "🍎", href: "/category/food" },
  { id: "living", label: "생활", glyph: "🏠", href: "/category/living" },
  { id: "beauty", label: "뷰티", glyph: "💄", href: "/category/beauty" },
  { id: "fashion", label: "패션", glyph: "👕", href: "/category/fashion" },
  { id: "pet", label: "반려", glyph: "🐾", href: "/category/pet" },
  { id: "events", label: "이벤트", glyph: "🎁", href: "/events" },
];
