import { SHOWCASE_SELLER_MOCKS } from "@/lib/sellers/showcase-seller-profiles";

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

function toShowcaseItem(
  mock: (typeof SHOWCASE_SELLER_MOCKS)[number],
): SellerShowcaseItem {
  return {
    id: mock.id,
    name: mock.name,
    intro: mock.intro,
    productName: mock.productName,
    productPrice: mock.productPrice,
  };
}

export const NEW_SELLER_SHOWCASE: SellerShowcaseItem[] = SHOWCASE_SELLER_MOCKS.slice(0, 4).map(
  toShowcaseItem,
);

export const POPULAR_SELLER_SHOWCASE: SellerShowcaseItem[] = SHOWCASE_SELLER_MOCKS.slice(4, 8).map(
  toShowcaseItem,
);

export const SELLER_STORY_SHOWCASE: SellerStoryShowcaseItem[] = SHOWCASE_SELLER_MOCKS.slice(0, 3).map(
  (mock) => ({
    id: mock.id,
    name: mock.name,
    intro: mock.story,
    chips: mock.chips,
    href: `/sellers/${mock.id}`,
  }),
);
