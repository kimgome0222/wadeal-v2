import { getDealById } from "@/lib/data/deals";
import type { UserProductReview } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import {
  getReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";

export type MypageWritableReviewItem = {
  order: UserOrderRecord;
  imageUrl: string;
};

export type MypageWrittenReviewItem = UserProductReview & {
  imageUrl: string;
};

export async function buildWritableReviewItems(
  orders: UserOrderRecord[],
  reviewedOrderIds: string[],
): Promise<MypageWritableReviewItem[]> {
  const reviewedSet = new Set(reviewedOrderIds);
  const writable = orders.filter(
    (order) => getReviewWriteStatus(order, reviewedSet.has(order.id)) === "writable",
  );

  const items = await Promise.all(
    writable.map(async (order) => {
      const deal = await getDealById(order.productId);
      return {
        order,
        imageUrl: deal?.imageUrl ?? "",
      };
    }),
  );

  return items;
}

export async function buildWrittenReviewItems(
  reviews: UserProductReview[],
): Promise<MypageWrittenReviewItem[]> {
  const items = await Promise.all(
    reviews.map(async (review) => {
      const deal = await getDealById(review.productId);
      return {
        ...review,
        imageUrl: deal?.imageUrl ?? "",
      };
    }),
  );

  return items;
}

export function resolveDealImage(deals: Deal[], productId: string): string {
  return deals.find((deal) => deal.slug === productId)?.imageUrl ?? "";
}
