import type { CategorySlug } from "@/lib/categories";

export type AppCategoryBarItem = {
  label: string;
  href: string;
  slug?: CategorySlug | "benefits" | "seller-news";
};

/** 마켓컬리형 sticky 카테고리 바 — 기존 category/search route 사용 */
export const APP_CATEGORY_BAR_ITEMS: AppCategoryBarItem[] = [
  { label: "전체", href: "/category/all", slug: "all" },
  { label: "식품", href: "/category/food", slug: "food" },
  { label: "생활", href: "/category/living", slug: "living" },
  { label: "뷰티", href: "/category/beauty", slug: "beauty" },
  { label: "패션", href: "/category/fashion", slug: "fashion" },
  { label: "디지털", href: "/category/digital", slug: "digital" },
  { label: "반려동물", href: "/category/pet", slug: "pet" },
  { label: "혜택", href: "/mypage/benefits", slug: "benefits" },
  { label: "판매자소식", href: "/search?q=판매자", slug: "seller-news" },
];
