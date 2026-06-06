"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { adminProcessOrderClaimAction, updateAdminOrderAction } from "@/app/actions/data";
import type { AdminOrderDetail, AdminOrderListItem } from "@/lib/data/admin-orders";
import type { OrderPaymentInfo } from "@/lib/payments/types";
import { getPaymentMethodLabel } from "@/lib/payments/payment-methods";
import { formatPaymentAmountDelta } from "@/lib/payments/display";
import { getAutoPayStatusLabel, getPaymentFlowLabel } from "@/lib/payments/payment-flow";
import {
  ADMIN_ORDER_STATUS_FILTER_OPTIONS,
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_STATUSES,
  ADMIN_SHIPPING_STATUSES,
  formatOrderCurrency,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
  type AdminOrderStatus,
  type AdminOrderStatusFilter,
  type AdminPaymentStatus,
  type AdminShippingStatus,
} from "@/lib/orders/admin-order-status";
import { ui, motion } from "@/lib/ui";

type AdminOrdersContentProps = {
  orders: AdminOrderListItem[];
  orderDetails: AdminOrderDetail[];
  paymentsByOrderId: Record<string, OrderPaymentInfo>;
  initialFilter: AdminOrderStatusFilter;
};

type OrderFormState = {
  orderStatus: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  shippingStatus: AdminShippingStatus;
  courierCompany: string;
  trackingNumber: string;
  adminMemo: string;
  shippedAt: string;
  deliveredAt: string;
};

function toDatetimeLocalValue(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function buildFormState(order: AdminOrderDetail): OrderFormState {
  return {
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    shippingStatus: order.shippingStatus,
    courierCompany: order.courierCompany ?? "",
    trackingNumber: order.trackingNumber ?? "",
    adminMemo: order.adminMemo ?? "",
    shippedAt: toDatetimeLocalValue(order.shippedAt),
    deliveredAt: toDatetimeLocalValue(order.deliveredAt),
  };
}

function OrderStatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
      {label}
    </span>
  );
}

export function AdminOrdersContent({
  orders,
  orderDetails,
  paymentsByOrderId,
  initialFilter,
}: AdminOrdersContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<AdminOrderStatusFilter>(initialFilter);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );
  const [detailOrder, setDetailOrder] = useState<AdminOrderDetail | null>(null);
  const [form, setForm] = useState<OrderFormState | null>(null);
  const [claimReason, setClaimReason] = useState("");
  const [partialAmount, setPartialAmount] = useState("");
  const [showPartialForm, setShowPartialForm] = useState(false);
  const [isClaimPending, startClaimTransition] = useTransition();

  const orderDetailsById = useMemo(() => {
    return new Map(orderDetails.map((order) => [order.id, order]));
  }, [orderDetails]);

  const filteredOrders = useMemo(() => {
    if (filter === "전체") {
      return orders;
    }

    return orders.filter((order) => order.displayStatus === filter);
  }, [filter, orders]);

  const detailPayment =
    detailOrder ? (paymentsByOrderId[detailOrder.id] ?? null) : null;
  const amountDeltaLabel = formatPaymentAmountDelta(detailPayment?.amountDelta ?? null);

  function openDetail(orderId: string) {
    setFeedback(null);
    setClaimReason("");
    setPartialAmount("");
    setShowPartialForm(false);
    const order = orderDetailsById.get(orderId);

    if (!order) {
      setFeedback({
        tone: "error",
        message: "주문 정보를 불러오지 못했어요.",
      });
      return;
    }

    setDetailOrder(order);
    setForm(buildFormState(order));
  }

  function closeDetail() {
    setDetailOrder(null);
    setForm(null);
    setClaimReason("");
    setPartialAmount("");
    setShowPartialForm(false);
  }

  function handleClaim(claimType: "cancel" | "full_refund" | "partial_refund") {
    if (!detailOrder) {
      return;
    }

    const reason = claimReason.trim();
    if (!reason) {
      setFeedback({ tone: "error", message: "처리 사유를 입력해 주세요." });
      return;
    }

    const parsedPartial =
      claimType === "partial_refund" ? Number(partialAmount.replace(/[^\d]/g, "")) : null;

    if (claimType === "partial_refund" && (!parsedPartial || parsedPartial <= 0)) {
      setFeedback({ tone: "error", message: "부분환불 금액을 입력해 주세요." });
      return;
    }

    const confirmMessage =
      claimType === "cancel" ? "주문을 취소할까요?"
      : claimType === "full_refund" ? "전액 환불 처리할까요?"
      : `${parsedPartial?.toLocaleString("ko-KR")}원 부분환불 처리할까요?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setFeedback(null);
    startClaimTransition(async () => {
      const result = await adminProcessOrderClaimAction({
        orderId: detailOrder.id,
        claimType,
        reason,
        partialAmount: parsedPartial,
      });

      if (result.success) {
        setFeedback({
          tone: "success",
          message:
            claimType === "cancel" ? "주문이 취소됐어요."
            : claimType === "full_refund" ? "전액 환불 처리됐어요."
            : "부분환불 처리됐어요.",
        });
        router.refresh();
        closeDetail();
        return;
      }

      setFeedback({
        tone: "error",
        message:
          result.error === "invalid_input" ?
            "입력값을 확인해 주세요."
          : result.error === "not_found" ?
            "주문 정보를 찾을 수 없어요."
          : "처리에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    });
  }

  function handleSave() {
    if (!detailOrder || !form) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result = await updateAdminOrderAction({
        orderId: detailOrder.id,
        orderStatus: form.orderStatus,
        paymentStatus: form.paymentStatus,
        shippingStatus: form.shippingStatus,
        courierCompany: form.courierCompany,
        trackingNumber: form.trackingNumber,
        adminMemo: form.adminMemo,
        shippedAt: form.shippedAt ? new Date(form.shippedAt).toISOString() : null,
        deliveredAt: form.deliveredAt ? new Date(form.deliveredAt).toISOString() : null,
      });

      if (result.success) {
        setFeedback({
          tone: "success",
          message: "주문 정보가 저장됐어요.",
        });
        router.refresh();
        closeDetail();
        return;
      }

      setFeedback({
        tone: "error",
        message: "저장에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ADMIN_ORDER_STATUS_FILTER_OPTIONS.map((option) => (
          <button
            className={ui.tabPill(filter === option)}
            key={option}
            onClick={() => setFilter(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>

      <p className="text-xs font-bold text-wadeal-muted">
        총 {filteredOrders.length.toLocaleString("ko-KR")}건
        {filter !== "전체" ?
          ` · ${filter}`
        : null}
      </p>

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

      {filteredOrders.length === 0 ?
        <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-black text-wadeal-ink">표시할 주문이 없어요.</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            다른 상태 필터를 선택해 보세요.
          </p>
        </div>
      : <>
          <div className="hidden overflow-x-auto rounded-xl border border-wadeal-line bg-white md:block">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-wadeal-line bg-wadeal-surface/60">
                <tr>
                  {[
                    "주문번호",
                    "상품명",
                    "구매자",
                    "수량",
                    "결제금액",
                    "주문상태",
                    "결제상태",
                    "배송상태",
                    "주문일",
                  ].map((heading) => (
                    <th
                      className="whitespace-nowrap px-3 py-2.5 font-black text-wadeal-muted"
                      key={heading}
                      scope="col"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-wadeal-line">
                {filteredOrders.map((order) => (
                  <tr
                    className="cursor-pointer hover:bg-gray-50"
                    key={order.id}
                    onClick={() => openDetail(order.id)}
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] font-black text-wadeal-ink">
                      {order.orderNumber}
                    </td>
                    <td className="max-w-[140px] truncate px-3 py-3 font-bold text-wadeal-ink">
                      {order.productName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-bold text-wadeal-ink">
                      {order.buyerName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-bold text-wadeal-ink">
                      {order.quantity.toLocaleString("ko-KR")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-black text-wadeal-ink">
                      {formatOrderCurrency(order.paymentAmount)}
                    </td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge label={getOrderStatusLabel(order.orderStatus)} />
                    </td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge label={getPaymentStatusLabel(order.paymentStatus)} />
                    </td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge label={getShippingStatusLabel(order.shippingStatus)} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-bold text-wadeal-muted">
                      {order.orderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 md:hidden">
            {filteredOrders.map((order) => (
              <button
                className={`${ui.panelClickable} w-full text-left`}
                key={order.id}
                onClick={() => openDetail(order.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-[11px] font-black text-wadeal-muted">
                    {order.orderNumber}
                  </p>
                  <OrderStatusBadge label={order.displayStatus} />
                </div>
                <p className="mt-2 text-sm font-black text-wadeal-ink">{order.productName}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-wadeal-muted">
                  <div>
                    <dt>구매자</dt>
                    <dd className="font-black text-wadeal-ink">{order.buyerName}</dd>
                  </div>
                  <div>
                    <dt>수량</dt>
                    <dd className="font-black text-wadeal-ink">
                      {order.quantity.toLocaleString("ko-KR")}
                    </dd>
                  </div>
                  <div>
                    <dt>결제금액</dt>
                    <dd className="font-black text-wadeal-ink">
                      {formatOrderCurrency(order.paymentAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt>주문일</dt>
                    <dd className="font-black text-wadeal-ink">{order.orderDate}</dd>
                  </div>
                  <div>
                    <dt>결제상태</dt>
                    <dd className="font-black text-wadeal-ink">
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </dd>
                  </div>
                  <div>
                    <dt>배송상태</dt>
                    <dd className="font-black text-wadeal-ink">
                      {getShippingStatusLabel(order.shippingStatus)}
                    </dd>
                  </div>
                </dl>
              </button>
            ))}
          </div>
        </>
      }

      {detailOrder && form ?
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

            <>
                <dl className="space-y-2 rounded-xl bg-wadeal-surface p-3 text-xs font-bold">
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">주문번호</dt>
                    <dd className="font-mono font-black text-wadeal-ink">
                      {detailOrder.orderNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">상품명</dt>
                    <dd className="max-w-[200px] truncate text-right font-black text-wadeal-ink">
                      {detailOrder.productName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">구매자</dt>
                    <dd className="font-black text-wadeal-ink">{detailOrder.buyerName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">주문자</dt>
                    <dd className="font-black text-wadeal-ink">
                      {detailOrder.ordererName ?? "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">주문자 연락처</dt>
                    <dd className="font-black text-wadeal-ink">
                      {detailOrder.ordererPhone ?? "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">인증 상태</dt>
                    <dd className="font-black text-wadeal-ink">
                      {detailOrder.ordererVerificationLabel}
                    </dd>
                  </div>
                  {detailOrder.shippingRecipientName ?
                    <>
                      <div className="border-t border-wadeal-line pt-2">
                        <p className="text-[10px] font-black text-wadeal-muted">배송 스냅샷</p>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">수령인</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailOrder.shippingRecipientName}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">연락처</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailOrder.shippingPhone ?? "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">주소</dt>
                        <dd className="max-w-[200px] text-right font-black text-wadeal-ink">
                          [{detailOrder.shippingPostalCode}] {detailOrder.shippingAddressLine1}
                          {detailOrder.shippingAddressLine2 ?
                            ` ${detailOrder.shippingAddressLine2}`
                          : ""}
                        </dd>
                      </div>
                      {detailOrder.shippingDeliveryMemo ?
                        <div className="flex justify-between gap-3">
                          <dt className="text-wadeal-muted">배송 메모</dt>
                          <dd className="max-w-[200px] text-right font-black text-wadeal-ink">
                            {detailOrder.shippingDeliveryMemo}
                          </dd>
                        </div>
                      : null}
                      {detailOrder.shippingIsRemoteArea ?
                        <div className="flex justify-between gap-3">
                          <dt className="text-wadeal-muted">도서산간</dt>
                          <dd className="font-black text-wadeal-ink">
                            추가 배송비{" "}
                            {formatOrderCurrency(detailOrder.shippingFee ?? 0)}
                          </dd>
                        </div>
                      : null}
                    </>
                  : null}
                  {detailOrder.refundRequestedAt ?
                    <>
                      <div className="border-t border-wadeal-line pt-2">
                        <p className="text-[10px] font-black text-amber-700">환불 요청</p>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">요청일</dt>
                        <dd className="font-black text-wadeal-ink">
                          {new Date(detailOrder.refundRequestedAt).toLocaleString("ko-KR")}
                        </dd>
                      </div>
                      {detailOrder.refundReason ?
                        <div className="flex justify-between gap-3">
                          <dt className="text-wadeal-muted">요청 사유</dt>
                          <dd className="max-w-[200px] text-right font-black text-wadeal-ink">
                            {detailOrder.refundReason}
                          </dd>
                        </div>
                      : null}
                    </>
                  : null}
                  {detailOrder.cancelReason ?
                    <div className="flex justify-between gap-3">
                      <dt className="text-wadeal-muted">취소 사유</dt>
                      <dd className="max-w-[200px] text-right font-black text-wadeal-ink">
                        {detailOrder.cancelReason}
                      </dd>
                    </div>
                  : null}
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">결제금액</dt>
                    <dd className="font-black text-wadeal-ink">
                      {formatOrderCurrency(detailOrder.paymentAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">결제수단</dt>
                    <dd className="font-black text-wadeal-ink">
                      {getPaymentMethodLabel(
                        detailPayment?.method ?? detailOrder.paymentMethod,
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">결제 방식</dt>
                    <dd className="font-black text-wadeal-ink">
                      {getPaymentFlowLabel(detailOrder.paymentFlow)}
                    </dd>
                  </div>
                  {getAutoPayStatusLabel({
                    paymentFlow: detailOrder.paymentFlow,
                    paymentStatus: detailOrder.paymentStatus,
                    autoChargeAttemptedAt: detailPayment?.autoChargeAttemptedAt,
                  }) ?
                    <div className="flex justify-between gap-3">
                      <dt className="text-wadeal-muted">자동결제</dt>
                      <dd className="font-black text-wadeal-ink">
                        {getAutoPayStatusLabel({
                          paymentFlow: detailOrder.paymentFlow,
                          paymentStatus: detailOrder.paymentStatus,
                          autoChargeAttemptedAt: detailPayment?.autoChargeAttemptedAt,
                        })}
                      </dd>
                    </div>
                  : null}
                  <div className="flex justify-between gap-3">
                    <dt className="text-wadeal-muted">상품 유형</dt>
                    <dd className="font-black text-wadeal-ink">
                      {detailOrder.productType === "normal" ? "일반" : "셀러 상품"}
                    </dd>
                  </div>
                  {detailOrder.productType !== "normal" ?
                    <div className="flex justify-between gap-3">
                      <dt className="text-wadeal-muted">셀러 상품</dt>
                      <dd className="font-black text-wadeal-ink">
                        {detailOrder.currentMembers}/{detailOrder.targetMembers}명 ·{" "}
                        {detailOrder.groupBuyStatus}
                      </dd>
                    </div>
                  : null}
                </dl>

                <div className="mt-4">
                  <h3 className="text-xs font-black text-wadeal-ink">결제 정보</h3>
                  {detailPayment ?
                    <dl className="mt-2 space-y-2 rounded-xl border border-wadeal-line bg-white p-3 text-xs font-bold">
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">결제상태</dt>
                        <dd className="font-black text-wadeal-ink">{detailPayment.statusLabel}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">청구 예정 금액</dt>
                        <dd className="font-black text-wadeal-ink">
                          {formatOrderCurrency(detailPayment.requestedAmount)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">확정 결제 금액</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailPayment.confirmedAmount != null ?
                            formatOrderCurrency(detailPayment.confirmedAmount)
                          : "-"}
                        </dd>
                      </div>
                      {amountDeltaLabel ?
                        <div className="flex justify-between gap-3">
                          <dt className="text-wadeal-muted">구매 시점 대비</dt>
                          <dd className="font-black text-wadeal-ink">{amountDeltaLabel}</dd>
                        </div>
                      : null}
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">결제수단</dt>
                        <dd className="font-black text-wadeal-ink">
                          {getPaymentMethodLabel(detailPayment.method ?? detailOrder.paymentMethod)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">PG</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailPayment.paymentProvider ?? "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">승인일</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailPayment.approvedAtLabel ?? "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">실패일</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailPayment.failedAtLabel ?? "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-wadeal-muted">취소일</dt>
                        <dd className="font-black text-wadeal-ink">
                          {detailPayment.cancelledAtLabel ?? "-"}
                        </dd>
                      </div>
                    </dl>
                  : <p className="mt-2 text-xs font-bold text-wadeal-muted">
                      등록된 결제 기록이 없어요.
                    </p>}
                </div>

                {detailOrder.orderStatus !== "cancelled" &&
                detailOrder.orderStatus !== "refunded" ?
                  <div className="mt-4 space-y-3 rounded-xl border border-wadeal-line bg-wadeal-surface p-3">
                    <h3 className="text-xs font-black text-wadeal-ink">취소 · 환불 처리</h3>
                    <label className="block">
                      <span className={ui.label}>처리 사유</span>
                      <textarea
                        className={`${ui.input} min-h-[72px] py-2`}
                        onChange={(event) => setClaimReason(event.target.value)}
                        placeholder="취소/환불 사유를 입력해 주세요"
                        value={claimReason}
                      />
                    </label>
                    {showPartialForm ?
                      <label className="block">
                        <span className={ui.label}>부분환불 금액</span>
                        <input
                          className={ui.input}
                          inputMode="numeric"
                          onChange={(event) => setPartialAmount(event.target.value)}
                          placeholder={`최대 ${formatOrderCurrency(detailOrder.paymentAmount)}`}
                          value={partialAmount}
                        />
                      </label>
                    : null}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`${ui.btnOutline} h-10 text-[11px] disabled:opacity-50`}
                        disabled={isClaimPending || isPending}
                        onClick={() => handleClaim("cancel")}
                        type="button"
                      >
                        주문 취소
                      </button>
                      <button
                        className={`${ui.btnOutline} h-10 text-[11px] disabled:opacity-50`}
                        disabled={isClaimPending || isPending}
                        onClick={() => handleClaim("full_refund")}
                        type="button"
                      >
                        전액 환불
                      </button>
                      <button
                        className={`${ui.btnOutline} h-10 text-[11px] disabled:opacity-50`}
                        disabled={isClaimPending || isPending}
                        onClick={() => {
                          if (!showPartialForm) {
                            setShowPartialForm(true);
                            return;
                          }
                          handleClaim("partial_refund");
                        }}
                        type="button"
                      >
                        {showPartialForm ? "부분환불 실행" : "부분환불"}
                      </button>
                    </div>
                  </div>
                : null}

                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className={ui.label}>주문상태</span>
                    <select
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ?
                            { ...prev, orderStatus: event.target.value as AdminOrderStatus }
                          : prev,
                        )
                      }
                      value={form.orderStatus}
                    >
                      {ADMIN_ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {getOrderStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={ui.label}>결제상태</span>
                    <select
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ?
                            {
                              ...prev,
                              paymentStatus: event.target.value as AdminPaymentStatus,
                            }
                          : prev,
                        )
                      }
                      value={form.paymentStatus}
                    >
                      {ADMIN_PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {getPaymentStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={ui.label}>배송상태</span>
                    <select
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ?
                            {
                              ...prev,
                              shippingStatus: event.target.value as AdminShippingStatus,
                            }
                          : prev,
                        )
                      }
                      value={form.shippingStatus}
                    >
                      {ADMIN_SHIPPING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {getShippingStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={ui.label}>택배사</span>
                    <input
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, courierCompany: event.target.value } : prev,
                        )
                      }
                      placeholder="예: CJ대한통운"
                      value={form.courierCompany}
                    />
                  </label>

                  <label className="block">
                    <span className={ui.label}>송장번호</span>
                    <input
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, trackingNumber: event.target.value } : prev,
                        )
                      }
                      placeholder="숫자만 입력"
                      value={form.trackingNumber}
                    />
                  </label>

                  <label className="block">
                    <span className={ui.label}>관리자 메모</span>
                    <textarea
                      className={`${ui.input} min-h-[88px] py-2`}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, adminMemo: event.target.value } : prev,
                        )
                      }
                      placeholder="내부 메모"
                      value={form.adminMemo}
                    />
                  </label>

                  <label className="block">
                    <span className={ui.label}>발송일</span>
                    <input
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, shippedAt: event.target.value } : prev,
                        )
                      }
                      type="datetime-local"
                      value={form.shippedAt}
                    />
                  </label>

                  <label className="block">
                    <span className={ui.label}>배송완료일</span>
                    <input
                      className={ui.input}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, deliveredAt: event.target.value } : prev,
                        )
                      }
                      type="datetime-local"
                      value={form.deliveredAt}
                    />
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    className={`${ui.btnOutline} h-11`}
                    onClick={closeDetail}
                    type="button"
                  >
                    취소
                  </button>
                  <button
                    className={`${ui.btnPrimary} h-11 disabled:opacity-50`}
                    disabled={isPending}
                    onClick={handleSave}
                    type="button"
                  >
                    {isPending ? "저장 중..." : "저장"}
                  </button>
                </div>
            </>
          </div>
        </div>
      : null}
    </div>
  );
}
