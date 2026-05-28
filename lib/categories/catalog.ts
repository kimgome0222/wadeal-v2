import type { CategorySlug } from "@/lib/categories";

export type SubCategorySlug = string;

export type SubCategoryItem = {
  slug: SubCategorySlug;
  label: string;
  /** 상품 category_tags·keywords 매칭용 */
  matchTags: string[];
};

export type CategoryTreeItem = {
  slug: CategorySlug;
  label: string;
  subcategories: SubCategoryItem[];
};

/** 쿠팡·오늘의집형 대/소 카테고리 (정적 — DB 없어도 필터 동작) */
export const CATEGORY_CATALOG: CategoryTreeItem[] = [
  {
    slug: "food",
    label: "식품",
    subcategories: [
      { slug: "food-fresh", label: "신선식품", matchTags: ["fresh", "과일", "채소", "정육", "수산"] },
      { slug: "food-processed", label: "가공식품", matchTags: ["processed", "간식", "라면", "통조림"] },
      { slug: "food-health", label: "건강식품", matchTags: ["health", "영양", "프로틴", "비타민"] },
      { slug: "food-drink", label: "음료", matchTags: ["drink", "커피", "주스", "생수"] },
    ],
  },
  {
    slug: "living",
    label: "생활",
    subcategories: [
      { slug: "living-kitchen", label: "주방", matchTags: ["kitchen", "주방", "조리"] },
      { slug: "living-bath", label: "욕실", matchTags: ["bath", "욕실", "수건"] },
      { slug: "living-clean", label: "청소", matchTags: ["clean", "세제", "청소"] },
      { slug: "living-storage", label: "수납", matchTags: ["storage", "수납", "정리"] },
    ],
  },
  {
    slug: "beauty",
    label: "뷰티",
    subcategories: [
      { slug: "beauty-skincare", label: "스킨케어", matchTags: ["skincare", "스킨", "크림"] },
      { slug: "beauty-makeup", label: "메이크업", matchTags: ["makeup", "립", "파운데이션"] },
      { slug: "beauty-hair", label: "헤어", matchTags: ["hair", "샴푸", "트리트먼트"] },
      { slug: "beauty-body", label: "바디", matchTags: ["body", "바디", "로션"] },
    ],
  },
  {
    slug: "digital",
    label: "가전·디지털",
    subcategories: [
      { slug: "digital-appliance", label: "생활가전", matchTags: ["appliance", "청소기", "공기청정"] },
      { slug: "digital-kitchen", label: "주방가전", matchTags: ["kitchen-appliance", "에어프라이어", "믹서"] },
      { slug: "digital-it", label: "IT·액세서리", matchTags: ["it", "이어폰", "충전"] },
      { slug: "digital-mobile", label: "모바일", matchTags: ["mobile", "케이스", "거치대"] },
    ],
  },
  {
    slug: "fashion",
    label: "패션",
    subcategories: [
      { slug: "fashion-women", label: "여성", matchTags: ["women", "여성"] },
      { slug: "fashion-men", label: "남성", matchTags: ["men", "남성"] },
      { slug: "fashion-acc", label: "잡화", matchTags: ["acc", "가방", "모자"] },
      { slug: "fashion-inner", label: "속옷", matchTags: ["inner", "속옷", "양말"] },
    ],
  },
  {
    slug: "pet",
    label: "반려동물",
    subcategories: [
      { slug: "pet-food", label: "사료·간식", matchTags: ["pet-food", "사료", "간식"] },
      { slug: "pet-supplies", label: "용품", matchTags: ["pet-supplies", "배변", "장난감"] },
      { slug: "pet-groom", label: "미용·위생", matchTags: ["pet-groom", "샴푸", "위생"] },
    ],
  },
  {
    slug: "baby",
    label: "육아",
    subcategories: [
      { slug: "baby-diaper", label: "기저귀·물티슈", matchTags: ["diaper", "기저귀", "물티슈"] },
      { slug: "baby-feed", label: "수유·이유식", matchTags: ["feed", "수유", "이유식"] },
      { slug: "baby-care", label: "스킨·목욕", matchTags: ["baby-care", "목욕", "스킨"] },
    ],
  },
  {
    slug: "local",
    label: "지역특산",
    subcategories: [
      { slug: "local-fruit", label: "과일·채소", matchTags: ["local-fruit", "감귤", "사과"] },
      { slug: "local-meat", label: "정육·수산", matchTags: ["local-meat", "한우", "수산"] },
      { slug: "local-gift", label: "선물세트", matchTags: ["gift", "선물", "세트"] },
    ],
  },
];

export function getCategoryTree(slug: CategorySlug): CategoryTreeItem | undefined {
  return CATEGORY_CATALOG.find((item) => item.slug === slug);
}

export function getSubCategory(
  parentSlug: CategorySlug,
  subSlug: string,
): SubCategoryItem | undefined {
  return getCategoryTree(parentSlug)?.subcategories.find((item) => item.slug === subSlug);
}

export function dealMatchesSubCategory(
  deal: import("@/lib/deals").Deal,
  sub: SubCategoryItem,
): boolean {
  const haystack = [
    ...deal.categoryTags,
    ...(deal.searchKeywords ?? []),
    deal.title,
    deal.brandName ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return sub.matchTags.some((tag) => haystack.includes(tag.toLowerCase()));
}
