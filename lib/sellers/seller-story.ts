import type { Deal } from "@/lib/deals";

import { resolveSellerProfileForDeal } from "./home-sellers";

export type SellerStoryBlock = {
  title: string;
  body: string;
};

export type SellerStoryContent = {
  sellerName: string;
  blocks: SellerStoryBlock[];
};

const STORY_TEMPLATES: Record<string, SellerStoryBlock[]> = {
  올리브하우스: [
    {
      title: "왜 이 상품을 만들었나요?",
      body: "제주에서 직접 맛본 식재료만 고객에게 전하고 싶어 시작했습니다.",
    },
    {
      title: "어떻게 생산하나요?",
      body: "소규모 농가와 계약 재배하고, 수확 후 바로 선별·포장합니다.",
    },
    {
      title: "브랜드 철학",
      body: "생산자의 이름을 숨기지 않고, 먹는 사람이 누구의 손길인지 알 수 있게 합니다.",
    },
  ],
};

function defaultStory(sellerName: string, productTitle: string): SellerStoryBlock[] {
  return [
    {
      title: "판매자 소개",
      body: `${sellerName}은(는) celloh에서 좋은 재료와 과정을 중요하게 생각하는 판매자입니다.`,
    },
    {
      title: "왜 이 상품을 만들었나요?",
      body: `“${productTitle}”은(는) 고객의 일상에 자연스럽게 스며드는 품질을 목표로 만들었습니다.`,
    },
    {
      title: "어떻게 생산하나요?",
      body: "원재료 선별부터 포장·배송 안내까지 판매자가 직접 기준을 관리합니다.",
    },
    {
      title: "브랜드 철학",
      body: "좋은 상품은 좋은 판매자에게서 시작됩니다. 누가 만들었는지 알고 사세요.",
    },
  ];
}

export function buildSellerStory(deal: Deal): SellerStoryContent {
  const seller = resolveSellerProfileForDeal(deal);
  const blocks = STORY_TEMPLATES[seller.name] ?? defaultStory(seller.name, deal.title);

  return {
    sellerName: seller.name,
    blocks,
  };
}
