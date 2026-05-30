import type { CategorySlug } from "@/lib/categories";
import type { Deal } from "@/lib/deals";

export type CategoryDisplaySub = {
  slug: string;
  label: string;
  glyph: string;
  matchTags: string[];
};

/** 카테고리 패널 UI용 하위 카테고리 (정적 mock — DB 변경 없음) */
export const CATEGORY_DISPLAY_SUBCATEGORIES: Partial<
  Record<CategorySlug, CategoryDisplaySub[]>
> = {
  food: [
    { slug: "fruit", label: "과일", glyph: "🍊", matchTags: ["과일", "fruit", "감귤", "사과"] },
    { slug: "meat", label: "정육", glyph: "🥩", matchTags: ["정육", "meat", "한우"] },
    { slug: "seafood", label: "수산", glyph: "🐟", matchTags: ["수산", "seafood", "전복"] },
    { slug: "vegetable", label: "채소", glyph: "🥬", matchTags: ["채소", "vegetable", "샐러드"] },
    { slug: "meal", label: "간편식", glyph: "🍱", matchTags: ["간편식", "meal", "라면"] },
    { slug: "coffee", label: "커피", glyph: "☕", matchTags: ["커피", "coffee"] },
    { slug: "drink", label: "음료", glyph: "🥤", matchTags: ["음료", "drink", "주스", "생수"] },
    { slug: "dairy", label: "유제품", glyph: "🥛", matchTags: ["유제품", "dairy", "우유"] },
    { slug: "egg", label: "계란", glyph: "🥚", matchTags: ["계란", "egg"] },
    { slug: "kimchi", label: "김치", glyph: "🌶️", matchTags: ["김치", "kimchi"] },
  ],
  living: [
    { slug: "detergent", label: "세제", glyph: "🧴", matchTags: ["세제", "detergent", "clean"] },
    { slug: "tissue", label: "휴지", glyph: "🧻", matchTags: ["휴지", "tissue"] },
    { slug: "wipes", label: "물티슈", glyph: "💧", matchTags: ["물티슈", "wipes"] },
    { slug: "storage", label: "수납", glyph: "📦", matchTags: ["수납", "storage", "정리"] },
    { slug: "kitchen", label: "주방용품", glyph: "🍳", matchTags: ["주방", "kitchen", "조리"] },
    { slug: "bath", label: "욕실용품", glyph: "🛁", matchTags: ["욕실", "bath", "수건"] },
  ],
  beauty: [
    { slug: "skincare", label: "스킨케어", glyph: "🧴", matchTags: ["skincare", "스킨", "크림"] },
    { slug: "cleansing", label: "클렌징", glyph: "🫧", matchTags: ["cleansing", "클렌저"] },
    { slug: "suncare", label: "선케어", glyph: "☀️", matchTags: ["suncare", "선크림"] },
    { slug: "mask", label: "마스크팩", glyph: "🎭", matchTags: ["mask", "마스크"] },
    { slug: "handcare", label: "핸드케어", glyph: "🤲", matchTags: ["hand", "핸드", "로션"] },
    { slug: "makeup", label: "메이크업", glyph: "💄", matchTags: ["makeup", "립", "파운데이션"] },
  ],
  fashion: [
    { slug: "top", label: "상의", glyph: "👕", matchTags: ["top", "상의", "티셔츠"] },
    { slug: "bottom", label: "하의", glyph: "👖", matchTags: ["bottom", "하의", "바지"] },
    { slug: "bag", label: "가방", glyph: "👜", matchTags: ["bag", "가방", "에코백"] },
    { slug: "shoes", label: "신발", glyph: "👟", matchTags: ["shoes", "신발", "운동화"] },
    { slug: "accessory", label: "액세서리", glyph: "💍", matchTags: ["acc", "액세서리", "모자"] },
    { slug: "socks", label: "양말", glyph: "🧦", matchTags: ["socks", "양말", "inner"] },
  ],
  digital: [
    { slug: "charger", label: "충전기", glyph: "🔌", matchTags: ["charger", "충전"] },
    { slug: "earphone", label: "이어폰", glyph: "🎧", matchTags: ["earphone", "이어폰", "it"] },
    { slug: "keyboard", label: "키보드", glyph: "⌨️", matchTags: ["keyboard", "키보드"] },
    { slug: "mouse", label: "마우스", glyph: "🖱️", matchTags: ["mouse", "마우스"] },
    { slug: "battery", label: "보조배터리", glyph: "🔋", matchTags: ["battery", "보조배터리"] },
    { slug: "cable", label: "케이블", glyph: "🔗", matchTags: ["cable", "케이블"] },
  ],
  pet: [
    { slug: "feed", label: "사료", glyph: "🦴", matchTags: ["pet-food", "사료", "feed"] },
    { slug: "snack", label: "간식", glyph: "🍖", matchTags: ["snack", "간식"] },
    { slug: "toy", label: "장난감", glyph: "🎾", matchTags: ["toy", "장난감"] },
    { slug: "potty", label: "배변용품", glyph: "🧻", matchTags: ["potty", "배변"] },
    { slug: "groom", label: "미용용품", glyph: "✂️", matchTags: ["groom", "미용", "샴푸"] },
    { slug: "house", label: "하우스", glyph: "🏠", matchTags: ["house", "하우스"] },
  ],
};

export function getCategoryDisplaySubcategories(
  slug: CategorySlug,
): CategoryDisplaySub[] {
  return CATEGORY_DISPLAY_SUBCATEGORIES[slug] ?? [];
}

export function getCategoryDisplaySub(
  slug: CategorySlug,
  subSlug: string,
): CategoryDisplaySub | undefined {
  return getCategoryDisplaySubcategories(slug).find((item) => item.slug === subSlug);
}

export function dealMatchesDisplaySub(deal: Deal, sub: CategoryDisplaySub): boolean {
  const haystack = [
    deal.title,
    deal.brandName ?? "",
    ...(deal.searchKeywords ?? []),
    ...(deal.categoryTags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return sub.matchTags.some((tag) => haystack.includes(tag.toLowerCase()));
}
