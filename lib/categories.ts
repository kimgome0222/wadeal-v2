export type CategorySlug =
  | "all"
  | "closing-soon"
  | "food"
  | "digital"
  | "fashion"
  | "living"
  | "beauty"
  | "pet";

export const categoryNavItems: {
  label: string;
  slug: CategorySlug;
}[] = [
  { label: "전체", slug: "all" },
  { label: "오늘마감", slug: "closing-soon" },
  { label: "식품", slug: "food" },
  { label: "디지털", slug: "digital" },
  { label: "패션", slug: "fashion" },
  { label: "생활", slug: "living" },
  { label: "뷰티", slug: "beauty" },
  { label: "반려", slug: "pet" },
];

export const categoryTitles: Record<CategorySlug, string> = {
  all: "전체 공동구매",
  "closing-soon": "오늘 마감",
  food: "식품",
  digital: "디지털",
  fashion: "패션",
  living: "생활용품",
  beauty: "뷰티",
  pet: "반려동물",
};

export function isCategorySlug(slug: string): slug is CategorySlug {
  return slug in categoryTitles;
}
