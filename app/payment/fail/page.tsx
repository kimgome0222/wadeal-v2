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
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-sm font-extrabold text-wadeal-red">
          결제에 실패했어요
        </p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{reason}</p>
        <p className="text-[11px] leading-relaxed text-wadeal-muted">
          celloh는 카드번호·CVC를 저장하지 않으며, 결제 승인은 PG사를 통해 처리됩니다. (mock)
        </p>
        {orderId ?
          <Link
            className={`${ui.btnPrimary} block min-h-[44px]`}
            href={`/payment/request/${encodeURIComponent(orderId)}`}
          >
            다시 시도
          </Link>
        : null}
        <Link className={`${ui.btnOutline} block min-h-[44px]`} href="/mypage/orders">
          주문 내역으로
        </Link>
        <Link className="text-[13px] font-semibold text-[#2E5E4E]" href="/policies/payment">
          결제 정책 보기
        </Link>
      </div>
    </PageShell>
  );
}
