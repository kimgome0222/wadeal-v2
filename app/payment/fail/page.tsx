import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

type PaymentFailPageProps = {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
};

export default async function PaymentFailPage({ searchParams }: PaymentFailPageProps) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();
  const reason = params.message?.trim() || params.code?.trim() || "결제가 취소되었거나 실패했어요.";

  return (
    <PageShell>
      <SubHeader backHref="/mypage/orders" title="결제 실패" />
      <div className={`${ui.pageBody} space-y-4 text-center`}>
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-extrabold text-wadeal-red">
          결제에 실패했어요
        </p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{reason}</p>
        {orderId ?
          <Link
            className={`${ui.btnPrimary} block`}
            href={`/payment/request/${encodeURIComponent(orderId)}`}
          >
            다시 결제하기
          </Link>
        : null}
        <Link className={`${ui.btnOutline} block`} href="/mypage/orders">
          주문 내역으로
        </Link>
      </div>
    </PageShell>
  );
}
