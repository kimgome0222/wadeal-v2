import { shouldUseMockData } from "@/lib/env/runtime";
import { maskAuthorName } from "@/lib/reviews/review-rules";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SellerReviewFilter =
  | "all"
  | "rating5"
  | "rating4"
  | "rating3_or_below"
  | "no_reply"
  | "has_reply"
  | "reported";

const SELLER_REVIEW_FILTERS: SellerReviewFilter[] = [
  "all",
  "rating5",
  "rating4",
  "rating3_or_below",
  "no_reply",
  "has_reply",
  "reported",
];

export function isSellerReviewFilter(value: string): value is SellerReviewFilter {
  return (SELLER_REVIEW_FILTERS as readonly string[]).includes(value);
}

export type SellerReviewReply = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type SellerReviewListItem = {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  contentPreview: string;
  author: string;
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
  hasReply: boolean;
  isReported: boolean;
};

export type SellerReviewDetail = SellerReviewListItem & {
  content: string;
  images: string[];
  orderId: string | null;
  reply: SellerReviewReply | null;
};

const REVIEW_SELECT =
  "id, user_id, order_id, product_id, product_name, rating, content, images, is_verified_purchase, status, created_at";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}

function previewContent(content: string, max = 80): string {
  const trimmed = content.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max)}…`;
}

function parseImages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function applyFilter(items: SellerReviewListItem[], filter: SellerReviewFilter): SellerReviewListItem[] {
  switch (filter) {
    case "rating5":
      return items.filter((item) => item.rating === 5);
    case "rating4":
      return items.filter((item) => item.rating === 4);
    case "rating3_or_below":
      return items.filter((item) => item.rating <= 3);
    case "no_reply":
      return items.filter((item) => !item.hasReply);
    case "has_reply":
      return items.filter((item) => item.hasReply);
    case "reported":
      return items.filter((item) => item.isReported);
    default:
      return items;
  }
}

async function getSellerProductSlugs(sellerUserId: string): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("created_by", sellerUserId);

  return (data ?? []).map((row) => row.slug as string).filter(Boolean);
}

export async function getSellerReviews(
  sellerUserId: string,
  filter: SellerReviewFilter = "all",
): Promise<SellerReviewListItem[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const mock: SellerReviewListItem[] = [
        {
          id: "mock-seller-review-1",
          productId: "wd-citrus-001",
          productName: "제주 감귤",
          rating: 5,
          contentPreview: "당도가 정말 좋아요.",
          author: "김**",
          isVerifiedPurchase: true,
          status: "visible",
          createdAt: "2026-05-20",
          hasReply: false,
          isReported: false,
        },
      ];
      return applyFilter(mock, filter);
    }
    return [];
  }

  const productSlugs = await getSellerProductSlugs(sellerUserId);
  if (productSlugs.length === 0) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .in("product_id", productSlugs)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (error || !reviews) {
    console.error("[seller-reviews] getSellerReviews:", error?.message);
    return [];
  }

  const reviewIds = reviews.map((row) => row.id as string);
  const replyMap = new Map<string, SellerReviewReply>();

  if (reviewIds.length > 0) {
    const { data: replies } = await supabase
      .from("review_replies")
      .select("id, review_id, body, created_at, updated_at")
      .in("review_id", reviewIds);

    for (const row of replies ?? []) {
      const record = row as Record<string, unknown>;
      replyMap.set(record.review_id as string, {
        id: record.id as string,
        body: record.body as string,
        createdAt: record.created_at as string,
        updatedAt: record.updated_at as string,
      });
    }
  }

  const items: SellerReviewListItem[] = reviews.map((row) => {
    const content = (row.content as string) ?? "";
    const status = (row.status as string) ?? "visible";
    return {
      id: row.id as string,
      productId: row.product_id as string,
      productName: (row.product_name as string) ?? row.product_id,
      rating: row.rating as number,
      contentPreview: previewContent(content),
      author: maskAuthorName("", row.user_id as string),
      isVerifiedPurchase: Boolean(row.is_verified_purchase),
      status,
      createdAt: formatDate(row.created_at as string),
      hasReply: replyMap.has(row.id as string),
      isReported: status === "reported",
    };
  });

  return applyFilter(items, filter);
}

export async function getSellerReviewById(
  sellerUserId: string,
  reviewId: string,
): Promise<SellerReviewDetail | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const list = await getSellerReviews(sellerUserId);
      const item = list.find((review) => review.id === reviewId);
      if (!item) {
        return null;
      }
      return {
        ...item,
        content: item.contentPreview,
        images: [],
        orderId: null,
        reply: null,
      };
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: review, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("id", reviewId)
    .maybeSingle();

  if (error || !review) {
    return null;
  }

  const productSlugs = await getSellerProductSlugs(sellerUserId);
  if (!productSlugs.includes(review.product_id as string)) {
    return null;
  }

  const { data: replyRow } = await supabase
    .from("review_replies")
    .select("id, body, created_at, updated_at")
    .eq("review_id", reviewId)
    .maybeSingle();

  const replyRecord = replyRow as Record<string, unknown> | null;

  const content = (review.content as string) ?? "";
  const status = (review.status as string) ?? "visible";

  return {
    id: review.id as string,
    productId: review.product_id as string,
    productName: (review.product_name as string) ?? review.product_id,
    rating: review.rating as number,
    contentPreview: previewContent(content),
    content,
    images: parseImages(review.images),
    author: maskAuthorName("", review.user_id as string),
    isVerifiedPurchase: Boolean(review.is_verified_purchase),
    status,
    createdAt: formatDate(review.created_at as string),
    orderId: (review.order_id as string | null) ?? null,
    hasReply: Boolean(replyRecord),
    isReported: status === "reported",
    reply:
      replyRecord ?
        {
          id: replyRecord.id as string,
          body: replyRecord.body as string,
          createdAt: replyRecord.created_at as string,
          updatedAt: replyRecord.updated_at as string,
        }
      : null,
  };
}

export async function upsertSellerReviewReply(input: {
  sellerId: string;
  sellerUserId: string;
  reviewId: string;
  body: string;
}): Promise<{ success: boolean; error?: "invalid_input" | "not_found" | "forbidden" | "save_failed" }> {
  const body = input.body.trim();
  if (!body) {
    return { success: false, error: "invalid_input" };
  }

  const review = await getSellerReviewById(input.sellerUserId, input.reviewId);
  if (!review) {
    return { success: false, error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();

  if (review.reply) {
    const { error } = await supabase
      .from("review_replies")
      .update({ body, updated_at: now } as never)
      .eq("id", review.reply.id)
      .eq("seller_id", input.sellerId);

    if (error) {
      console.error("[seller-reviews] update reply:", error.message);
      return { success: false, error: "save_failed" };
    }

    return { success: true };
  }

  const { error } = await supabase.from("review_replies").insert({
    review_id: input.reviewId,
    seller_id: input.sellerId,
    user_id: input.sellerUserId,
    body,
    updated_at: now,
  } as never);

  if (error) {
    console.error("[seller-reviews] insert reply:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function hideSellerReviewReply(input: {
  sellerId: string;
  sellerUserId: string;
  reviewId: string;
}): Promise<{ success: boolean; error?: "not_found" | "save_failed" }> {
  const review = await getSellerReviewById(input.sellerUserId, input.reviewId);
  if (!review?.reply) {
    return { success: false, error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("review_replies")
    .delete()
    .eq("id", review.reply.id)
    .eq("seller_id", input.sellerId);

  if (error) {
    console.error("[seller-reviews] hide reply:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}
