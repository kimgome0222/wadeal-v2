import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById } from "@/lib/deals";

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
      <SubHeader title="공동구매 참여" />
      <div className="space-y-4 px-4 py-4">
        <div className="flex gap-3 rounded-lg border border-wadeal-line p-3">
          <img
            alt={deal.title}
            className="h-20 w-20 shrink-0 rounded-md object-cover"
            src={deal.imageUrl}
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-extrabold text-wadeal-ink">
              {deal.title}
            </p>
            <p className="mt-2 text-xs font-bold text-wadeal-muted">현재 예상가</p>
            <p className="text-xl font-black text-wadeal-ink">
              {currency.format(deal.groupPrice)}원
            </p>
            <p className="text-xs font-extrabold text-wadeal-red">
              최저가 {currency.format(deal.lowestPrice)}원
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-wadeal-line p-4">
          <h2 className="text-sm font-black text-wadeal-ink">배송지</h2>
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">김가나</p>
          <p className="mt-1 text-sm font-bold text-wadeal-muted">
            서울특별시 강남구 테헤란로 123, 1004호
          </p>
          <p className="mt-1 text-sm font-bold text-wadeal-muted">010-1234-5678</p>
        </section>

        <section className="rounded-lg border border-wadeal-line p-4">
          <h2 className="text-sm font-black text-wadeal-ink">결제수단</h2>
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">
            신한카드 **** 4242
          </p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            최저가 달성 시 자동결제 예정
          </p>
        </section>

        <CheckoutForm />
      </div>
    </PageShell>
  );
}
