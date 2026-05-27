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
  digital: "가전",
  fashion: "의류",
  living: "생활",
  beauty: "뷰티",
  pet: "반려동물",
};

export function isCategorySlug(slug: string): slug is CategorySlug {
  return slug in categoryTitles;
}
