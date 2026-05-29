import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getDealById, getPriceTiersByDealId } from "@/lib/data";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ui } from "@/lib/ui";

type JoinCompletePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function JoinCompletePage({
  searchParams,
}: JoinCompletePageProps) {
  const { id } = await searchParams;
  const deal = await getDealById(id ?? "1");

  if (!deal) {
    notFound();
  }

  const tiers = await getPriceTiersByDealId(deal.slug);
  const { applicablePrice, lowestPrice, allTiersAchieved } = getTierProgress(deal, tiers);

  return (
    <PageShell>
      <SubHeader backHref="/" title="상품 구매 완료" />
      <section className={`${ui.pageBody} space-y-4`}>
        <div className="flex flex-col items-center pt-6 text-center">
          <div
            aria-hidden
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F8F4] text-2xl font-black text-wadeal-red"
          >
            ✓
          </div>
          <h2 className="text-lg font-black text-wadeal-ink">
            구매 접수가 완료됐어요.
          </h2>
          <p className="mt-2 text-sm font-extrabold leading-relaxed text-wadeal-muted">
            판매 종료 시점의 구매 수량에 따라 최종 확정 금액이 결정돼요.
          </p>
        </div>

        <article className={ui.panel}>
          <dl className="space-y-2 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>상품명</dt>
              <dd className="text-right font-black text-wadeal-ink">{deal.title}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>결제 예정 금액</dt>
              <dd className="font-black text-wadeal-ink">
                {currency.format(applicablePrice)}원
              </dd>
            </div>
            {!allTiersAchieved && lowestPrice < applicablePrice ?
              <div className="flex justify-between gap-3">
                <dt>적용 가능 혜택가</dt>
                <dd className="font-black text-wadeal-ink">
                  {currency.format(lowestPrice)}원
                </dd>
              </div>
            : null}
            <div className="flex justify-between gap-3">
              <dt>구매자</dt>
              <dd className="font-black text-wadeal-ink">{deal.participants}명</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>혜택 조건</dt>
              <dd className="font-black text-wadeal-ink">
                {deal.targetParticipants}명
              </dd>
            </div>
          </dl>
        </article>

        <div className="space-y-2 pt-2">
          <Link
            className={`${ui.btnPrimary} w-full cursor-pointer`}
            href={`/share/${deal.slug}`}
          >
            친구에게 celloh 소개하기
          </Link>
          <Link
            className={`${ui.btnOutline} w-full cursor-pointer`}
            href="/mypage/orders"
          >
            내 구매내역 보기
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
