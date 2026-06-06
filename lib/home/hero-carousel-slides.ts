export type HomeHeroSlide = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  /** 줄바꿈은 \n */
  description: string;
  cta: string;
  backgroundColor: string;
  /** primary: white pill · accent: #E28A3B CTA */
  ctaVariant?: "primary" | "accent";
  imageUrl?: string | null;
  imageAlt?: string;
};

export const HOME_HERO_AUTO_MS = 4000;
export const HOME_HERO_TRANSITION_MS = 480;

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: "special-price",
    href: "/search?filter=deal",
    eyebrow: "오늘의 특가",
    title: "지금 담기 좋은 특가",
    description: "마감 전에 확인하세요.",
    cta: "특가 보기",
    backgroundColor: "#2E5E4E",
    ctaVariant: "primary",
  },
  {
    id: "weekend-sale",
    href: "/search?filter=ending-soon",
    eyebrow: "주말 한정 세일",
    title: "주말만 이 가격",
    description: "이번 주말 한정 할인 상품.",
    cta: "세일 보기",
    backgroundColor: "#355F52",
    ctaVariant: "primary",
  },
  {
    id: "coupon",
    href: "/search?filter=coupon",
    eyebrow: "쿠폰 적용 상품",
    title: "쿠폰으로 더 저렴하게",
    description: "쿠폰 적용 가능 상품을 모았어요.",
    cta: "쿠폰 상품 보기",
    backgroundColor: "#3D6858",
    ctaVariant: "primary",
  },
  {
    id: "frequently-added",
    href: "/category/popular",
    eyebrow: "많이 담은 상품",
    title: "지금 많이 담는 상품",
    description: "실시간으로 많이 담기는 상품이에요.",
    cta: "인기 상품 보기",
    backgroundColor: "#2E5E4E",
    ctaVariant: "primary",
  },
];
