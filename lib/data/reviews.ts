import { canWriteReview } from "@/lib/orders/shipping-status";
import {
  getAverageRating,
  getRatingDistribution,
  type ReviewRatingBar,
} from "@/lib/reviews/rating-utils";
import {
  getReviewWriteStatus,
  maskAuthorName,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import { getUserOrderForProduct } from "@/lib/data/orders";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notifyAdminProhibitedKeywordDetected } from "@/lib/notifications/admin-events";
import { notifySellerNewReview } from "@/lib/notifications/seller-events";
import { resolveProductSellerContext } from "@/lib/notifications/product-seller";
import { detectProhibitedKeywords } from "@/lib/content/prohibited-keywords";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[reviews] using mock fallback: ${context}`);
  }
}

export type ProductReviewItem = {
  id: string;
  userId: string;
  orderId: string | null;
  rating: number;
  content: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: string;
  author: string;
  createdAt: string;
  createdAtIso: string;
};

export type ReviewSummary = {
  averageRating: number;
  totalCount: number;
  distribution: ReviewRatingBar[];
};

export type CreateReviewInput = {
  productId: string;
  productName: string;
  rating: number;
  content: string;
  images?: string[];
};

export type CreateReviewResult = {
  success: boolean;
  id?: string;
  error?:
    | "login_required"
    | "invalid_rating"
    | "invalid_content"
    | "order_not_found"
    | "review_window_expired"
    | "awaiting_confirmation"
    | "already_reviewed"
    | "save_failed";
};

export type UpdateReviewInput = {
  reviewId: string;
  productId: string;
  rating: number;
  content: string;
  images?: string[];
};

export type DeleteReviewInput = {
  reviewId: string;
  productId: string;
};

export type MutateReviewResult = {
  success: boolean;
  error?:
    | "login_required"
    | "invalid_rating"
    | "invalid_content"
    | "not_found"
    | "forbidden"
    | "save_failed";
};

type ReviewRow = {
  id: string;
  user_id: string;
  order_id: string | null;
  product_id: string;
  product_name: string;
  rating: number;
  content: string;
  images: string[] | null;
  is_verified_purchase: boolean;
  status: string;
  created_at: string;
};

const REVIEW_SELECT =
  "id, user_id, order_id, product_id, product_name, rating, content, images, is_verified_purchase, status, created_at";

const mockReviewsByProduct: Record<string, ProductReviewItem[]> = {
  "wd-citrus-001": [
    {
      id: "mock-review-citrus-1",
      userId: "mock-reviewer-1",
      orderId: "mock-order-citrus-1",
      rating: 5,
      content: "당도가 정말 좋아요. 다음에도 다시 구매하고 싶어요!",
      images: [],
      isVerifiedPurchase: true,
      status: "visible",
      author: "김**",
      createdAt: "2026-05-20",
      createdAtIso: "2026-05-20T10:00:00.000Z",
    },
    {
      id: "mock-review-citrus-2",
      userId: "mock-reviewer-2",
      orderId: "mock-order-citrus-2",
      rating: 4,
      content: "배송도 빠르고 과일 상태가 깨끗했어요.",
      images: [],
      isVerifiedPurchase: true,
      status: "visible",
      author: "이**",
      createdAt: "2026-05-18",
      createdAtIso: "2026-05-18T10:00:00.000Z",
    },
  ],
  "wd-beef-001": [
    {
      id: "mock-review-beef-1",
      userId: "mock-reviewer-3",
      orderId: "mock-order-beef-1",
      rating: 5,
      content: "육질이 부드럽고 양념과도 잘 어울려요.",
      images: [],
      isVerifiedPurchase: true,
      status: "visible",
      author: "박**",
      createdAt: "2026-05-19",
      createdAtIso: "2026-05-19T10:00:00.000Z",
    },
  ],
};

function getMockReviews(productId: string): ProductReviewItem[] {
  return (mockReviewsByProduct[productId] ?? []).map((review) => ({ ...review }));
}

function mockReviewsOrEmpty(productId: string): ProductReviewItem[] {
  return shouldUseMockData() ? getMockReviews(productId) : [];
}

function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseReviewImages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function mapReviewRow(row: ReviewRow): ProductReviewItem {
  return {
    id: row.id,
    userId: row.user_id,
    orderId: row.order_id,
    rating: row.rating,
    content: row.content,
    images: parseReviewImages(row.images),
    isVerifiedPurchase: Boolean(row.is_verified_purchase),
    status: row.status ?? "visible",
    author: maskAuthorName("", row.user_id),
    createdAt: formatReviewDate(row.created_at),
    createdAtIso: row.created_at,
  };
}

function computeSummary(reviews: ProductReviewItem[]): ReviewSummary {
  return {
    averageRating: getAverageRating(reviews),
    totalCount: reviews.length,
    distribution: getRatingDistribution(reviews),
  };
}

export async function getReviewsByProductId(
  productId: string,
): Promise<ProductReviewItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getReviewsByProductId: Supabase is not configured");
    return mockReviewsOrEmpty(productId);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getReviewsByProductId: failed to create Supabase client");
    return mockReviewsOrEmpty(productId);
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("product_id", productId)
    .eq("status", "visible")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data] getReviewsByProductId:", error.message);
    logMockFallback("getReviewsByProductId: query error");
    return mockReviewsOrEmpty(productId);
  }

  const rows = (data ?? []).map((row) => mapReviewRow(row as ReviewRow));
  if (rows.length === 0) {
    logMockFallback("getReviewsByProductId: empty result");
    return mockReviewsOrEmpty(productId);
  }

  return rows;
}

export function buildReviewSummary(reviews: ProductReviewItem[]): ReviewSummary {
  return computeSummary(reviews);
}

export async function getReviewSummaryByProductId(
  productId: string,
): Promise<ReviewSummary> {
  const reviews = await getReviewsByProductId(productId);
  return computeSummary(reviews);
}

export async function userHasReviewForOrder(
  userId: string,
  orderId: string,
): Promise<boolean> {
  if (!orderId || !isSupabaseConfigured()) {
    return false;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("order_id", orderId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) {
    console.error("[data] userHasReviewForOrder:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function userHasReviewForProduct(
  userId: string,
  productId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) {
    console.error("[data] userHasReviewForProduct:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function getUserReviewedOrderIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("order_id")
    .eq("user_id", userId)
    .neq("status", "deleted");

  if (error) {
    console.error("[data] getUserReviewedOrderIds:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.order_id as string | null)
    .filter((orderId): orderId is string => Boolean(orderId));
}

export async function getUserReviewedProductIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("user_id", userId)
    .neq("status", "deleted");

  if (error) {
    console.error("[data] getUserReviewedProductIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.product_id as string);
}

export type UserProductReview = ProductReviewItem & {
  productId: string;
  productName: string;
};

export async function getReviewsByUserId(userId: string): Promise<UserProductReview[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("user_id", userId)
    .eq("status", "visible")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data] getReviewsByUserId:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const typed = row as ReviewRow;
    return {
      ...mapReviewRow(typed),
      productId: typed.product_id,
      productName: typed.product_name,
    };
  });
}

function validateReviewContent(
  rating: number,
  content: string,
): MutateReviewResult | null {
  const safeRating = Math.round(rating);
  if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) {
    return { success: false, error: "invalid_rating" };
  }

  if (!content.trim()) {
    return { success: false, error: "invalid_content" };
  }

  return null;
}

function validateReviewInput(input: CreateReviewInput): CreateReviewResult | null {
  const rating = Math.round(input.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "invalid_rating" };
  }

  const content = input.content.trim();
  if (!content) {
    return { success: false, error: "invalid_content" };
  }

  if (!input.productId.trim() || !input.productName.trim()) {
    return { success: false, error: "save_failed" };
  }

  return null;
}

async function assertReviewEligibility(
  userId: string,
  productId: string,
): Promise<CreateReviewResult | { order: UserOrderRecord }> {
  const order = await getUserOrderForProduct(userId, productId);
  if (!order || order.userId !== userId) {
    return { success: false, error: "order_not_found" };
  }

  const hasWritten = await userHasReviewForOrder(userId, order.id);
  const status = getReviewWriteStatus(order, hasWritten);

  if (status === "completed") {
    return { success: false, error: "already_reviewed" };
  }

  if (status === "awaiting_confirmation") {
    return { success: false, error: "awaiting_confirmation" };
  }

  if (status === "expired" || !canWriteReview(order)) {
    return { success: false, error: "review_window_expired" };
  }

  return { order };
}

export async function createReview(
  userId: string,
  input: CreateReviewInput,
): Promise<CreateReviewResult> {
  const validationError = validateReviewInput(input);
  if (validationError) {
    return validationError;
  }

  const eligibility = await assertReviewEligibility(userId, input.productId);
  if ("success" in eligibility) {
    return eligibility;
  }

  const { order } = eligibility;
  const images = (input.images ?? []).filter((url) => url.trim().length > 0);

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-review" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: dealRow } = await supabase
    .from("products")
    .select("id")
    .eq("slug", input.productId.trim())
    .maybeSingle();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      order_id: order.id,
      deal_id: (dealRow as { id: string } | null)?.id ?? null,
      product_id: input.productId.trim(),
      product_name: input.productName.trim(),
      rating: Math.round(input.rating),
      content: input.content.trim(),
      images,
      is_verified_purchase: true,
      status: "visible",
    } as never)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "already_reviewed" };
    }
    console.error("[data] createReview:", error.message);
    return { success: false, error: "save_failed" };
  }

  const reviewId = (data as { id: string }).id;
  const matchedKeywords = detectProhibitedKeywords(
    [input.productName, input.content, ...images].join(" "),
  );
  if (matchedKeywords.length > 0) {
    await notifyAdminProhibitedKeywordDetected({
      source: "review",
      matchedKeywords,
      excerpt: input.content.trim().slice(0, 120),
      linkUrl: "/admin/reviews",
    });
  }

  const sellerContext = await resolveProductSellerContext(input.productId.trim());
  if (sellerContext) {
    await notifySellerNewReview({
      sellerUserId: sellerContext.sellerUserId,
      productName: sellerContext.productName,
      rating: Math.round(input.rating),
    });
  }

  return { success: true, id: reviewId };
}

async function getOwnedReview(
  reviewId: string,
  userId: string,
): Promise<{ id: string; product_id: string; user_id: string; status: string } | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, user_id, status")
    .eq("id", reviewId)
    .maybeSingle();

  if (error) {
    console.error("[data] getOwnedReview:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as { id: string; product_id: string; user_id: string; status: string };
  if (row.user_id !== userId || row.status === "deleted") {
    return null;
  }

  return row;
}

export async function updateReview(
  userId: string,
  input: UpdateReviewInput,
): Promise<MutateReviewResult> {
  const validationError = validateReviewContent(input.rating, input.content);
  if (validationError) {
    return validationError;
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const ownedReview = await getOwnedReview(input.reviewId, userId);
  if (!ownedReview) {
    return { success: false, error: "forbidden" };
  }

  if (ownedReview.product_id !== input.productId.trim()) {
    return { success: false, error: "not_found" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const patch: Record<string, unknown> = {
    rating: Math.round(input.rating),
    content: input.content.trim(),
  };

  if (input.images) {
    patch.images = input.images.filter((url) => url.trim().length > 0);
  }

  const { error } = await supabase
    .from("reviews")
    .update(patch as never)
    .eq("id", input.reviewId)
    .eq("user_id", userId);

  if (error) {
    console.error("[data] updateReview:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function deleteReview(
  userId: string,
  input: DeleteReviewInput,
): Promise<MutateReviewResult> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const ownedReview = await getOwnedReview(input.reviewId, userId);
  if (!ownedReview) {
    return { success: false, error: "forbidden" };
  }

  if (ownedReview.product_id !== input.productId.trim()) {
    return { success: false, error: "not_found" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status: "deleted" })
    .eq("id", input.reviewId)
    .eq("user_id", userId);

  if (error) {
    console.error("[data] deleteReview:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export { getAverageRating, getRatingDistribution, type ReviewRatingBar };
