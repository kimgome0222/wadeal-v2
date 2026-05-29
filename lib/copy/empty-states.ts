/**
 * 홈·카탈로그 빈 상태 / 로딩 copy (운영 단계 UI).
 */
export const CELLOH_EMPTY_STATES = {
  recommendedSellerProducts: {
    title: "추천 판매자의 상품이 아직 없어요.",
    description: "좋은 판매자의 상품을 준비 중이에요. 곧 만나보실 수 있어요.",
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
    description: "관심 상품과 판매자를 저장하려면 로그인해주세요.",
  },
} as const;

export const CELLOH_AUTH_COPY = {
  loginRequiredTitle: "로그인이 필요해요.",
  loginRequiredDescription:
    "관심 상품과 판매자를 저장하려면 로그인해주세요.",
  permissionDenied: "이 기능을 사용할 권한이 없어요.",
  genericError: "잠시 후 다시 시도해 주세요.",
} as const;
