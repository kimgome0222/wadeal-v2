/**
 * CELLOH UX writing — buttons, empty states, cart, errors (display only).
 * See docs/CELLOH_UX_WRITING_GUIDE.md
 */
import { CELLOH_BRAND as BRAND_DISPLAY } from "@/lib/copy/display-copy";

export const CELLOH_BRAND = {
  ...BRAND_DISPLAY,
  trust: "판매자 정보와 상품 혜택을 한눈에 확인하세요.",
  couponHint: "조금만 더 담으면 더 큰 혜택을 받을 수 있어요.",
} as const;

export const CELLOH_BUTTONS = {
  cart: "장바구니",
  buy: "구매하기",
  pay: "결제하기",
  applyCoupon: "쿠폰 적용",
  filter: "필터",
  sort: "정렬",
  addToCart: "담기",
  viewSeller: "판매자 보기",
  copyInviteLink: "초대 링크 복사",
  copyInviteCode: "초대 코드 복사",
  inquiry: "1:1 문의하기",
  writeReview: "리뷰 작성하기",
  retry: "다시 시도하기",
  goHome: "홈으로 돌아가기",
  viewCart: "장바구니 보기",
  browseProducts: "상품 둘러보기",
  support: "고객센터",
  back: "이전 페이지",
} as const;

export const CELLOH_EMPTY = {
  cart: {
    title: "장바구니가 비어 있어요",
    description: "필요한 상품을 담아보세요.",
  },
  search: {
    title: "찾는 상품이 아직 없어요",
    description: "다른 검색어로 다시 찾아보세요.",
  },
  review: {
    title: "아직 리뷰가 없어요",
    description: "첫 번째 리뷰를 기다리고 있어요.",
  },
  inquiry: {
    title: "아직 등록된 문의가 없어요",
    description: "상품이 궁금하다면 문의를 남겨보세요.",
  },
  coupon: {
    title: "사용할 수 있는 쿠폰이 없어요",
    description: "새로운 혜택이 생기면 알려드릴게요.",
  },
  notification: {
    title: "아직 받은 알림이 없어요",
    description: "주문·배송·혜택 소식이 여기에 표시돼요.",
  },
  recentViews: {
    title: "최근 본 상품이 없어요",
    description: "상품을 둘러보면 여기에 자동으로 모여요.",
  },
  savedDeals: {
    title: "저장한 상품이 아직 없어요",
    description: "관심 상품을 저장해 두면 나중에 쉽게 다시 볼 수 있어요.",
  },
  sellerProducts: {
    title: "등록된 상품이 아직 없어요",
    description: "판매자의 첫 상품을 준비 중이에요.",
  },
  categoryProducts: {
    title: "아직 등록된 상품이 없어요",
    description: "첫 상품을 준비 중이에요. 곧 만나보실 수 있어요.",
  },
  recommendedSellerProducts: {
    title: "추천 판매자의 상품이 아직 없어요.",
    description: "좋은 판매자의 상품을 준비 중이에요. 곧 만나보실 수 있어요.",
  },
  popularSellerProducts: {
    title: "인기 상품을 준비 중이에요.",
    description: "인기 상품을 곧 만나보실 수 있어요.",
  },
  specialPriceProducts: {
    title: "특가 상품을 준비 중이에요.",
    description: "좋은 상품을 특별한 가격으로 곧 만나보실 수 있어요.",
  },
  newSellerProducts: {
    title: "신규 판매자 상품을 준비 중이에요.",
    description: "새롭게 입점하는 판매자의 첫 상품을 곧 공개합니다.",
  },
  sellerReviews: {
    title: "판매자 리뷰가 아직 없어요.",
    description: "구매 후 판매자에 대한 후기가 쌓이면 여기에 표시됩니다.",
  },
  followedSellers: {
    title: "팔로우한 판매자가 아직 없어요.",
    description: "마음에 드는 판매자를 팔로우하면 새 상품 소식을 받아볼 수 있어요.",
  },
  orders: {
    title: "아직 주문이 없어요.",
    description: "마음에 드는 상품을 찾아 첫 주문을 시작해 보세요.",
  },
} as const;

export const CELLOH_CART_COPY = {
  couponApplied: (amount: string) => `${amount} 쿠폰이 자동 적용됐어요`,
  couponNextHint: (amount: string) => `조금만 더 담으면 ${amount} 쿠폰을 쓸 수 있어요`,
  couponMoreBenefit: CELLOH_BRAND.couponHint,
  couponRemaining: (discount: string, remaining: string) =>
    `${discount} 쿠폰까지 ${remaining}원 남았어요`,
  freeShippingApplied: "조건 충족 시 무료배송이 적용됐어요",
  freeShippingRemaining: (remaining: string) => `무료배송까지 ${remaining}원 남았어요`,
  fillRecommendTitle: "쿠폰 금액 맞추기 추천",
  upsellTitle: "함께 구매하면 좋아요",
} as const;

export const CELLOH_PRODUCT_DETAIL = {
  quantityTierTitle: "수량 구간별 혜택가",
  quantityTierLabel: (minQty: number, discount: string) => `${minQty}개 이상 ${discount}`,
  sameSellerTitle: "판매자의 다른 상품",
  relatedTitle: "관련 추천상품",
  relatedSubtitle: "함께 보면 좋은 상품이에요",
  reviewPurchaseOnly: "구매한 고객만 리뷰를 작성할 수 있어요.",
  inquiryPrompt: "상품에 대해 궁금한 점을 남겨보세요.",
  shippingReturns: "배송/교환/반품",
  reviews: "후기",
  inquiry: "문의",
} as const;

export const CELLOH_ERRORS = {
  genericTitle: "문제가 발생했어요",
  genericDescription: "잠시 후 다시 시도해 주세요.",
  paymentFailedTitle: "결제에 실패했어요",
  paymentFailedDescription: "결제수단을 확인하고 다시 시도해 주세요.",
  loginRequiredTitle: "로그인이 필요해요",
  loginRequiredDescription: "계속하려면 먼저 로그인해 주세요.",
  productNotFoundTitle: "상품을 찾을 수 없어요",
  productNotFoundDescription: "다른 상품을 둘러보세요.",
  permissionDeniedTitle: "접근 권한이 없어요",
  permissionDeniedDescription:
    "필요한 권한이 있는 계정으로 다시 로그인해 주세요.",
  networkDescription: "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
} as const;

export const CELLOH_AUTH_COPY = {
  loginRequiredTitle: CELLOH_ERRORS.loginRequiredTitle,
  loginRequiredDescription: CELLOH_ERRORS.loginRequiredDescription,
  permissionDenied: CELLOH_ERRORS.permissionDeniedTitle,
  genericError: CELLOH_ERRORS.genericDescription,
} as const;

export const CELLOH_FORBIDDEN_PHRASES = [
  "전국 최저가",
  "무조건 최저",
  "100% 환불 보장",
  "반드시 최저",
  "업계 1위",
] as const;
