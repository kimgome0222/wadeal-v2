export type SignupHeroSlide = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  /** CSS background (gradient) */
  background: string;
  accentColor: string;
};

export const SIGNUP_HERO_SLIDES: SignupHeroSlide[] = [
  {
    id: "brand",
    href: "#",
    eyebrow: "celloh",
    title: "누가 만들었는지 알고 사세요.",
    description: "좋은 상품은 좋은 판매자에게서 시작됩니다.",
    cta: "둘러보기",
    background: "linear-gradient(135deg, #2E5E4E 0%, #244C3F 55%, #1F3D34 100%)",
    accentColor: "#E28A3B",
  },
  {
    id: "seller",
    href: "#",
    eyebrow: "판매자 신뢰",
    title: "인증 판매자를 먼저 만나보세요.",
    description: "스토리와 후기로 판매자를 확인할 수 있어요.",
    cta: "판매자 둘러보기",
    background: "linear-gradient(135deg, #F5F8F4 0%, #E8EDEA 100%)",
    accentColor: "#2E5E4E",
  },
  {
    id: "review",
    href: "#",
    eyebrow: "구매 후기",
    title: "실제 구매자의 리뷰를 확인하세요.",
    description: "상품과 판매자 모두 투명하게 공개됩니다.",
    cta: "리뷰 보기",
    background: "linear-gradient(135deg, #FFF8EF 0%, #F5EDE0 100%)",
    accentColor: "#E28A3B",
  },
  {
    id: "welcome",
    href: "#",
    eyebrow: "회원 혜택",
    title: "celloh와 함께 시작해 보세요.",
    description: "찜, 주문, 판매자 팔로우를 한 계정으로.",
    cta: "가입하기",
    background: "linear-gradient(120deg, #2E5E4E 0%, #3A7563 45%, #E28A3B 120%)",
    accentColor: "#FFFFFF",
  },
];

export const SIGNUP_HERO_AUTO_MS_DESKTOP = 5500;
/** @deprecated 모바일 자동 슬라이드 비활성 — {@link SIGNUP_HERO_AUTO_MS_DESKTOP} 사용 */
export const SIGNUP_HERO_AUTO_MS = SIGNUP_HERO_AUTO_MS_DESKTOP;
export const SIGNUP_HERO_TRANSITION_MS = 500;
