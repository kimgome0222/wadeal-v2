"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { confirmPurchaseAction } from "@/app/actions/data";
import {
  requestExchangeReturnAction,
  requestOrderCancelAction,
} from "@/app/actions/order-claims";
import { GroupBuyOrderCard, type GroupBuyOrderCardItem } from "@/components/group-buy-order-card";
import { OrderTimelinePanel } from "@/components/order-timeline-panel";
import type { OrderTimelineEntry } from "@/lib/data/order-timelines";
import {
  canShowExchangeReturnButton,
  canShowOrderCancelButton,
} from "@/lib/orders/order-claims";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import { getPaymentStatusLabel, getUserOrderDisplayLabel } from "@/lib/orders/order-status";
import { getOrderRefundStatusLabel, normalizeOrderRefundStatus } from "@/lib/orders/refund-status";
import {
  buildTrackingUrl,
  canConfirmPurchase,
  canWriteReview,
  getShippingStatusLabel,
} from "@/lib/orders/shipping-status";
import { canPayOrder } from "@/lib/payments/can-pay-order";
import {
  getPaymentMethodLabel,
  isVirtualAccountMethod,
} from "@/lib/payments/payment-methods";
import {
  getReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import { ui } from "@/lib/ui";

type CustomerOrderDetailContentProps = {
  order: UserOrderRecord;
  timelineEntries: OrderTimelineEntry[];
};

function toCardItem(order: UserOrderRecord): GroupBuyOrderCardItem {
  const joinedLineTotal = order.joinedPrice * order.quantity;

  return {
    id: order.id,
    productName: order.productName,
    participationPrice: order.finalPrice ?? joinedLineTotal,
    joinedPrice: order.joinedPrice,
    finalPrice: order.finalPrice,
    quantity: order.quantity,
    currentParticipants: order.currentMembers,
    targetParticipants: order.targetMembers,
    displayStatus: getUserOrderDisplayLabel({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
    }),
    status: order.status,
  };
}

function formatTimestamp(isoDate: string | null | undefined): string | null {
  if (!isoDate) {
    return null;
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function CustomerOrderDetailContent({
  order,
  timelineEntries,
}: CustomerOrderDetailContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isClaimPending, startClaimTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleConfirmPurchase() {
    setFeedback(null);

    startTransition(async () => {
      const result = await confirmPurchaseAction(order.id);

      if (result.success) {
        setFeedback({
          tone: "success",
          message: "구매 확정이 완료됐어요. 이제 리뷰를 작성할 수 있어요.",
        });
        router.refresh();
        return;
      }

      setFeedback({
        tone: "error",
        message: "구매 확정에 실패했어요. 배송 완료 상태인지 확인해 주세요.",
      });
    });
  }

  function handleOrderCancel() {
    setFeedback(null);

    startClaimTransition(async () => {
      const result = await requestOrderCancelAction(order.id);
      setFeedback({
        tone: result.ok ? "success" : "error",
        message: result.message,
      });
      if (result.ok) {
        router.refresh();
      }
    });
  }

  function handleExchangeReturn() {
    setFeedback(null);

    startClaimTransition(async () => {
      const result = await requestExchangeReturnAction(order.id);
      setFeedback({
        tone: result.ok ? "success" : "error",
        message: result.message,
      });
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <div className={`${ui.panel} space-y-3`}>
        <GroupBuyOrderCard order={toCardItem(order)} />

        <dl className="space-y-2 rounded-xl bg-wadeal-surface p-3 text-xs font-bold">
          <div className="flex justify-between gap-3">
            <dt className="text-wadeal-muted">결제수단</dt>
            <dd className="font-black text-wadeal-ink">{getPaymentMethodLabel(order.paymentMethod)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-wadeal-muted">결제상태</dt>
            <dd className="font-black text-wadeal-ink">
              {getPaymentStatusLabel(order.paymentStatus)}
            </dd>
          </div>
          {isVirtualAccountMethod(order.paymentMethod) &&
          order.paymentStatus === "waiting_deposit" ?
            <div className="rounded-lg bg-white px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
              {getVirtualAccountDepositNotice()}
            </div>
          : null}
          <div className="flex justify-between gap-3">
            <dt className="text-wadeal-muted">배송상태</dt>
            <dd className="font-black text-wadeal-ink">
              {getShippingStatusLabel(order.shippingStatus)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-wadeal-muted">택배사</dt>
            <dd className="font-black text-wadeal-ink">{order.trackingCompany ?? "등록 전"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-wadeal-muted">송장번호</dt>
            <dd className="font-mono font-black text-wadeal-ink">
              {order.trackingNumber ?? "등록 전"}
            </dd>
          </div>
          {formatTimestamp(order.shippedAt) ?
            <div className="flex justify-between gap-3">
              <dt className="text-wadeal-muted">발송일</dt>
              <dd className="font-black text-wadeal-ink">{formatTimestamp(order.shippedAt)}</dd>
            </div>
          : null}
          {formatTimestamp(order.deliveredAt) ?
            <div className="flex justify-between gap-3">
              <dt className="text-wadeal-muted">배송완료일</dt>
              <dd className="font-black text-wadeal-ink">{formatTimestamp(order.deliveredAt)}</dd>
            </div>
          : null}
          {formatTimestamp(order.confirmedAt) ?
            <div className="flex justify-between gap-3">
              <dt className="text-wadeal-muted">구매확정일</dt>
              <dd className="font-black text-wadeal-ink">{formatTimestamp(order.confirmedAt)}</dd>
            </div>
          : null}
        </dl>

        <OrderTimelinePanel entries={timelineEntries} />

        <div className="space-y-2">
          {canPayOrder(order) ?
            <Link
              className={`${ui.btnPrimary} block text-center`}
              href={`/payment/request/${encodeURIComponent(order.id)}`}
            >
              결제하기
            </Link>
          : null}

          {order.trackingNumber ?
            <a
              className={`${ui.btnOutline} block text-center`}
              href={buildTrackingUrl(order.trackingCompany, order.trackingNumber) ?? "#"}
              rel="noopener noreferrer"
              target="_blank"
            >
              배송 조회
            </a>
          : null}

          {canShowOrderCancelButton(order) ?
            <button
              className={`${ui.btnOutline} w-full disabled:opacity-50`}
              disabled={isClaimPending}
              onClick={handleOrderCancel}
              type="button"
            >
              {isClaimPending ? "처리 중..." : "취소 요청"}
            </button>
          : null}

          {canConfirmPurchase(order) ?
            <button
              className={`${ui.btnPrimary} w-full disabled:opacity-50`}
              disabled={isPending}
              onClick={handleConfirmPurchase}
              type="button"
            >
              {isPending ? "처리 중..." : "구매확정"}
            </button>
          : null}

          {canShowExchangeReturnButton(order) ?
            <button
              className={`${ui.btnOutline} w-full disabled:opacity-50`}
              disabled={isClaimPending}
              onClick={handleExchangeReturn}
              type="button"
            >
              {isClaimPending ? "처리 중..." : "환불 요청"}
            </button>
          : null}

          {canWriteReview(order) ?
            <Link
              className={`${ui.btnOutline} block text-center`}
              href={`/product/${order.productId}?review=true#product-reviews`}
            >
              리뷰 작성하기
            </Link>
          : getReviewWriteStatus(order, false) === "completed" ?
            <Link
              className={`${ui.btnOutline} block text-center`}
              href={`/product/${order.productId}#product-reviews`}
            >
              내 리뷰 보기
            </Link>
          : null}

          <Link
            className={`${ui.btnOutline} block text-center`}
            href={`/support/new?orderId=${encodeURIComponent(order.id)}&type=order`}
          >
            문의하기
          </Link>

          {order.cancelReason ?
            <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
              취소 사유: {order.cancelReason}
            </p>
          : null}

          {order.refundReason ?
            <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
              환불 사유: {order.refundReason}
            </p>
          : null}

          {order.refundRejectedReason ?
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
              반려 사유: {order.refundRejectedReason}
            </p>
          : null}

          {order.refundStatus && order.refundStatus !== "none" ?
            <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
              환불 상태:{" "}
              {getOrderRefundStatusLabel(normalizeOrderRefundStatus(order.refundStatus))}
            </p>
          : null}
        </div>
      </div>
    </div>
  );
}
