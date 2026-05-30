export type SellerShowcaseItem = {
  id: string;
  name: string;
  intro: string;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
};

export type SellerStoryShowcaseItem = {
  id: string;
  name: string;
  intro: string;
  chips: string[];
  href: string;
};

export const NEW_SELLER_SHOWCASE: SellerShowcaseItem[] = [
  {
    id: "moonlight-farm",
    name: "달빛과수원",
    intro: "매일 아침 선별한 제철 과일을 보내는 산지 셀러",
    productName: "고당도 감귤",
    productPrice: 12900,
  },
  {
    id: "salim-lab",
    name: "살림연구소",
    intro: "집안일을 가볍게 만드는 생활용품을 소개해요",
    productName: "도톰한 물티슈",
    productPrice: 9900,
  },
  {
    id: "only-celloh-kitchen",
    name: "온리셀로키친",
    intro: "간편하지만 맛있는 한 끼를 제안하는 푸드 셀러",
    productName: "직화 닭갈비",
    productPrice: 16900,
  },
  {
    id: "lumi-beauty",
    name: "루미뷰티",
    intro: "매일 쓰기 좋은 순한 뷰티템을 큐레이션해요",
    productName: "진정 마스크팩",
    productPrice: 7900,
  },
];

export const POPULAR_SELLER_SHOWCASE: SellerShowcaseItem[] = [
  {
    id: "celloh-fresh",
    name: "셀로프레시",
    intro: "신선식품 재구매가 많은 인기 셀러",
    productName: "신선 샐러드팩",
    productPrice: 8900,
  },
  {
    id: "daily-home",
    name: "데일리홈",
    intro: "생활필수품을 합리적인 가격으로 제안해요",
    productName: "대용량 세제",
    productPrice: 13900,
  },
  {
    id: "bake-day",
    name: "베이크데이",
    intro: "아침마다 생각나는 베이커리 인기 셀러",
    productName: "버터 크루아상",
    productPrice: 6900,
  },
  {
    id: "pet-family",
    name: "펫밀리",
    intro: "반려동물이 좋아하는 간식과 용품을 모았어요",
    productName: "강아지 수제간식",
    productPrice: 11900,
  },
];

export const SELLER_STORY_SHOWCASE: SellerStoryShowcaseItem[] = [
  {
    id: "moonlight-farm",
    name: "달빛과수원",
    intro:
      "과일은 당도만큼 신선도가 중요하다고 생각해요. 매일 아침 가장 상태 좋은 과일만 선별해 보내드립니다.",
    chips: ["산지직송", "제철과일", "당일선별"],
    href: "/sellers/moonlight-farm",
  },
  {
    id: "salim-lab",
    name: "살림연구소",
    intro:
      "매일 쓰는 생활용품일수록 품질과 가격의 균형이 중요해요. 직접 써보고 오래 쓸 수 있는 제품만 소개합니다.",
    chips: ["생활필수품", "가성비", "직접검수"],
    href: "/sellers/salim-lab",
  },
  {
    id: "lumi-beauty",
    name: "루미뷰티",
    intro:
      "피부가 예민한 사람도 편하게 쓸 수 있는 데일리 뷰티템을 고릅니다. 과한 성분보다 꾸준히 손이 가는 제품을 좋아해요.",
    chips: ["순한성분", "데일리뷰티", "큐레이션"],
    href: "/sellers/lumi-beauty",
  },
];
