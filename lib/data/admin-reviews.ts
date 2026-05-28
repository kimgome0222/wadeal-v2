import {
  getReviewModerationStatusLabel,
  type ReviewModerationStatus,
} from "@/lib/reviews/rating-utils";
import { maskAuthorName, maskUserId } from "@/lib/reviews/review-rules";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminReviewListItem = {
  id: string;
  userId: string;
  maskedUserId: string;
  orderId: string | null;
  productId: string;
  productName: string;
  rating: number;
  content: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: ReviewModerationStatus;
  statusLabel: string;
  author: string;
  createdAt: string;
  createdAtIso: string;
};

export type AdminReviewFilter = "all" | "reported";

export type UpdateAdminReviewStatusResult = {
  success: boolean;
  error?: "not_found" | "invalid_status" | "save_failed" | "forbidden";
};

const REVIEW_SELECT =
  "id, user_id, order_id, product_id, product_name, rating, content, images, is_verified_purchase, status, created_at";

const mockAdminReviews: AdminReviewListItem[] = [
  {
    id: "mock-review-citrus-1",
    userId: "mock-reviewer-1",
    maskedUserId: "mock***1",
    orderId: "mock-order-citrus-1",
    productId: "wd-citrus-001",
    productName: "제주 고당도 감귤 3kg",
    rating: 5,
    content: "당도가 정말 좋아요. 다음에도 같이 구매하고 싶어요!",
    images: [],
    isVerifiedPurchase: true,
    status: "visible",
    statusLabel: getReviewModerationStatusLabel("visible"),
    author: "김**",
    createdAt: "2026-05-20",
    createdAtIso: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "mock-review-beef-1",
    userId: "mock-reviewer-3",
    maskedUserId: "mock***3",
    orderId: "mock-order-beef-1",
    productId: "wd-beef-001",
    productName: "한우 불고기 500g",
    rating: 5,
    content: "육질이 부드럽고 양념과도 잘 어울려요.",
    images: [],
    isVerifiedPurchase: true,
    status: "reported",
    statusLabel: getReviewModerationStatusLabel("reported"),
    author: "박**",
    createdAt: "2026-05-19",
    createdAtIso: "2026-05-19T10:00:00.000Z",
  },
];

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

function mapAdminReviewRow(row: Record<string, unknown>): AdminReviewListItem {
  const userId = row.user_id as string;
  const status = (row.status as ReviewModerationStatus) ?? "visible";

  return {
    id: row.id as string,
    userId,
    maskedUserId: maskUserId(userId),
    orderId: (row.order_id as string | null) ?? null,
    productId: row.product_id as string,
    productName: row.product_name as string,
    rating: row.rating as number,
    content: row.content as string,
    images: parseReviewImages(row.images),
    isVerifiedPurchase: Boolean(row.is_verified_purchase),
    status,
    statusLabel: getReviewModerationStatusLabel(status),
    author: maskAuthorName("", userId),
    createdAt: formatReviewDate(row.created_at as string),
    createdAtIso: row.created_at as string,
  };
}

export async function getAdminReviews(
  filter: AdminReviewFilter = "all",
): Promise<AdminReviewListItem[]> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ?
        mockAdminReviews.filter((review) =>
          filter === "reported" ? review.status === "reported" : true,
        )
      : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? mockAdminReviews : [];
  }

  let query = supabase.from("reviews").select(REVIEW_SELECT).order("created_at", { ascending: false });

  if (filter === "reported") {
    query = query.eq("status", "reported");
  }

  const { data, error } = await query;

  if (error) {
    console.error("[data] getAdminReviews:", error.message);
    return shouldUseMockData() ? mockAdminReviews : [];
  }

  return (data ?? []).map((row) => mapAdminReviewRow(row as Record<string, unknown>));
}

export async function getAdminReviewById(
  reviewId: string,
): Promise<AdminReviewListItem | null> {
  if (reviewId.startsWith("mock-review-")) {
    return mockAdminReviews.find((review) => review.id === reviewId) ?? null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("id", reviewId)
    .maybeSingle();

  if (error) {
    console.error("[data] getAdminReviewById:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapAdminReviewRow(data as Record<string, unknown>);
}

export async function updateAdminReviewStatus(
  reviewId: string,
  status: ReviewModerationStatus,
): Promise<UpdateAdminReviewStatusResult> {
  if (!["visible", "hidden", "reported", "deleted"].includes(status)) {
    return { success: false, error: "invalid_status" };
  }

  if (reviewId.startsWith("mock-review-")) {
    const review = mockAdminReviews.find((item) => item.id === reviewId);
    if (!review) {
      return { success: false, error: "not_found" };
    }
    review.status = status;
    review.statusLabel = getReviewModerationStatusLabel(status);
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[data] updateAdminReviewStatus:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}
