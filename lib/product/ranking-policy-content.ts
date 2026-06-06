export const RANKING_CRITERIA = [
  "판매량 (최근 7~30일)",
  "최근 조회수",
  "장바구니 담기 수",
  "리뷰 수",
  "별점 평균",
  "재구매율 (mock 지표)",
  "할인율·혜택",
  "신상품 가중치",
] as const;

export const RECOMMENDATION_CRITERIA = [
  "계절·날씨·이벤트 테마",
  "많이 담은 상품 (co-cart mock)",
  "함께 구매한 상품",
  "최근 본 상품",
  "카테고리·선호 기반",
] as const;

export const RANKING_POLICY_NOTICE =
  "아래 기준은 운영 초안 mock 설명입니다. 실제 랭킹·추천 알고리즘은 상용화 시 별도 구현됩니다.";
