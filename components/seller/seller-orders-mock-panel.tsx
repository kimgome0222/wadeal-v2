"use client";

import { useState } from "react";

import {
  getOrderStatusLabel,
  MOCK_SELLER_ORDERS,
  type MockSellerOrder,
} from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

export function SellerOrdersMockPanel() {
  const [orders, setOrders] = useState<MockSellerOrder[]>(MOCK_SELLER_ORDERS);
  const [trackingDraft, setTrackingDraft] = useState<Record<string, string>>({});

  function handleShip(orderId: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ?
          {
            ...order,
            orderStatus: "shipping",
            shippingStatus: "배송중",
            trackingNumber: trackingDraft[orderId] || "MOCK-TRACK-001",
          }
        : order,
      ),
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-wadeal-muted">
        mock 주문 목록 — local state만 변경, DB 저장 없음
      </p>
      {orders.map((order) => (
        <article className={`${ui.panel} space-y-3`} key={order.id}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
              <p className="text-xs font-bold text-wadeal-muted">
                {order.orderNumber} · {order.buyerMasked} · {order.quantity}개
              </p>
            </div>
            <p className="text-sm font-black text-wadeal-red">{order.amount.toLocaleString("ko-KR")}원</p>
          </div>
          <p className="text-xs font-bold text-wadeal-muted">
            주문 {getOrderStatusLabel(order.orderStatus)} · {order.shippingStatus}
            {order.trackingNumber ? ` · ${order.trackingNumber}` : ""}
          </p>
          {order.orderStatus === "paid" || order.orderStatus === "preparing" ?
            <div className="flex flex-wrap gap-2">
              <input
                className={`${ui.input} max-w-[200px] text-xs`}
                onChange={(e) => setTrackingDraft((d) => ({ ...d, [order.id]: e.target.value }))}
                placeholder="운송장 번호 (placeholder)"
                value={trackingDraft[order.id] ?? ""}
              />
              <button
                className={`${ui.btnPrimary} h-9 px-4 text-xs`}
                onClick={() => handleShip(order.id)}
                type="button"
              >
                배송처리 (mock)
              </button>
            </div>
          : null}
        </article>
      ))}
    </div>
  );
}
