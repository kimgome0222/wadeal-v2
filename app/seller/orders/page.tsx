import Link from "next/link";

import { SellerOrdersMockPanel } from "@/components/seller/seller-orders-mock-panel";
import { EmptyState } from "@/components/empty-state";
import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import { getSellerOrders } from "@/lib/data/seller-orders";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
} from "@/lib/orders/order-status";
import { showSellerCenterMock } from "@/lib/sellers/show-seller-mock";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const { seller } = await getSellerCenterPageContext("/seller/orders");

  if (!seller) {
    return (
      <SellerShell title="주문/배송 관리">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  const orders = await getSellerOrders(seller.userId);

  return (
    <SellerShell title="주문/배송 관리">
      <div className="space-y-3">
        {orders.length === 0 ?
          showSellerCenterMock() ?
            <SellerOrdersMockPanel />
          : <EmptyState
              description="주문이 들어오면 이곳에서 확인할 수 있어요."
              title="아직 주문이 없어요."
            />
        : orders.map((order) => (
            <Link
              className={`${ui.panel} block space-y-2`}
              href={`/seller/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
                <span className="text-[10px] font-black text-wadeal-muted">
                  {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-xs font-bold text-wadeal-muted">
                결제 {getPaymentStatusLabel(order.paymentStatus as never)} · 배송{" "}
                {getShippingStatusLabel(order.shippingStatus as never)} · 주문{" "}
                {getOrderStatusLabel(order.orderStatus as never)}
              </p>
            </Link>
          ))
        }
      </div>
    </SellerShell>
  );
}
