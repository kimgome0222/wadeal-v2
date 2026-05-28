import Link from "next/link";
import { notFound } from "next/navigation";

import { SellerShell } from "@/components/seller-shell";
import { SellerTrackingForm } from "@/components/seller-tracking-form";
import { requireSeller } from "@/lib/auth/require-seller";
import {
  canSellerRegisterTracking,
  getSellerOrderById,
} from "@/lib/data/seller-orders";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
} from "@/lib/orders/order-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SellerOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerOrderDetailPage({ params }: SellerOrderDetailPageProps) {
  const seller = await requireSeller();
  const { id } = await params;
  const order = await getSellerOrderById(seller.userId, id);

  if (!order) {
    notFound();
  }

  const canRegisterTracking = canSellerRegisterTracking(order);

  return (
    <SellerShell title="주문 상세">
      <div className="mx-auto max-w-2xl space-y-4">
        <Link className="text-xs font-black text-wadeal-red underline underline-offset-2" href="/seller/orders">
          ← 주문 목록
        </Link>

        <div className={`${ui.panel} space-y-3`}>
          <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
          <p className="text-xs font-bold text-wadeal-muted">주문번호 {order.id.slice(0, 8).toUpperCase()}</p>
          <div className="grid gap-2 text-xs font-bold text-wadeal-muted sm:grid-cols-2">
            <p>수량 {order.quantity}개</p>
            <p>주문 {getOrderStatusLabel(order.orderStatus as never)}</p>
            <p>결제 {getPaymentStatusLabel(order.paymentStatus as never)}</p>
            <p>배송 {getShippingStatusLabel(order.shippingStatus as never)}</p>
          </div>
        </div>

        {order.courierCompany && order.trackingNumber ?
          <div className={`${ui.panel} space-y-2`}>
            <p className="text-sm font-black text-wadeal-ink">등록된 배송 정보</p>
            <p className="text-xs font-bold text-wadeal-muted">택배사: {order.courierCompany}</p>
            <p className="text-xs font-bold text-wadeal-muted">송장번호: {order.trackingNumber}</p>
            {order.shippedAt ?
              <p className="text-xs font-bold text-wadeal-muted">
                발송일: {new Date(order.shippedAt).toLocaleString("ko-KR")}
              </p>
            : null}
          </div>
        : null}

        {canRegisterTracking ?
          <SellerTrackingForm orderId={order.id} />
        : null}
      </div>
    </SellerShell>
  );
}
