import type { Deal } from "@/lib/deals";

import type { SellerBadgeId, SellerProfile } from "./types";

export type ShowcaseSellerMock = {
  id: string;
  name: string;
  intro: string;
  story: string;
  productName: string;
  productPrice: number;
  chips: string[];
};

export const SHOWCASE_SELLER_MOCKS: ShowcaseSellerMock[] = [
  {
    id: "moon-fruit",
    name: "달빛과수원",
    intro: "매일 아침 선별한 제철 과일을 보내는 산지 셀러예요.",
    story:
      "과일은 당도만큼 신선도가 중요하다고 생각해요. 매일 아침 가장 상태 좋은 과일만 선별해 보내드립니다. 고당도 감귤처럼 산지에서 바로 포장하는 상품을 중심으로 소개해요.",
    productName: "고당도 감귤",
    productPrice: 12900,
    chips: ["산지직송", "제철과일", "당일선별"],
  },
  {
    id: "living-lab",
    name: "살림연구소",
    intro: "집안일을 가볍게 만드는 생활용품을 직접 써보고 골라요.",
    story:
      "매일 쓰는 생활용품일수록 품질과 가격의 균형이 중요해요. 도톰한 물티슈처럼 직접 사용해 본 뒤, 오래 쓸 수 있는 제품만 소개합니다.",
    productName: "도톰한 물티슈",
    productPrice: 9900,
    chips: ["생활필수품", "가성비", "직접검수"],
  },
  {
    id: "only-celloh-kitchen",
    name: "온리셀로키친",
    intro: "바쁜 일상에도 맛있게 즐길 수 있는 간편식을 큐레이션해요.",
    story:
      "조리 시간은 줄이고 맛은 포기하지 않는 메뉴를 고릅니다. 직화 닭갈비처럼 데워 먹기 좋은 한 끼를 중심으로 소개해요.",
    productName: "직화 닭갈비",
    productPrice: 16900,
    chips: ["간편식", "직화", "푸드"],
  },
  {
    id: "lumi-beauty",
    name: "루미뷰티",
    intro: "매일 쓰기 좋은 순한 뷰티템을 성분부터 골라요.",
    story:
      "피부가 예민한 사람도 편하게 쓸 수 있는 데일리 뷰티템을 고릅니다. 진정 마스크팩처럼 과한 성분보다 꾸준히 손이 가는 제품을 좋아해요.",
    productName: "진정 마스크팩",
    productPrice: 7900,
    chips: ["순한성분", "데일리뷰티", "큐레이션"],
  },
  {
    id: "celloh-fresh",
    name: "셀로프레시",
    intro: "신선함을 지키는 포장과 빠른 배송으로 재구매가 많은 셀러예요.",
    story:
      "신선식품은 포장과 배송 속도가 품질을 좌우한다고 믿어요. 샐러드팩처럼 받자마자 바로 드실 수 있는 구성을 중심으로 보내드립니다.",
    productName: "신선 샐러드팩",
    productPrice: 8900,
    chips: ["신선식품", "재구매", "빠른배송"],
  },
  {
    id: "daily-home",
    name: "데일리홈",
    intro: "매일 쓰는 생활필수품을 합리적인 가격으로 제안해요.",
    story:
      "대용량·가성비·실용성을 기준으로 생활용품을 고릅니다. 세제처럼 자주 쓰는 품목은 가격 대비 용량을 꼼꼼히 비교해요.",
    productName: "대용량 세제",
    productPrice: 13900,
    chips: ["생활필수품", "대용량", "가성비"],
  },
  {
    id: "bake-day",
    name: "베이크데이",
    intro: "갓 구운 빵의 향을 집까지 전해드리는 베이커리 셀러예요.",
    story:
      "아침 식사나 간식으로 즐기기 좋은 빵을 중심으로 소개합니다. 버터 크루아상처럼 구운 직후 포장해 신선함을 지키려고 해요.",
    productName: "버터 크루아상",
    productPrice: 6900,
    chips: ["베이커리", "아침", "인기"],
  },
  {
    id: "petmily",
    name: "펫밀리",
    intro: "반려동물의 건강과 행복을 먼저 생각하는 간식·용품 셀러예요.",
    story:
      "원료와 급여 대상을 꼼꼼히 확인한 뒤 상품을 고릅니다. 수제간식처럼 우리 아이가 좋아하는 맛과 안전성을 함께 보는 편이에요.",
    productName: "강아지 수제간식",
    productPrice: 11900,
    chips: ["반려동물", "수제간식", "건강"],
  },
];

const SHOWCASE_BY_ID = new Map(
  SHOWCASE_SELLER_MOCKS.map((seller) => [seller.id.toLowerCase(), seller]),
);

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

export function findShowcaseSellerMock(routeId: string): ShowcaseSellerMock | null {
  return SHOWCASE_BY_ID.get(routeId.toLowerCase()) ?? null;
}

export function buildShowcaseSellerProfile(
  mock: ShowcaseSellerMock,
  catalog: Deal[],
): SellerProfile {
  const seed = hashSeed(mock.id);
  const featured =
    catalog.find((deal) => deal.title.includes(mock.productName.slice(0, 2))) ??
    catalog[seed % Math.max(catalog.length, 1)] ??
    catalog[0];

  const repurchaseRate = 35 + (seed % 25);
  const inquiryResponseRate = 88 + (seed % 10);
  const badges: SellerBadgeId[] = ["verified"];
  if (repurchaseRate >= 40) {
    badges.push("high_repurchase");
  }
  if (inquiryResponseRate >= 90) {
    badges.push("fast_response");
  }
  if (seed % 2 === 0) {
    badges.push("popular");
  }

  return {
    id: mock.id,
    name: mock.name,
    tagline: mock.intro,
    rating: 4.5 + (seed % 5) / 10,
    reviewCount: 120 + (seed % 800),
    totalSales: 800 + (seed % 1200),
    repurchaseRate,
    inquiryResponseRate,
    isVerified: true,
    badges: [...new Set(badges)].slice(0, 4),
    featuredProductSlug: featured?.slug ?? "",
    featuredProductTitle: mock.productName,
    productCount: 12 + (seed % 20),
  };
}

export function resolveShowcaseSellerProfile(
  routeId: string,
  catalog: Deal[],
): SellerProfile | null {
  const mock = findShowcaseSellerMock(routeId);
  if (!mock || catalog.length === 0) {
    return null;
  }

  return buildShowcaseSellerProfile(mock, catalog);
}

export function getShowcaseSellerDeals(profile: SellerProfile, catalog: Deal[]): Deal[] {
  const byBrand = catalog.filter((deal) => resolveSellerName(deal) === profile.name);
  if (byBrand.length > 0) {
    return [...byBrand].sort((a, b) => b.participants - a.participants);
  }

  const seed = hashSeed(profile.id);
  return [...catalog]
    .sort((a, b) => ((a.id + seed) % 17) - ((b.id + seed) % 17) || b.participants - a.participants)
    .slice(0, 12);
}

export function getShowcaseSellerStory(routeId: string): string | null {
  return findShowcaseSellerMock(routeId)?.story ?? null;
}
