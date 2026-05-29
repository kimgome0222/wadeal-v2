"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GroupBuyOrderCard, type GroupBuyOrderCardItem } from "@/components/group-buy-order-card";
import { EmptyState } from "@/components/empty-state";
import { getUserOrderDisplayLabel } from "@/lib/orders/order-status";
import { canPayOrder } from "@/lib/payments/can-pay-order";
import { isNormalProduct } from "@/lib/products/product-type";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type GroupBuyTab = "participating" | "payment_pending" | "payment_complete" | "closed";

type MypageGroupbuysContentProps = {
  orders: UserOrderRecord[];
};

const TABS: { id: GroupBuyTab; label: string }[] = [
  { id: "participating", label: "구매 중" },
  { id: "payment_pending", label: "결제 대기" },
  { id: "payment_complete", label: "결제 완료" },
  { id: "closed", label: "종료" },
];

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

function filterOrders(orders: UserOrderRecord[], tab: GroupBuyTab): UserOrderRecord[] {
  const groupBuyOrders = orders.filter((order) => !isNormalProduct(order.productType));

  switch (tab) {
    case "participating":
      return groupBuyOrders.filter(
        (order) =>
          order.orderStatus === "joined" &&
          !["cancelled", "refunded"].includes(order.orderStatus),
      );
    case "payment_pending":
      return groupBuyOrders.filter((order) => canPayOrder(order));
    case "payment_complete":
      return groupBuyOrders.filter((order) => order.paymentStatus === "paid");
    case "closed":
      return groupBuyOrders.filter((order) =>
        ["cancelled", "refunded", "confirmed"].includes(order.orderStatus),
      );
    default:
      return groupBuyOrders;
  }
}

function TierRemainingHint({ order }: { order: UserOrderRecord }) {
  const remaining = Math.max(order.targetMembers - order.currentMembers, 0);

  if (remaining <= 0 || order.finalPrice != null) {
    return null;
  }

  return (
    <p className="mt-2 text-xs font-bold text-wadeal-muted">
      다음 혜택까지 {remaining}명 · 현재 혜택가 {currency.format(order.joinedPrice)}원
    </p>
  );
}

export function MypageGroupbuysContent({ orders }: MypageGroupbuysContentProps) {
  const [tab, setTab] = useState<GroupBuyTab>("participating");

  const filtered = useMemo(() => filterOrders(orders, tab), [orders, tab]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            className={ui.tabPill(tab === item.id)}
            key={item.id}
            onClick={() => setTab(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ?
        <EmptyState
          actionHref="/"
          actionLabel="상품 둘러보기"
          description="구매 중인 상품이 여기에 표시돼요."
          title="해당 내역이 없어요."
        />
      : filtered.map((order) => (
          <div key={order.id}>
            <GroupBuyOrderCard order={toCardItem(order)} />
            <TierRemainingHint order={order} />
            {order.finalPrice != null ?
              <p className="mt-1 px-1 text-xs font-bold text-wadeal-muted">
                확정가 {currency.format(order.finalPrice)}원
              </p>
            : null}
            {canPayOrder(order) ?
              <Link
                className={`${ui.btnPrimary} mt-2 block text-center`}
                href={`/payment/request/${order.id}`}
              >
                결제하기
              </Link>
            : null}
          </div>
        ))
      }
    </div>
  );
}
