"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { confirmPurchaseAction } from "@/app/actions/data";
import {
  getOrderTimelinesAction,
  requestExchangeReturnAction,
  requestOrderCancelAction,
} from "@/app/actions/order-claims";
import { GroupBuyOrderCard, type GroupBuyOrderCardItem } from "@/components/group-buy-order-card";
import { OrderTimelinePanel } from "@/components/order-timeline-panel";
import type { OrderTimelineEntry } from "@/lib/data/order-timelines";
import { getUserOrderDisplayLabel, getPaymentStatusLabel } from "@/lib/orders/order-status";
import {
  buildTrackingUrl,
  canConfirmPurchase,
  canWriteReview,
  getShippingStatusLabel,
} from "@/lib/orders/shipping-status";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import {
  canShowExchangeReturnButton,
  canShowOrderCancelButton,
} from "@/lib/orders/order-claims";
import { canPayOrder } from "@/lib/payments/can-pay-order";
import {
  getPaymentMethodLabel,
  isVirtualAccountMethod,
} from "@/lib/payments/payment-methods";
import {
  getReviewWriteStatus,
  type UserOrderRecord,
} from "@/lib/reviews/review-rules";
import { getOrderRefundStatusLabel, normalizeOrderRefundStatus } from "@/lib/orders/refund-status";
import { ui, motion } from "@/lib/ui";

type MypageOrdersContentProps = {
  orders: UserOrderRecord[];
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

export function MypageOrdersContent({ orders }: MypageOrdersContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isClaimPending, startClaimTransition] = useTransition();
  const [selectedOrder, setSelectedOrder] = useState<UserOrderRecord | null>(null);
  const [orderTimeline, setOrderTimeline] = useState<OrderTimelineEntry[]>([]);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function openDetail(order: UserOrderRecord) {
    setFeedback(null);
    setSelectedOrder(order);
    void getOrderTimelinesAction(order.id).then(setOrderTimeline);
  }

  function closeDetail() {
    setSelectedOrder(null);
    setOrderTimeline([]);
  }

  function handleConfirmPurchase() {
    if (!selectedOrder) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result = await confirmPurchaseAction(selectedOrder.id);

      if (result.success) {
        setFeedback({
          tone: "success",
          message: "구매 확정이 완료됐어요. 이제 리뷰를 작성할 수 있어요.",
        });
        router.refresh();
        closeDetail();
        return;
      }

      setFeedback({
        tone: "error",
        message: "구매 확정에 실패했어요. 배송 완료 상태인지 확인해 주세요.",
      });
    });
  }

  function handleOrderCancel() {
    if (!selectedOrder) {
      return;
    }

    setFeedback(null);

    startClaimTransition(async () => {
      const result = await requestOrderCancelAction(selectedOrder.id);
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
    if (!selectedOrder) {
      return;
    }

    setFeedback(null);

    startClaimTransition(async () => {
      const result = await requestExchangeReturnAction(selectedOrder.id);
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
    <div className="space-y-3">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-[#F5F8F4] text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      {orders.map((order) => (
        <button
          className={`${ui.panelClickable} w-full text-left`}
          key={order.id}
          onClick={() => openDetail(order)}
          type="button"
        >
          <GroupBuyOrderCard order={toCardItem(order)} />
        </button>
      ))}

      {selectedOrder ?
        <div aria-modal="true" className={motion.sheetBackdrop} role="dialog">
          <div className={motion.sheetPanel}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-black text-wadeal-ink">주문 상세</h2>
              <button
                className="rounded-lg px-2 py-1 text-xs font-black text-wadeal-muted active:bg-gray-50"
                onClick={closeDetail}
                type="button"
              >
                닫기
              </button>
            </div>

            <p className="text-sm font-black text-wadeal-ink">{selectedOrder.productName}</p>

            <dl className="mt-4 space-y-2 rounded-xl bg-wadeal-surface p-3 text-xs font-bold">
              <div className="flex justify-between gap-3">
                <dt className="text-wadeal-muted">결제수단</dt>
                <dd className="font-black text-wadeal-ink">
                  {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-wadeal-muted">결제상태</dt>
                <dd className="font-black text-wadeal-ink">
                  {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                </dd>
              </div>
              {isVirtualAccountMethod(selectedOrder.paymentMethod) &&
              selectedOrder.paymentStatus === "waiting_deposit" ?
                <div className="rounded-lg bg-white px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
                  {getVirtualAccountDepositNotice()}
                </div>
              : null}
              <div className="flex justify-between gap-3">
                <dt className="text-wadeal-muted">배송상태</dt>
                <dd className="font-black text-wadeal-ink">
                  {getShippingStatusLabel(selectedOrder.shippingStatus)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-wadeal-muted">택배사</dt>
                <dd className="font-black text-wadeal-ink">
                  {selectedOrder.trackingCompany ?? "등록 전"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-wadeal-muted">송장번호</dt>
                <dd className="font-mono font-black text-wadeal-ink">
                  {selectedOrder.trackingNumber ?? "등록 전"}
                </dd>
              </div>
              {formatTimestamp(selectedOrder.shippedAt) ?
                <div className="flex justify-between gap-3">
                  <dt className="text-wadeal-muted">발송일</dt>
                  <dd className="font-black text-wadeal-ink">
                    {formatTimestamp(selectedOrder.shippedAt)}
                  </dd>
                </div>
              : null}
              {formatTimestamp(selectedOrder.deliveredAt) ?
                <div className="flex justify-between gap-3">
                  <dt className="text-wadeal-muted">배송완료일</dt>
                  <dd className="font-black text-wadeal-ink">
                    {formatTimestamp(selectedOrder.deliveredAt)}
                  </dd>
                </div>
              : null}
              {formatTimestamp(selectedOrder.confirmedAt) ?
                <div className="flex justify-between gap-3">
                  <dt className="text-wadeal-muted">구매확정일</dt>
                  <dd className="font-black text-wadeal-ink">
                    {formatTimestamp(selectedOrder.confirmedAt)}
                  </dd>
                </div>
              : null}
            </dl>

            <OrderTimelinePanel entries={orderTimeline} />

            <div className="mt-4 space-y-2">
              {canPayOrder(selectedOrder) ?
                <Link
                  className={`${ui.btnPrimary} block text-center`}
                  href={`/payment/request/${encodeURIComponent(selectedOrder.id)}`}
                >
                  결제하기
                </Link>
              : null}

              {selectedOrder.trackingNumber ?
                <a
                  className={`${ui.btnOutline} block text-center`}
                  href={
                    buildTrackingUrl(
                      selectedOrder.trackingCompany,
                      selectedOrder.trackingNumber,
                    ) ?? "#"
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  배송 조회
                </a>
              : null}

              {canShowOrderCancelButton(selectedOrder) ?
                <button
                  className={`${ui.btnOutline} w-full disabled:opacity-50`}
                  disabled={isClaimPending}
                  onClick={handleOrderCancel}
                  type="button"
                >
                  {isClaimPending ? "처리 중..." : "취소 요청"}
                </button>
              : null}

              {canConfirmPurchase(selectedOrder) ?
                <button
                  className={`${ui.btnPrimary} w-full disabled:opacity-50`}
                  disabled={isPending}
                  onClick={handleConfirmPurchase}
                  type="button"
                >
                  {isPending ? "처리 중..." : "구매확정"}
                </button>
              : null}

              {canShowExchangeReturnButton(selectedOrder) ?
                <button
                  className={`${ui.btnOutline} w-full disabled:opacity-50`}
                  disabled={isClaimPending}
                  onClick={handleExchangeReturn}
                  type="button"
                >
                  {isClaimPending ? "처리 중..." : "환불 요청"}
                </button>
              : null}

              {canWriteReview(selectedOrder) ?
                <Link
                  className={`${ui.btnOutline} block text-center`}
                  href={`/product/${selectedOrder.productId}?review=true#product-reviews`}
                >
                  리뷰 작성하기
                </Link>
              : getReviewWriteStatus(selectedOrder, false) === "completed" ?
                <Link
                  className={`${ui.btnOutline} block text-center`}
                  href={`/product/${selectedOrder.productId}#product-reviews`}
                >
                  내 리뷰 보기
                </Link>
              : null}

              <Link
                className={`${ui.btnOutline} block text-center`}
                href={`/support/new?orderId=${encodeURIComponent(selectedOrder.id)}&type=order`}
              >
                문의하기
              </Link>

              {selectedOrder.cancelReason ?
                <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
                  취소 사유: {selectedOrder.cancelReason}
                </p>
              : null}

              {selectedOrder.refundReason ?
                <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
                  환불 사유: {selectedOrder.refundReason}
                </p>
              : null}

              {selectedOrder.refundRejectedReason ?
                <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-xs font-bold text-wadeal-red">
                  반려 사유: {selectedOrder.refundRejectedReason}
                </p>
              : null}

              {selectedOrder.refundStatus && selectedOrder.refundStatus !== "none" ?
                <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
                  환불 상태:{" "}
                  {getOrderRefundStatusLabel(
                    normalizeOrderRefundStatus(selectedOrder.refundStatus),
                  )}
                </p>
              : null}
            </div>
          </div>
        </div>
      : null}
    </div>
  );
}
