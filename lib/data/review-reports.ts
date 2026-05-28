import { shouldUseMockData } from "@/lib/env/runtime";
import {
  isReviewReportReason,
  type ReviewReportReason,
} from "@/lib/reviews/review-report-reasons";
import { maskUserId } from "@/lib/reviews/review-rules";
import type { ReviewReportStatus } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[review-reports] using mock fallback: ${context}`);
  }
}

export type CreateReviewReportInput = {
  reviewId: string;
  reason: ReviewReportReason;
};

export type CreateReviewReportResult = {
  success: boolean;
  id?: string;
  error?:
    | "login_required"
    | "invalid_reason"
    | "already_reported"
    | "forbidden"
    | "save_failed";
};

export type ResolveReviewReportResult = {
  success: boolean;
  error?: "not_found" | "save_failed" | "forbidden";
};

export type ReviewReportFilter = "all" | "pending" | "resolved";

export type ReviewReportListItem = {
  id: string;
  reviewId: string;
  productId: string | null;
  reviewPreview: string | null;
  userId: string;
  maskedUserId: string;
  reason: string;
  status: ReviewReportStatus;
  createdAt: string;
  createdAtIso: string;
};

const mockReviewReports: ReviewReportListItem[] = [
  {
    id: "mock-report-1",
    reviewId: "mock-review-citrus-1",
    productId: "wd-citrus-001",
    reviewPreview: "감귤이 정말 달고 신선해요. 재구매 의사 있습니다.",
    userId: "mock-reporter-1",
    maskedUserId: "u***1",
    reason: "욕설/비방",
    status: "pending",
    createdAt: "2026.05.20",
    createdAtIso: "2026-05-20T09:00:00.000Z",
  },
  {
    id: "mock-report-2",
    reviewId: "mock-review-beef-1",
    productId: "wd-beef-001",
    reviewPreview: "포장 상태가 아쉬웠어요.",
    userId: "mock-reporter-2",
    maskedUserId: "u***2",
    reason: "허위/과장",
    status: "pending",
    createdAt: "2026.05.18",
    createdAtIso: "2026-05-18T14:30:00.000Z",
  },
];

const resolvedMockReportIds = new Set<string>();

function getMockReviewReports(): ReviewReportListItem[] {
  return mockReviewReports.map((report) => ({
    ...report,
    status: resolvedMockReportIds.has(report.id) ? "resolved" : report.status,
  }));
}

function formatReportDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function mapReportRow(row: Record<string, unknown>): ReviewReportListItem {
  const userId = row.user_id as string;
  const review = row.reviews as
    | { product_id?: string; content?: string }
    | null
    | undefined;

  return {
    id: row.id as string,
    reviewId: row.review_id as string,
    productId: review?.product_id ?? null,
    reviewPreview: review?.content ? String(review.content).slice(0, 80) : null,
    userId,
    maskedUserId: maskUserId(userId),
    reason: row.reason as string,
    status: (row.status as ReviewReportStatus) ?? "pending",
    createdAt: formatReportDate(row.created_at as string),
    createdAtIso: row.created_at as string,
  };
}

function filterReviewReports(
  reports: ReviewReportListItem[],
  filter: ReviewReportFilter,
): ReviewReportListItem[] {
  if (filter === "all") {
    return reports;
  }

  return reports.filter((report) => report.status === filter);
}

export async function getAllReviewReports(
  filter: ReviewReportFilter = "all",
): Promise<ReviewReportListItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAllReviewReports: Supabase is not configured");
    return filterReviewReports(
      shouldUseMockData() ? getMockReviewReports() : [],
      filter,
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getAllReviewReports: failed to create Supabase client");
    return filterReviewReports(
      shouldUseMockData() ? getMockReviewReports() : [],
      filter,
    );
  }

  let query = supabase
    .from("review_reports")
    .select("id, review_id, user_id, reason, status, created_at, reviews(product_id, content)")
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[data] getAllReviewReports:", error.message);
    }
    logMockFallback("getAllReviewReports: query error");
    return filterReviewReports(
      shouldUseMockData() ? getMockReviewReports() : [],
      filter,
    );
  }

  const rows = (data ?? []).map((row) => mapReportRow(row as Record<string, unknown>));
  if (rows.length === 0) {
    logMockFallback("getAllReviewReports: empty result");
    return filterReviewReports(
      shouldUseMockData() ? getMockReviewReports() : [],
      filter,
    );
  }

  return rows;
}

export async function countPendingReviewReportsForAdmin(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ?
        getMockReviewReports().filter((report) => report.status === "pending").length
      : 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("review_reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[data] countPendingReviewReportsForAdmin:", error.message);
    }
    return 0;
  }

  return count ?? 0;
}

export async function getUserReportedReviewIds(
  userId: string,
  reviewIds: string[],
): Promise<string[]> {
  if (reviewIds.length === 0 || !isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("review_reports")
    .select("review_id")
    .eq("user_id", userId)
    .in("review_id", reviewIds);

  if (error) {
    console.error("[data] getUserReportedReviewIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.review_id as string);
}

async function clearReviewReportedStatusIfResolved(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  reviewId: string,
): Promise<void> {
  const { count, error } = await supabase
    .from("review_reports")
    .select("id", { count: "exact", head: true })
    .eq("review_id", reviewId)
    .eq("status", "pending");

  if (error) {
    console.error("[data] clearReviewReportedStatusIfResolved:", error.message);
    return;
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const { error: reviewStatusError } = await supabase
    .from("reviews")
    .update({ status: "visible" })
    .eq("id", reviewId)
    .eq("status", "reported");

  if (reviewStatusError) {
    console.error("[data] clearReviewReportedStatusIfResolved review update:", reviewStatusError.message);
  }
}

export async function resolveReviewReport(
  reportId: string,
): Promise<ResolveReviewReportResult & { reviewId?: string }> {
  if (reportId.startsWith("mock-report-")) {
    resolvedMockReportIds.add(reportId);
    const mockReport = mockReviewReports.find((report) => report.id === reportId);
    return { success: true, reviewId: mockReport?.reviewId };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: pendingReport, error: lookupError } = await supabase
    .from("review_reports")
    .select("id, review_id")
    .eq("id", reportId)
    .eq("status", "pending")
    .maybeSingle();

  if (lookupError) {
    console.error("[data] resolveReviewReport lookup:", lookupError.message);
    return { success: false, error: "save_failed" };
  }

  if (!pendingReport) {
    return { success: false, error: "not_found" };
  }

  const reviewId = (pendingReport as { review_id: string }).review_id;

  const { data, error } = await supabase
    .from("review_reports")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[data] resolveReviewReport:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  await clearReviewReportedStatusIfResolved(supabase, reviewId);

  return { success: true, reviewId };
}

export async function createReviewReport(
  userId: string,
  input: CreateReviewReportInput,
): Promise<CreateReviewReportResult> {
  if (!isReviewReportReason(input.reason)) {
    return { success: false, error: "invalid_reason" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-report" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: existing, error: existingError } = await supabase
    .from("review_reports")
    .select("id")
    .eq("user_id", userId)
    .eq("review_id", input.reviewId)
    .maybeSingle();

  if (existingError) {
    console.error("[data] createReviewReport check:", existingError.message);
    return { success: false, error: "save_failed" };
  }

  if (existing) {
    return { success: false, error: "already_reported" };
  }

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("user_id")
    .eq("id", input.reviewId)
    .maybeSingle();

  if (reviewError) {
    console.error("[data] createReviewReport review lookup:", reviewError.message);
    return { success: false, error: "save_failed" };
  }

  if (!review) {
    return { success: false, error: "save_failed" };
  }

  if ((review as { user_id: string }).user_id === userId) {
    return { success: false, error: "forbidden" };
  }

  const { data, error } = await supabase
    .from("review_reports")
    .insert({
      review_id: input.reviewId,
      user_id: userId,
      reason: input.reason,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "already_reported" };
    }
    console.error("[data] createReviewReport:", error.message);
    return { success: false, error: "save_failed" };
  }

  const { error: reviewStatusError } = await supabase
    .from("reviews")
    .update({ status: "reported" })
    .eq("id", input.reviewId)
    .neq("status", "deleted");

  if (reviewStatusError) {
    console.error("[data] createReviewReport status update:", reviewStatusError.message);
  }

  return { success: true, id: (data as { id: string }).id };
}
