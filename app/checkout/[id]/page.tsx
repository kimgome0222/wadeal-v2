import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById } from "@/lib/deals";
import { ui } from "@/lib/ui";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/join/${deal.slug}`} title="공동구매 참여" />
      <div className={`${ui.pageBody} space-y-3`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
          <p className="mt-2 text-xs font-extrabold text-wadeal-red">
            최저가 {currency.format(deal.lowestPrice)}원
          </p>
        </div>

        <Link className={ui.panelClickable} href="/mypage/address/new">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-wadeal-ink">배송지</h2>
            <span className="text-xs font-bold text-wadeal-red">등록</span>
          </div>
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">김가나</p>
          <p className="mt-0.5 text-[13px] font-bold text-wadeal-muted">
            서울 강남구 테헤란로 123, 1004호 · 010-1234-5678
          </p>
        </Link>

        <Link className={ui.panelClickable} href="/mypage/payment/new">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-wadeal-ink">결제수단</h2>
            <span className="text-xs font-bold text-wadeal-red">등록</span>
          </div>
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">
            신한카드 **** 4242
          </p>
        </Link>

        <CheckoutForm />
      </div>
    </PageShell>
  );
}
