import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[review-likes] using mock fallback: ${context}`);
  }
}

export type ReviewLikeSnapshot = {
  counts: Record<string, number>;
  likedReviewIds: string[];
};

const mockLikeCounts: Record<string, number> = {
  "mock-review-citrus-1": 12,
  "mock-review-citrus-2": 4,
  "mock-review-beef-1": 7,
};

const mockUserLikes = new Map<string, Set<string>>();

function getMockUserLikes(userId: string): Set<string> {
  if (!mockUserLikes.has(userId)) {
    mockUserLikes.set(userId, new Set());
  }

  return mockUserLikes.get(userId)!;
}

function getMockSnapshot(reviewIds: string[], userId?: string | null): ReviewLikeSnapshot {
  const counts: Record<string, number> = {};
  for (const reviewId of reviewIds) {
    counts[reviewId] = mockLikeCounts[reviewId] ?? 0;
  }

  const likedReviewIds =
    userId ?
      reviewIds.filter((reviewId) => getMockUserLikes(userId).has(reviewId))
    : [];

  return { counts, likedReviewIds };
}

export async function getReviewLikeSnapshot(
  reviewIds: string[],
  userId?: string | null,
): Promise<ReviewLikeSnapshot> {
  if (reviewIds.length === 0) {
    return { counts: {}, likedReviewIds: [] };
  }

  if (!isSupabaseConfigured()) {
    logMockFallback("getReviewLikeSnapshot: Supabase is not configured");
    return getMockSnapshot(reviewIds, userId);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getReviewLikeSnapshot: failed to create Supabase client");
    return getMockSnapshot(reviewIds, userId);
  }

  const { data: likeRows, error: likeError } = await supabase
    .from("review_likes")
    .select("review_id")
    .in("review_id", reviewIds);

  if (likeError) {
    console.error("[data] getReviewLikeSnapshot counts:", likeError.message);
    logMockFallback("getReviewLikeSnapshot: query error");
    return getMockSnapshot(reviewIds, userId);
  }

  const counts: Record<string, number> = {};
  for (const reviewId of reviewIds) {
    counts[reviewId] = mockLikeCounts[reviewId] ?? 0;
  }

  for (const row of likeRows ?? []) {
    const reviewId = row.review_id as string;
    counts[reviewId] = (counts[reviewId] ?? 0) + 1;
  }

  if (!userId) {
    return { counts, likedReviewIds: [] };
  }

  const { data: userLikes, error: userLikeError } = await supabase
    .from("review_likes")
    .select("review_id")
    .eq("user_id", userId)
    .in("review_id", reviewIds);

  if (userLikeError) {
    console.error("[data] getReviewLikeSnapshot user likes:", userLikeError.message);
    return { counts, likedReviewIds: [] };
  }

  return {
    counts,
    likedReviewIds: (userLikes ?? []).map((row) => row.review_id as string),
  };
}

export async function toggleReviewLikeForUser(
  userId: string,
  reviewId: string,
): Promise<{ success: boolean; liked: boolean; count: number }> {
  if (reviewId.startsWith("mock-review-") || !isSupabaseConfigured()) {
    const likedSet = getMockUserLikes(userId);
    const alreadyLiked = likedSet.has(reviewId);

    if (alreadyLiked) {
      likedSet.delete(reviewId);
      mockLikeCounts[reviewId] = Math.max(0, (mockLikeCounts[reviewId] ?? 1) - 1);
      return {
        success: true,
        liked: false,
        count: mockLikeCounts[reviewId] ?? 0,
      };
    }

    likedSet.add(reviewId);
    mockLikeCounts[reviewId] = (mockLikeCounts[reviewId] ?? 0) + 1;
    return {
      success: true,
      liked: true,
      count: mockLikeCounts[reviewId] ?? 0,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, liked: false, count: 0 };
  }

  const { data: existing, error: existingError } = await supabase
    .from("review_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("review_id", reviewId)
    .maybeSingle();

  if (existingError) {
    console.error("[data] toggleReviewLikeForUser check:", existingError.message);
    return { success: false, liked: false, count: 0 };
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("review_likes")
      .delete()
      .eq("id", (existing as { id: string }).id);

    if (deleteError) {
      console.error("[data] toggleReviewLikeForUser delete:", deleteError.message);
      return { success: false, liked: true, count: 0 };
    }
  } else {
    const { error: insertError } = await supabase.from("review_likes").insert({
      review_id: reviewId,
      user_id: userId,
    });

    if (insertError) {
      console.error("[data] toggleReviewLikeForUser insert:", insertError.message);
      return { success: false, liked: false, count: 0 };
    }
  }

  const snapshot = await getReviewLikeSnapshot([reviewId], userId);
  return {
    success: true,
    liked: snapshot.likedReviewIds.includes(reviewId),
    count: snapshot.counts[reviewId] ?? 0,
  };
}
