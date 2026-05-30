/**
 * 홈 섹션 노출 문구 — mock 큐레이션 기준, 과장 표현 금지
 * @see docs/CELLOH_PRODUCT_COPY_GUIDE.md
 */

export type HomeSectionCopy = {
  key: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  moreLabel: string;
  moreHref: string;
  badge?: string;
};

export const HOME_SECTION_COPY = {
  "today-special": {
    key: "today-special",
    title: "오늘의특가",
    subtitle: "오늘만 더 좋은 가격으로 만나는 상품",
    shortDescription: "오늘 하루 특별 가격으로 만나는 상품이에요. (mock · 운영 일정에 따라 변경될 수 있어요)",
    moreLabel: "더보기",
    moreHref: "/collections/today-special",
  },
  recommended: {
    key: "recommended",
    title: "추천상품",
    subtitle: "지금 많이 보고 담는 상품을 모았어요",
    shortDescription: "최근 인기, 장바구니 담기, 계절성 등 mock 큐레이션 기준으로 추천해요.",
    moreLabel: "더보기",
    moreHref: "/collections/recommended",
  },
  "ending-sale": {
    key: "ending-sale",
    title: "마감세일",
    subtitle: "오늘 끝나는 혜택, 놓치기 전에 확인해 보세요",
    shortDescription: "오늘 밤 11:59까지 마감되는 특가 상품이에요. (mock · 실제 마감 시각은 운영 설정에 따릅니다)",
    moreLabel: "더보기",
    moreHref: "/collections/ending-sale",
  },
  "popular-sellers": {
    key: "popular-sellers",
    title: "인기 판매자",
    subtitle: "고객이 자주 찾는 판매자를 소개해요",
    shortDescription: "판매 실적·리뷰·응답률 mock 기준으로 선정한 인기 판매자예요.",
    moreLabel: "더보기",
    moreHref: "/collections/popular-sellers",
  },
  popular: {
    key: "popular",
    title: "실시간 인기상품",
    subtitle: "지금 많이 찾는 상품이에요",
    shortDescription: "최근 조회·참여 수 mock 기준으로 정렬한 인기 상품이에요.",
    moreLabel: "더보기",
    moreHref: "/collections/popular",
  },
  "weekend-special": {
    key: "weekend-special",
    title: "주말특가",
    subtitle: "이번 주말만 만나는 특별 가격",
    shortDescription: "이번 주말 한정으로 열리는 특가 상품이에요. (mock · 토·일 운영 가정)",
    moreLabel: "더보기",
    moreHref: "/collections/weekend-special",
  },
  ranking: {
    key: "ranking",
    title: "카테고리 랭킹",
    subtitle: "카테고리별로 많이 찾는 상품이에요",
    shortDescription: "카테고리별 인기 상품을 한곳에서 확인하세요. 랭킹 기준은 안내 페이지를 참고해 주세요.",
    moreLabel: "전체보기",
    moreHref: "/collections/ranking",
  },
  lowest: {
    key: "lowest",
    title: "오늘의 최저가 상품",
    subtitle: "최근 7일 기준 낮은 가격 mock · 실제 최저가 보장 아님",
    shortDescription: "최근 7일 기준 최저가 mock으로 표시된 상품이에요. 가격 비교 참고용입니다.",
    moreLabel: "더보기",
    moreHref: "/collections/lowest",
  },
  "only-celloh": {
    key: "only-celloh",
    title: "셀로단독특가",
    subtitle: "celloh에서만 만나는 구성과 혜택",
    shortDescription: "celloh에서만 만나는 구성과 혜택을 담은 상품이에요. (mock · 단독 구성 안내)",
    moreLabel: "더보기",
    moreHref: "/collections/only-celloh",
    badge: "ONLY CELLOH",
  },
  "coupon-sale": {
    key: "coupon-sale",
    title: "쿠폰세일",
    subtitle: "쿠폰 적용가로 더 부담 없이 담아보세요",
    shortDescription: "쿠폰 적용가로 더 저렴하게 구매할 수 있는 상품이에요. (mock 쿠폰가 표시)",
    moreLabel: "더보기",
    moreHref: "/collections/coupon-sale",
  },
  "celloh-coupon": {
    key: "celloh-coupon",
    title: "셀로쿠폰",
    subtitle: "셀로쿠폰을 적용할 수 있는 상품 모음",
    shortDescription: "셀로쿠폰을 적용할 수 있는 상품 모음이에요. (mock · 실제 지급·적용은 운영 정책에 따릅니다)",
    moreLabel: "더보기",
    moreHref: "/collections/celloh-coupon",
  },
  frequent: {
    key: "frequent",
    title: "많이담은상품",
    subtitle: "장바구니에 자주 담기는 상품이에요",
    shortDescription: "최근 장바구니 담기 mock 기준으로 모은 상품이에요.",
    moreLabel: "더보기",
    moreHref: "/collections/frequent",
  },
  repurchase: {
    key: "repurchase",
    title: "재구매율 높은 상품",
    subtitle: "다시 찾는 고객이 많은 상품이에요",
    shortDescription: "재구매율 mock 기준으로 모은 상품이에요. 추천 참고용입니다.",
    moreLabel: "더보기",
    moreHref: "/collections/repurchase",
  },
  seasonal: {
    key: "seasonal",
    title: "AI기반 계절상품",
    subtitle: "이번 달에 어울리는 상품을 mock 큐레이션으로 추천해요",
    shortDescription: "AI 추천은 현재 월별 mock 큐레이션이에요. 실제 AI API를 호출하지 않아요.",
    moreLabel: "더보기",
    moreHref: "/collections/seasonal",
  },
  new: {
    key: "new",
    title: "신규상품",
    subtitle: "새로 올라온 상품을 먼저 만나보세요",
    shortDescription: "최근 등록된 상품을 모았어요.",
    moreLabel: "더보기",
    moreHref: "/collections/new",
  },
  "new-sellers": {
    key: "new-sellers",
    title: "신규 입점 판매자",
    subtitle: "새롭게 입점한 판매자를 만나보세요",
    shortDescription: "새롭게 입점한 판매자의 대표 상품을 만나보세요. (기획전 mock)",
    moreLabel: "더보기",
    moreHref: "/collections/new-sellers",
  },
  "seller-stories": {
    key: "seller-stories",
    title: "판매자 이야기",
    subtitle: "셀러가 직접 전하는 상품과 브랜드 이야기",
    shortDescription: "판매자 스토리를 통해 상품을 고르는 기준을 확인해 보세요.",
    moreLabel: "더보기",
    moreHref: "/collections/popular-sellers",
  },
  live: {
    key: "live",
    title: "라이브커머스",
    subtitle: "라이브 방송과 함께 보면 좋은 상품",
    shortDescription: "라이브커머스 준비 중이에요. 함께 보면 좋은 추천상품을 둘러보세요.",
    moreLabel: "추천상품 보기",
    moreHref: "/collections/recommended",
  },
} as const satisfies Record<string, HomeSectionCopy>;

export type HomeSectionKey = keyof typeof HOME_SECTION_COPY;

export function getHomeSectionCopy(key: HomeSectionKey): HomeSectionCopy {
  return HOME_SECTION_COPY[key];
}

export function getCollectionEmptyState(key: string): {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
} {
  const fallback = {
    title: "상품을 준비 중이에요",
    description: "추천상품을 대신 보여드릴게요.",
    actionLabel: "추천상품 보기",
    actionHref: "/collections/recommended",
  };

  const byKey: Record<string, typeof fallback> = {
    live: {
      title: "라이브커머스 준비 중",
      description: "방송 일정은 공지를 확인해 주세요. 추천상품을 먼저 둘러보세요.",
      actionLabel: "추천상품 보기",
      actionHref: "/collections/recommended",
    },
    "popular-sellers": {
      title: "판매자를 준비 중이에요",
      description: "인기 판매자 목록을 불러오는 중이에요.",
      actionLabel: "추천상품 보기",
      actionHref: "/collections/recommended",
    },
    "new-sellers": {
      title: "신규 판매자를 준비 중이에요",
      description: "곧 새로운 판매자를 소개할 예정이에요.",
      actionLabel: "인기 판매자 보기",
      actionHref: "/collections/popular-sellers",
    },
  };

  return byKey[key] ?? fallback;
}
