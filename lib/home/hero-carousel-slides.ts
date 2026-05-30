export type HomeHeroSlide = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  /** 줄바꿈은 \n */
  description: string;
  cta: string;
  backgroundColor: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export const HOME_HERO_AUTO_MS = 5000;
export const HOME_HERO_TRANSITION_MS = 480;

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: "brand",
    href: "/category/all",
    eyebrow: "celloh",
    title: "누가 만들었는지 알고 사세요.",
    description: "좋은 상품은 좋은 판매자에게서 시작됩니다.",
    cta: "상품 둘러보기",
    backgroundColor: "#2E5E4E",
  },
  {
    id: "weekly-sellers",
    href: "/search?q=추천판매자",
    eyebrow: "This Week",
    title: "이번 주 추천 판매자",
    description: "평점과 판매 이력이 좋은 판매자를 만나보세요.",
    cta: "판매자 보기",
    backgroundColor: "#355F52",
  },
  {
    id: "top-rated",
    href: "/category/popular",
    eyebrow: "Top Rated",
    title: "평점 높은 판매자",
    description: "실제 구매자의 평가가 좋은 상품을 모았어요.",
    cta: "인기 상품 보기",
    backgroundColor: "#3D6858",
  },
  {
    id: "new-sellers",
    href: "/category/new-sellers",
    eyebrow: "New Seller",
    title: "신규 입점 판매자",
    description: "새롭게 입점한 셀로 판매자를 소개합니다.",
    cta: "신규 판매자 보기",
    backgroundColor: "#446F5F",
  },
];
