export type CommerceQuickMenuItem = {
  id: string;
  label: string;
  glyph: string;
  href: string;
};

/** 홈 Quick Menu — 구매 유도 10개 (명시적 href 배열) */
export const COMMERCE_QUICK_MENU_ITEMS: CommerceQuickMenuItem[] = [
  { id: "only-celloh", label: "단독특가", glyph: "✨", href: "/search?filter=only-celloh" },
  { id: "flash-sale", label: "깜짝세일", glyph: "⚡", href: "/search?filter=flash-sale" },
  { id: "deal", label: "특가", glyph: "💰", href: "/search?filter=deal" },
  { id: "live", label: "라이브커머스", glyph: "📺", href: "/search?filter=live" },
  { id: "members", label: "셀로멤버스", glyph: "👑", href: "/search?filter=members" },
  { id: "new-june", label: "6월 신상품", glyph: "🆕", href: "/search?filter=new&month=6" },
  { id: "ranking", label: "인기랭킹", glyph: "🏆", href: "/search?sort=ranking" },
  { id: "coupon", label: "쿠폰상품", glyph: "🎟️", href: "/search?filter=coupon" },
  { id: "ending", label: "마감세일", glyph: "⏰", href: "/search?filter=ending-soon" },
  { id: "free-ship", label: "무료배송", glyph: "🚚", href: "/search?filter=free-shipping" },
];
