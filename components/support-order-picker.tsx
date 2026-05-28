"use client";

import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import { currency } from "@/lib/deals";
import { INQUIRY_RECENT_ORDER_DAYS } from "@/lib/support/inquiry-options";

type SupportOrderPickerProps = {
  orders: UserOrderRecord[];
  selectedOrderId: string;
  onSelect: (orderId: string) => void;
  required?: boolean;
};

function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function SupportOrderPicker({
  orders,
  selectedOrderId,
  onSelect,
  required = false,
}: SupportOrderPickerProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-wadeal-surface px-4 py-6 text-center">
        <p className="text-sm font-semibold text-wadeal-ink">
          선택 가능한 주문이 없어요
        </p>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          최근 {INQUIRY_RECENT_ORDER_DAYS}일 이내 구매한 상품만 문의에 연결할 수 있어요.
        </p>
        {!required ?
          <p className="mt-2 text-[11px] font-medium text-wadeal-muted">
            주문 없이도 문의는 접수할 수 있어요.
          </p>
        : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-wadeal-muted">
        최근 {INQUIRY_RECENT_ORDER_DAYS}일 이내 구매 {orders.length}건
      </p>
      <ul className="space-y-2">
        {orders.map((order) => {
          const selected = selectedOrderId === order.id;

          return (
            <li key={order.id}>
              <button
                className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left active:bg-gray-50 ${
                  selected ?
                    "border-wadeal-red bg-red-50/40 ring-1 ring-wadeal-red"
                  : "border-wadeal-line bg-white"
                }`}
                onClick={() => onSelect(order.id)}
                type="button"
              >
                <span
                  aria-hidden
                  className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    selected ? "border-wadeal-red bg-wadeal-red" : "border-gray-300 bg-white"
                  }`}
                >
                  {selected ?
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-semibold text-wadeal-ink">
                    {order.productName}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-x-2 text-[11px] font-medium text-wadeal-muted">
                    <span>{formatOrderDate(order.createdAt)}</span>
                    <span>{currency.format(order.finalPrice ?? order.joinedPrice)}원</span>
                    <span>{order.quantity}개</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
