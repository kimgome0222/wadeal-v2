export type HomeQuickMenuItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
};

/** 홈 Quick Menu — 단일 source of truth (collections 연결) */
export const HOME_QUICK_MENU_ITEMS: HomeQuickMenuItem[] = [
  { id: "only-celloh", label: "셀로단독특가", glyph: "✨", href: "/collections/only-celloh" },
  { id: "special", label: "오늘의특가", glyph: "⚡", href: "/collections/today-special" },
  { id: "coupon", label: "쿠폰세일", glyph: "🎟️", href: "/collections/coupon-sale" },
  { id: "ending", label: "마감세일", glyph: "⏰", href: "/collections/ending-sale" },
  { id: "weekend", label: "주말특가", glyph: "🎉", href: "/collections/weekend-special" },
  { id: "frequent", label: "많이담은상품", glyph: "🛒", href: "/collections/frequent" },
  { id: "popular", label: "실시간인기상품", glyph: "🔥", href: "/collections/popular" },
  { id: "recommended", label: "추천상품", glyph: "👍", href: "/collections/recommended" },
  { id: "seasonal", label: "AI기반 계절상품", glyph: "🌿", href: "/collections/seasonal" },
  { id: "ranking", label: "카테고리 랭킹", glyph: "🏆", href: "/collections/ranking" },
  { id: "lowest", label: "오늘의 최저가 상품", glyph: "💰", href: "/collections/lowest" },
  { id: "new", label: "신규상품", glyph: "🆕", href: "/collections/new" },
  { id: "popular-sellers", label: "인기셀러", glyph: "👑", href: "/collections/popular-sellers" },
  { id: "live", label: "라이브커머스", glyph: "📺", href: "/collections/live" },
  { id: "celloh-coupon", label: "celloh쿠폰", glyph: "🎫", href: "/collections/celloh-coupon" },
];
