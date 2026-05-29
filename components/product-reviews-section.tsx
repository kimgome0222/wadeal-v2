"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReviewAction, toggleReviewLikeAction } from "@/app/actions/data";
import { uploadReviewImageAction, REVIEW_IMAGE_MAX_COUNT } from "@/app/actions/review-images";
import { ReviewCard } from "@/components/review-card";
import { ReviewSortChips } from "@/components/review-sort-chips";
import { ReviewSummaryHeader } from "@/components/review-summary-header";
import type { ProductReviewItem, ReviewSummary } from "@/lib/data/reviews";
import {
  getReviewLikeCounts,
  getLikedReviewIds,
  toggleReviewLike,
} from "@/lib/reviews/local-review-likes";
import {
  formatReviewDeadline,
  getReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import {
  getBestReviewIds,
  sortReviews,
  type ReviewSortMode,
} from "@/lib/reviews/review-sort";
import { ui } from "@/lib/ui";

type ProductReviewsSectionProps = {
  productId: string;
  productName: string;
  canWriteReview: boolean;
  hasWrittenReview: boolean;
  order: UserOrderRecord | null;
  reviews: ProductReviewItem[];
  summary: ReviewSummary;
  currentUserId?: string | null;
  reportedReviewIds?: string[];
  initialLikeCounts?: Record<string, number>;
  initialLikedReviewIds?: string[];
  openFormInitially?: boolean;
};

export function ProductReviewsSection({
  productId,
  productName,
  canWriteReview,
  hasWrittenReview,
  order,
  reviews,
  summary,
  currentUserId = null,
  reportedReviewIds = [],
  initialLikeCounts = {},
  initialLikedReviewIds = [],
  openFormInitially = false,
}: ProductReviewsSectionProps) {
  const reportedReviewIdSet = useMemo(
    () => new Set(reportedReviewIds),
    [reportedReviewIds],
  );
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sortMode, setSortMode] = useState<ReviewSortMode>("rating");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(initialLikeCounts);
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(
    () => new Set(initialLikedReviewIds),
  );
  const writeStatus = useMemo(() => {
    if (!order) {
      return null;
    }

    return getReviewWriteStatus(order, hasWrittenReview);
  }, [hasWrittenReview, order]);

  const canOpenForm = canWriteReview && writeStatus === "writable";
  const [showForm, setShowForm] = useState(openFormInitially && canOpenForm);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLikeCounts(initialLikeCounts);
    setLikedReviewIds(new Set(initialLikedReviewIds));
  }, [initialLikeCounts, initialLikedReviewIds]);

  useEffect(() => {
    if (currentUserId) {
      return;
    }

    function syncLikes() {
      setLikeCounts(getReviewLikeCounts());
      setLikedReviewIds(getLikedReviewIds());
    }

    syncLikes();
    window.addEventListener("wadeal:review-likes-updated", syncLikes);
    return () => {
      window.removeEventListener("wadeal:review-likes-updated", syncLikes);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (window.location.hash !== "#product-reviews") {
      return;
    }

    const target = document.getElementById("product-reviews");
    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const sortedReviews = useMemo(
    () => sortReviews(reviews, sortMode, likeCounts),
    [likeCounts, reviews, sortMode],
  );

  const bestReviewIds = useMemo(
    () => getBestReviewIds(reviews, likeCounts),
    [likeCounts, reviews],
  );

  function handleToggleLike(reviewId: string) {
    if (currentUserId) {
      startTransition(async () => {
        const result = await toggleReviewLikeAction(reviewId);
        if (!result.success || "error" in result) {
          return;
        }

        setLikeCounts((prev) => ({
          ...prev,
          [reviewId]: result.count ?? prev[reviewId] ?? 0,
        }));
        setLikedReviewIds((prev) => {
          const next = new Set(prev);
          if (result.liked) {
            next.add(reviewId);
          } else {
            next.delete(reviewId);
          }
          return next;
        });
      });
      return;
    }

    toggleReviewLike(reviewId);
    setLikeCounts(getReviewLikeCounts());
    setLikedReviewIds(getLikedReviewIds());
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || isPending) {
      return;
    }

    if (imageUrls.length >= REVIEW_IMAGE_MAX_COUNT) {
      setUploadError(`사진은 최대 ${REVIEW_IMAGE_MAX_COUNT}장까지 등록할 수 있어요.`);
      return;
    }

    setUploadError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reviewId", "draft");

      const result = await uploadReviewImageAction(formData);
      if (result.success && result.publicUrl) {
        setImageUrls((prev) => [...prev, result.publicUrl as string]);
        return;
      }

      if (result.error === "invalid_file_type") {
        setUploadError("jpg, jpeg, png, webp 파일만 업로드할 수 있어요.");
      } else if (result.error === "file_too_large") {
        setUploadError("파일 크기는 5MB 이하여야 해요.");
      } else {
        setUploadError("사진 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    });
  }

  function handleSubmit() {
    if (!content.trim() || isPending) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const result = await submitReviewAction({
        productId,
        productName,
        rating,
        content,
        images: imageUrls,
      });

      if (result.success) {
        setSubmitted(true);
        setShowForm(false);
        setContent("");
        router.refresh();
        return;
      }

      if (result.error === "already_reviewed") {
        setErrorMessage("이미 리뷰를 작성했어요.");
      } else if (result.error === "review_window_expired") {
        setErrorMessage("작성 기간이 지났어요.");
      } else if (result.error === "awaiting_confirmation") {
        setErrorMessage("구매 확정 후 리뷰를 작성할 수 있어요.");
      } else if (result.error === "order_not_found") {
        setErrorMessage("상품에 구매한 상품만 리뷰를 작성할 수 있어요.");
      } else {
        setErrorMessage("리뷰 등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    });
  }

  return (
    <section
      className="scroll-mt-20 space-y-5 rounded-2xl border border-wadeal-line bg-white p-5"
      id="product-reviews"
    >
      <div className="space-y-1">
        <h2 className="text-base font-black text-wadeal-ink">상품 리뷰</h2>
        <p className="text-xs font-bold text-wadeal-muted">
          상품 품질, 사진 리뷰, 옵션·사이즈·만족도를 확인해 보세요.
        </p>
      </div>

      <ReviewSummaryHeader summary={summary} />

      {reviews.length > 0 ?
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-wadeal-ink">리뷰 목록</p>
            <p className="text-[11px] font-bold text-wadeal-muted">
              총 {summary.totalCount.toLocaleString("ko-KR")}개
            </p>
          </div>
          <ReviewSortChips onChange={setSortMode} value={sortMode} />
        </div>
      : null}

      <div className="space-y-3">
        {reviews.length === 0 ?
          <p className="rounded-xl bg-wadeal-surface px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
            아직 등록된 리뷰가 없어요.
          </p>
        : sortedReviews.map((review) => (
            <ReviewCard
              currentUserId={currentUserId}
              hasReported={reportedReviewIdSet.has(review.id)}
              isBestReview={bestReviewIds.has(review.id)}
              isLiked={likedReviewIds.has(review.id)}
              key={review.id}
              likeCount={likeCounts[review.id] ?? 0}
              onToggleLike={() => handleToggleLike(review.id)}
              productId={productId}
              review={review}
            />
          ))}
      </div>

      {!order ?
        <p className="rounded-xl bg-wadeal-surface px-4 py-3 text-center text-xs font-bold text-wadeal-muted">
          상품에 구매한 상품만 리뷰를 작성할 수 있어요.
        </p>
      : null}

      {order && writeStatus === "awaiting_confirmation" ?
        <p className="rounded-xl bg-wadeal-surface px-4 py-3 text-center text-xs font-bold text-wadeal-muted">
          배송 완료 후 마이페이지에서 구매 확정을 하면 리뷰를 작성할 수 있어요.
        </p>
      : null}

      {canWriteReview && writeStatus === "completed" ?
        <p className="rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-black text-green-700">
          이미 리뷰를 작성했어요.
        </p>
      : null}

      {canWriteReview && writeStatus === "expired" ?
        <p className="rounded-xl bg-gray-100 px-4 py-3 text-center text-xs font-bold text-wadeal-muted">
          작성 기간이 지났어요.
        </p>
      : null}

      {submitted ?
        <p className="rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-black text-green-700">
          리뷰가 등록됐어요.
        </p>
      : null}

      {errorMessage ?
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-bold text-[#2E5E4E]">
          {errorMessage}
        </p>
      : null}

      {showForm && canOpenForm ?
        <div className="space-y-3 rounded-xl border border-wadeal-line bg-wadeal-surface p-4">
          {order ?
            <p className="text-[11px] font-bold text-wadeal-muted">
              {formatReviewDeadline(order)}
            </p>
          : null}
          <div>
            <p className="text-xs font-black text-wadeal-ink">별점</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  className={`cursor-pointer text-lg ${value <= rating ? "text-wadeal-red" : "text-gray-300"}`}
                  disabled={isPending}
                  key={value}
                  onClick={() => setRating(value)}
                  type="button"
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={ui.label} htmlFor="review-content">
              리뷰 내용
            </label>
            <textarea
              className="min-h-[96px] w-full rounded-lg border border-wadeal-line bg-white px-3 py-2 text-sm font-bold text-wadeal-ink outline-none placeholder:text-gray-300 focus:border-wadeal-red"
              disabled={isPending}
              id="review-content"
              onChange={(event) => setContent(event.target.value)}
              placeholder="상품 사용 후기를 남겨주세요."
              value={content}
            />
          </div>
          <div>
            <p className="text-xs font-black text-wadeal-ink">사진 (선택)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div
                  className="h-16 w-16 overflow-hidden rounded-lg border border-wadeal-line bg-white"
                  key={url}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="h-full w-full object-cover" src={url} />
                </div>
              ))}
              {imageUrls.length < REVIEW_IMAGE_MAX_COUNT ?
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-wadeal-line bg-white text-[10px] font-bold text-wadeal-muted">
                  + 추가
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                  />
                </label>
              : null}
            </div>
            {uploadError ?
              <p className="mt-2 text-[11px] font-bold text-[#2E5E4E]">{uploadError}</p>
            : null}
          </div>
          <button
            className={`${ui.btnPrimary} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!content.trim() || isPending}
            onClick={handleSubmit}
            type="button"
          >
            {isPending ? "등록 중..." : "등록하기"}
          </button>
        </div>
      : null}

      {canOpenForm ?
        <button
          className={`${ui.btnOutline} cursor-pointer`}
          onClick={() => setShowForm((prev) => !prev)}
          type="button"
        >
          리뷰 작성하기
        </button>
      : null}
    </section>
  );
}
