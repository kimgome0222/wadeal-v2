import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrderById } from "@/lib/data/orders";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getShippingStatusLabel,
} from "@/lib/orders/order-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type CustomerOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerOrderDetailPage({ params }: CustomerOrderDetailPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect(`/login?next=/orders/${(await params).id}`);
  }

  const { id } = await params;
  const order = await getUserOrderById(user.id, id);
  if (!order) {
    notFound();
  }

  const courierName = order.trackingCompany;

  return (
    <PageShell>
      <SubHeader backHref="/mypage/orders" title="주문 상세" />
      <div className={`${ui.pageBody} mx-auto max-w-2xl space-y-4`}>
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
          <p className="text-xs font-bold text-wadeal-muted">
            결제 {getPaymentStatusLabel(order.paymentStatus)} · 배송{" "}
            {getShippingStatusLabel(order.shippingStatus)} · 주문{" "}
            {getOrderStatusLabel(order.orderStatus)}
          </p>
        </div>

        {courierName && order.trackingNumber ?
          <div className={`${ui.panel} mt-6 space-y-2`}>
            <h3 className="text-sm font-black text-wadeal-ink">배송 정보</h3>
            <p className="text-xs font-bold text-wadeal-muted">택배사: {courierName}</p>
            <p className="text-xs font-bold text-wadeal-muted">송장번호: {order.trackingNumber}</p>
            {order.shippedAt ?
              <p className="text-xs font-bold text-wadeal-muted">
                발송일: {new Date(order.shippedAt).toLocaleString("ko-KR")}
              </p>
            : null}
          </div>
        : null}

        <Link className={`${ui.btnOutline} inline-flex h-10 items-center px-4 text-xs`} href="/mypage/orders">
          주문 목록으로
        </Link>
      </div>
    </PageShell>
  );
}
