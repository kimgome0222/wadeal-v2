"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReviewAction, toggleReviewLikeAction } from "@/app/actions/data";
import { uploadReviewImageAction, REVIEW_IMAGE_MAX_COUNT } from "@/app/actions/review-images";
import { EmptyState } from "@/components/empty-state";
import { ProductPhotoReviewsGrid } from "@/components/product/product-photo-reviews-grid";
import { ProductSellerReviewsSection } from "@/components/product/product-seller-reviews-section";
import { ReviewBestSection } from "@/components/review-best-section";
import { ReviewCard } from "@/components/review-card";
import { ReviewSortChips } from "@/components/review-sort-chips";
import { ReviewSummaryHeader } from "@/components/review-summary-header";
import type { ProductReviewItem, ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";
import {
  getReviewLikeCounts,
  getLikedReviewIds,
  toggleReviewLike,
} from "@/lib/reviews/local-review-likes";
import { buildPhotoReviewThumbnails } from "@/lib/product/detail-data";
import {
  formatReviewDeadline,
  getReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import {
  getBestReviewIds,
  getFeaturedBestReviews,
  sortReviews,
  type ReviewSortMode,
} from "@/lib/reviews/review-sort";
import { ui } from "@/lib/ui";

const INITIAL_LIST_VISIBLE = 20;

type ProductReviewsSectionProps = {
  productId: string;
  productName: string;
  deal: Deal;
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
  deal,
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
  const [photoOnly, setPhotoOnly] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
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

  const displayedReviews = useMemo(
    () => (photoOnly ? sortedReviews.filter((review) => review.images.length > 0) : sortedReviews),
    [photoOnly, sortedReviews],
  );

  const photoReviewCount = useMemo(
    () => reviews.filter((review) => review.images.length > 0).length,
    [reviews],
  );

  const bestReviewIds = useMemo(
    () => getBestReviewIds(reviews, likeCounts),
    [likeCounts, reviews],
  );

  const featuredBestReviews = useMemo(
    () => getFeaturedBestReviews(reviews, likeCounts, 10),
    [likeCounts, reviews],
  );

  const photoThumbnails = useMemo(
    () => buildPhotoReviewThumbnails(reviews, deal, 16),
    [deal, reviews],
  );

  const visibleListReviews = useMemo(
    () => (listExpanded ? displayedReviews : displayedReviews.slice(0, INITIAL_LIST_VISIBLE)),
    [displayedReviews, listExpanded],
  );

  const hasMoreList = displayedReviews.length > INITIAL_LIST_VISIBLE;

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
    <section className="scroll-mt-28 space-y-8 py-10" id="product-reviews">
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold text-[#111111]">후기</h2>
      </div>

      <ReviewSummaryHeader summary={summary} />

      <ProductPhotoReviewsGrid images={photoThumbnails} productTitle={productName} />

      {featuredBestReviews.length > 0 ?
        <div className="space-y-3">
          <h3 className="text-[16px] font-semibold text-[#111111]">베스트 후기</h3>
          <ReviewBestSection
            bestReviewIds={bestReviewIds}
            currentUserId={currentUserId}
            likeCounts={likeCounts}
            likedReviewIds={likedReviewIds}
            onToggleLike={handleToggleLike}
            productId={productId}
            reportedReviewIds={reportedReviewIdSet}
            reviews={featuredBestReviews}
          />
        </div>
      : null}

      <ProductSellerReviewsSection deal={deal} />

      {reviews.length > 0 ?
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-semibold text-[#111111]">전체 후기</p>
            <p className="text-[13px] text-[#666666]">
              총 {summary.totalCount.toLocaleString("ko-KR")}개
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ReviewSortChips onChange={setSortMode} value={sortMode} />
            {photoReviewCount > 0 ?
              <div className="flex gap-1.5" role="group" aria-label="리뷰 유형">
                <button
                  aria-pressed={!photoOnly}
                  className={`${ds.chip.base} ${!photoOnly ? ds.chip.active : ds.chip.idle}`}
                  onClick={() => setPhotoOnly(false)}
                  type="button"
                >
                  전체
                </button>
                <button
                  aria-pressed={photoOnly}
                  className={`${ds.chip.base} ${photoOnly ? ds.chip.active : ds.chip.idle}`}
                  onClick={() => setPhotoOnly(true)}
                  type="button"
                >
                  포토 {photoReviewCount}
                </button>
              </div>
            : null}
          </div>
        </div>
      : null}

      <div className="space-y-3">
        {reviews.length === 0 ?
          <EmptyState
            description="첫 리뷰를 남겨 다른 구매자에게 도움을 주세요."
            title="아직 등록된 리뷰가 없어요"
            variant="default"
          />
        : displayedReviews.length === 0 ?
          <EmptyState
            description="전체 탭에서 텍스트 리뷰를 확인해 보세요."
            title="포토 리뷰가 아직 없어요"
            variant="default"
          />
        : visibleListReviews.map((review) => (
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

      {hasMoreList && !listExpanded ?
        <button
          aria-label={`리뷰 ${displayedReviews.length - INITIAL_LIST_VISIBLE}개 더보기`}
          className={`${ui.btnOutline} min-h-[44px] cursor-pointer text-[13px] font-medium`}
          onClick={() => setListExpanded(true)}
          type="button"
        >
          리뷰 더보기 ({displayedReviews.length - INITIAL_LIST_VISIBLE}개)
        </button>
      : null}

      {!order ?
        <p className={`rounded-xl bg-[#FAFBFA] px-4 py-3 text-center ${ds.type.caption}`}>
          구매한 상품만 리뷰를 작성할 수 있어요.
        </p>
      : null}

      {order && writeStatus === "awaiting_confirmation" ?
        <p className={`rounded-xl bg-[#FAFBFA] px-4 py-3 text-center ${ds.type.caption}`}>
          배송 완료 후 마이페이지에서 구매 확정을 하면 리뷰를 작성할 수 있어요.
        </p>
      : null}

      {canWriteReview && writeStatus === "completed" ?
        <p className={`rounded-xl bg-green-50 px-4 py-3 text-center ${ds.type.caption} text-green-700`}>
          이미 리뷰를 작성했어요.
        </p>
      : null}

      {canWriteReview && writeStatus === "expired" ?
        <p className={`rounded-xl bg-gray-100 px-4 py-3 text-center ${ds.type.caption}`}>
          작성 기간이 지났어요. (구매 확정 후 15일)
        </p>
      : null}

      {submitted ?
        <p className={`rounded-xl bg-green-50 px-4 py-3 text-center ${ds.type.caption} text-green-700`}>
          리뷰가 등록됐어요.
        </p>
      : null}

      {errorMessage ?
        <p className={`rounded-xl bg-[#F5F8F4] px-4 py-3 text-center ${ds.type.caption} text-wadeal-red`}>
          {errorMessage}
        </p>
      : null}

      {showForm && canOpenForm ?
        <div className="space-y-3 rounded-xl border border-[#DDE8E2] bg-[#FAFBFA] p-4">
          {order ?
            <p className={ds.type.caption}>{formatReviewDeadline(order)}</p>
          : null}
          <div>
            <p className={`${ds.type.label} font-medium text-wadeal-ink`}>별점</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  aria-label={`${value}점`}
                  className={`min-h-[44px] min-w-[44px] cursor-pointer text-lg ${value <= rating ? ds.type.star : "text-gray-300"}`}
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
              className={`${ui.input} min-h-[96px] py-2`}
              disabled={isPending}
              id="review-content"
              onChange={(event) => setContent(event.target.value)}
              placeholder="상품 사용 후기를 남겨주세요."
              value={content}
            />
          </div>
          <div>
            <p className={`${ds.type.label} font-medium text-wadeal-ink`}>사진 (선택)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div
                  className="h-16 w-16 overflow-hidden rounded-lg border border-[#DDE8E2] bg-white"
                  key={url}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="h-full w-full object-cover" src={url} />
                </div>
              ))}
              {imageUrls.length < REVIEW_IMAGE_MAX_COUNT ?
                <label className="flex h-16 w-16 min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#DDE8E2] bg-white text-[10px] font-medium text-wadeal-muted">
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
              <p className={`mt-2 ${ds.type.caption} text-wadeal-red`}>{uploadError}</p>
            : null}
          </div>
          <button
            className={`${ui.btnPrimary} min-h-[44px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
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
          className={`${ui.btnOutline} min-h-[44px] cursor-pointer font-medium`}
          onClick={() => setShowForm((prev) => !prev)}
          type="button"
        >
          리뷰 작성하기
        </button>
      : null}
    </section>
  );
}
