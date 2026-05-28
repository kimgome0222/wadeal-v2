// TODO(supabase): review_likes 테이블로 교체

const LIKES_KEY = "wadeal_review_likes_v1";

type ReviewLikeStore = {
  counts: Record<string, number>;
  likedReviewIds: string[];
};

const EMPTY_STORE: ReviewLikeStore = {
  counts: {},
  likedReviewIds: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readStore(): ReviewLikeStore {
  if (!isBrowser()) {
    return EMPTY_STORE;
  }

  try {
    const raw = window.localStorage.getItem(LIKES_KEY);
    if (!raw) {
      return EMPTY_STORE;
    }

    return JSON.parse(raw) as ReviewLikeStore;
  } catch (error) {
    console.error("[reviews] readStore:", error);
    return EMPTY_STORE;
  }
}

function writeStore(store: ReviewLikeStore) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(LIKES_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("wadeal:review-likes-updated"));
  } catch (error) {
    console.error("[reviews] writeStore:", error);
  }
}

export function getReviewLikeCounts(): Record<string, number> {
  return readStore().counts;
}

export function getLikedReviewIds(): Set<string> {
  return new Set(readStore().likedReviewIds);
}

export function getReviewLikeCount(reviewId: string): number {
  return readStore().counts[reviewId] ?? 0;
}

export function hasLikedReview(reviewId: string): boolean {
  return readStore().likedReviewIds.includes(reviewId);
}

export function toggleReviewLike(reviewId: string): {
  count: number;
  liked: boolean;
} {
  const store = readStore();
  const alreadyLiked = store.likedReviewIds.includes(reviewId);

  if (alreadyLiked) {
    const nextCount = Math.max(0, (store.counts[reviewId] ?? 0) - 1);
    const nextStore: ReviewLikeStore = {
      counts: { ...store.counts, [reviewId]: nextCount },
      likedReviewIds: store.likedReviewIds.filter((id) => id !== reviewId),
    };
    writeStore(nextStore);
    return { count: nextCount, liked: false };
  }

  const nextCount = (store.counts[reviewId] ?? 0) + 1;
  const nextStore: ReviewLikeStore = {
    counts: { ...store.counts, [reviewId]: nextCount },
    likedReviewIds: [...store.likedReviewIds, reviewId],
  };
  writeStore(nextStore);
  return { count: nextCount, liked: true };
}
