export type HomeQuickMenuItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
};

/** 홈 Quick Menu — 단일 source of truth (collections 연결) */
export const HOME_QUICK_MENU_ITEMS: HomeQuickMenuItem[] = [
  { id: "today-special", label: "오늘의특가", glyph: "⚡", href: "/collections/today-special" },
  { id: "recommended", label: "추천상품", glyph: "👍", href: "/collections/recommended" },
  { id: "celloh-coupon", label: "셀로쿠폰", glyph: "🎫", href: "/collections/celloh-coupon" },
  { id: "invite", label: "지인초대", glyph: "🤝", href: "/invite" },
  { id: "popular-sellers", label: "인기 판매자", glyph: "👑", href: "/collections/popular-sellers" },
  { id: "ending-sale", label: "마감세일", glyph: "⏰", href: "/collections/ending-sale" },
  { id: "popular", label: "실시간 인기상품", glyph: "🔥", href: "/collections/popular" },
  { id: "weekend-special", label: "주말특가", glyph: "🎉", href: "/collections/weekend-special" },
  { id: "ranking", label: "카테고리 랭킹", glyph: "🏆", href: "/collections/ranking" },
  { id: "lowest", label: "오늘의 최저가 상품", glyph: "💰", href: "/collections/lowest" },
  { id: "only-celloh", label: "셀로단독특가", glyph: "✨", href: "/collections/only-celloh" },
  { id: "coupon-sale", label: "쿠폰세일", glyph: "🎟️", href: "/collections/coupon-sale" },
  { id: "repurchase", label: "재구매율 높은 상품", glyph: "🔁", href: "/collections/repurchase" },
  { id: "seasonal", label: "AI기반 계절상품", glyph: "🌿", href: "/collections/seasonal" },
  { id: "new", label: "신규상품", glyph: "🆕", href: "/collections/new" },
  { id: "new-sellers", label: "신규 입점 판매자", glyph: "🏪", href: "/collections/new-sellers" },
  { id: "membership", label: "셀로 멤버십", glyph: "💎", href: "/membership" },
];
