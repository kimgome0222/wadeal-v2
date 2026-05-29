export type CategorySlug =
  | "all"
  | "closing-soon"
  | "food"
  | "digital"
  | "fashion"
  | "living"
  | "beauty"
  | "pet"
  | "baby"
  | "local";

export const homeCategoryChips: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "전체", slug: "all" },
  { label: "인기", slug: "closing-soon" },
  { label: "식품", slug: "food" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "가전", slug: "digital" },
  { label: "패션", slug: "fashion" },
  { label: "반려", slug: "pet" },
  { label: "육아", slug: "baby" },
  { label: "특산", slug: "local" },
];

/** 쿠팡형 홈 카테고리 아이콘 (가로 스크롤 1줄) */
export const homeCategoryIcons: {
  slug: CategorySlug;
  label: string;
  glyph: string;
  tone: string;
}[] = [
  { slug: "all", label: "전체", glyph: "🔥", tone: "bg-wadeal-surface text-wadeal-red" },
  { slug: "closing-soon", label: "인기", glyph: "⏰", tone: "bg-wadeal-cream text-wadeal-coral" },
  { slug: "food", label: "식품", glyph: "🍎", tone: "bg-[#FFF8EF] text-[#E28A3B]" },
  { slug: "living", label: "생활", glyph: "🏠", tone: "bg-sky-50 text-sky-700" },
  { slug: "beauty", label: "뷰티", glyph: "✨", tone: "bg-[#FFF8EF] text-[#E28A3B]" },
  { slug: "digital", label: "가전", glyph: "📱", tone: "bg-indigo-50 text-indigo-600" },
  { slug: "fashion", label: "패션", glyph: "👕", tone: "bg-violet-50 text-violet-600" },
  { slug: "pet", label: "반려", glyph: "🐾", tone: "bg-amber-50 text-amber-700" },
  { slug: "baby", label: "육아", glyph: "👶", tone: "bg-teal-50 text-teal-700" },
  { slug: "local", label: "특산", glyph: "🎁", tone: "bg-green-50 text-green-700" },
];

export const categoryNavItems: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "추천", slug: "all" },
  { label: "인기", slug: "closing-soon" },
  { label: "식품", slug: "food" },
  { label: "가전", slug: "digital" },
  { label: "의류", slug: "fashion" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "반려동물", slug: "pet" },
];

export const categoryTitles: Record<CategorySlug, string> = {
  all: "추천",
  "closing-soon": "인기",
  food: "식품",
  digital: "디지털/가전",
  fashion: "패션잡화",
  living: "생활용품",
  beauty: "뷰티",
  pet: "반려동물",
  baby: "육아",
  local: "지역특산물",
};

export function isCategorySlug(slug: string): slug is CategorySlug {
  return slug in categoryTitles;
}
