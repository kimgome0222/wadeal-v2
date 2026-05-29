"use client";

import Link from "next/link";
import {
  formatReviewDeadline,
  getReviewStatusLabel,
  getReviewWriteStatus,
  type ReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import { ui } from "@/lib/ui";

type MypageReviewsContentProps = {
  orders: UserOrderRecord[];
  reviewedOrderIds: string[];
};

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function statusTone(status: ReviewWriteStatus) {
  if (status === "writable") {
    return "text-wadeal-red";
  }
  if (status === "completed") {
    return "text-green-700";
  }
  return "text-gray-400";
}

function OrderReviewCard({
  order,
  status,
}: {
  order: UserOrderRecord;
  status: ReviewWriteStatus;
}) {
  const canWrite = status === "writable";

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
        <span className={`shrink-0 text-xs font-black ${statusTone(status)}`}>
          {getReviewStatusLabel(status)}
        </span>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
        <div className="flex justify-between gap-3">
          <dt>구매일</dt>
          <dd className="font-black text-wadeal-ink">{formatDate(order.createdAt)}</dd>
        </div>
        {order.confirmedAt ?
          <div className="flex justify-between gap-3">
            <dt>구매 확정일</dt>
            <dd className="font-black text-wadeal-ink">{formatDate(order.confirmedAt)}</dd>
          </div>
        : null}
        <div className="flex justify-between gap-3">
          <dt>리뷰 작성 가능 기간</dt>
          <dd className="text-right font-black text-wadeal-ink">
            {formatReviewDeadline(order)}
          </dd>
        </div>
      </dl>
      {canWrite ?
        <Link
          className={`${ui.btnOutline} mt-4 cursor-pointer`}
          href={`/product/${order.productId}?review=true#product-reviews`}
        >
          리뷰 작성하기
        </Link>
      : status === "completed" ?
        <Link
          className={`${ui.btnOutline} mt-4 cursor-pointer`}
          href={`/product/${order.productId}#product-reviews`}
        >
          내 리뷰 보기
        </Link>
      : <button
          className={`${ui.btnOutline} mt-4 cursor-not-allowed opacity-50`}
          disabled
          type="button"
        >
          {status === "awaiting_confirmation" ? "구매 확정 후 작성 가능" : "작성 기간이 지났어요"}
        </button>}
    </article>
  );
}

function ReviewSection({
  title,
  description,
  orders,
  reviewedSet,
}: {
  title: string;
  description: string;
  orders: UserOrderRecord[];
  reviewedSet: Set<string>;
}) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-black text-wadeal-ink">{title}</h2>
        <p className="mt-0.5 text-xs font-bold text-wadeal-muted">{description}</p>
      </div>
      {orders.map((order) => (
        <OrderReviewCard
          key={order.id}
          order={order}
          status={getReviewWriteStatus(order, reviewedSet.has(order.id))}
        />
      ))}
    </section>
  );
}

export function MypageReviewsContent({
  orders,
  reviewedOrderIds,
}: MypageReviewsContentProps) {
  const reviewedSet = new Set(reviewedOrderIds);

  const writableOrders = orders.filter(
    (order) => getReviewWriteStatus(order, reviewedSet.has(order.id)) === "writable",
  );
  const writtenOrders = orders.filter(
    (order) => getReviewWriteStatus(order, reviewedSet.has(order.id)) === "completed",
  );
  const expiredOrders = orders.filter((order) => {
    const status = getReviewWriteStatus(order, reviewedSet.has(order.id));
    return status === "expired" || status === "awaiting_confirmation";
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
        <p className="text-sm font-black text-wadeal-ink">리뷰 작성 가능한 상품이 없어요.</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">
          구매 확정 후 15일 이내에 리뷰를 작성할 수 있어요.
        </p>
        <Link
          className={`${ui.btnPrimary} mx-auto mt-5 max-w-[240px] cursor-pointer`}
          href="/"
        >
          상품 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewSection
        description="지금 바로 리뷰를 작성할 수 있는 상품이에요."
        orders={writableOrders}
        reviewedSet={reviewedSet}
        title="작성 가능한 리뷰"
      />
      <ReviewSection
        description="이미 작성한 리뷰를 확인할 수 있어요."
        orders={writtenOrders}
        reviewedSet={reviewedSet}
        title="작성한 리뷰"
      />
      <ReviewSection
        description="구매 확정 전이거나 작성 기간이 지난 상품이에요."
        orders={expiredOrders}
        reviewedSet={reviewedSet}
        title="작성 불가"
      />
    </div>
  );
}
