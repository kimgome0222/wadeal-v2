import type { Deal } from "@/lib/deals";

import type { SellerProfile } from "@/lib/sellers/types";

export type HomeSellerStory = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  summary: string;
  imageUrl: string;
  href: string;
};

const STORY_TITLES: { match: string; title: string; summary: string }[] = [
  {
    match: "Farm",
    title: "한라농장이 좋은 감귤을 고르는 법",
    summary: "제주 햇살 아래 익은 감귤만 선별해 보내는 이유와 과수원 이야기.",
  },
  {
    match: "올리브",
    title: "매일 아침 직접 선별하는 이유",
    summary: "소량 생산·신선 배송을 고집하는 올리브하우스의 하루.",
  },
  {
    match: "Glow",
    title: "성분표부터 읽는 뷰티 브랜드",
    summary: "피부에 닿는 성분을 투명하게 공개하는 GlowLab의 기준.",
  },
  {
    match: "Tech",
    title: "생활을 편하게 만드는 작은 디자인",
    summary: "TechPouch가 제품 하나를 기획할 때 지키는 원칙.",
  },
  {
    match: "Pet",
    title: "반려동물 건강을 먼저 생각합니다",
    summary: "PetNature가 사료 원료를 고르는 과정.",
  },
  {
    match: "완도",
    title: "바다에서 식탁까지, 신선함의 거리",
    summary: "완도바다가 수산물을 포장·배송하는 방식.",
  },
];

function pickStoryCopy(sellerName: string, index: number) {
  const matched = STORY_TITLES.find((item) => sellerName.includes(item.match));
  if (matched) {
    return { title: matched.title, summary: matched.summary };
  }

  const fallback = STORY_TITLES[index % STORY_TITLES.length]!;
  return {
    title: `${sellerName}의 이야기`,
    summary: fallback.summary,
  };
}

export function buildHomeSellerStories(
  sellers: SellerProfile[],
  deals: Deal[],
  limit = 6,
): HomeSellerStory[] {
  return sellers.slice(0, limit).map((seller, index) => {
    const deal =
      deals.find((item) => item.slug === seller.featuredProductSlug) ??
      deals.find((item) => (item.brandName?.trim() || "celloh 셀러") === seller.name) ??
      deals[index % deals.length]!;
    const copy = pickStoryCopy(seller.name, index);

    return {
      id: `story-${seller.id}`,
      sellerId: seller.id,
      sellerName: seller.name,
      title: copy.title,
      summary: copy.summary,
      imageUrl: deal?.imageUrl ?? "",
      href: `/sellers/${encodeURIComponent(seller.id)}`,
    };
  });
}
