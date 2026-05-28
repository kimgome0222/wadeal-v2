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
  { label: "마감임박", slug: "closing-soon" },
  { label: "식품", slug: "food" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "가전", slug: "digital" },
  { label: "패션", slug: "fashion" },
  { label: "반려", slug: "pet" },
  { label: "육아", slug: "baby" },
  { label: "특산", slug: "local" },
];

export const categoryNavItems: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "추천", slug: "all" },
  { label: "마감임박", slug: "closing-soon" },
  { label: "식품", slug: "food" },
  { label: "가전", slug: "digital" },
  { label: "의류", slug: "fashion" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "반려동물", slug: "pet" },
];

export const categoryTitles: Record<CategorySlug, string> = {
  all: "추천",
  "closing-soon": "마감임박",
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
