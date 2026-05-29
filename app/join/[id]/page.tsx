import { notFound, redirect } from "next/navigation";
import { DealDeadline } from "@/components/deal-deadline";
import { JoinActionButton } from "@/components/join-action-button";
import { PriceTierSteps } from "@/components/price-tier-steps";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getDealById, getPriceTiersByDealId } from "@/lib/data";
import { getProductShippingBySlug } from "@/lib/data/product-shipping";
import { currency, isDealClosed } from "@/lib/deals";
import { calculateShippingFee } from "@/lib/shipping/calculate-shipping-fee";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ui } from "@/lib/ui";

function parseCartQuantity(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(99, Math.round(parsed));
}

export const dynamic = "force-dynamic";

type JoinPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ qty?: string }>;
};

export default async function JoinPage({ params, searchParams }: JoinPageProps) {
  const { id } = await params;
  const { qty: qtyParam } = await searchParams;
  const cartQuantity = parseCartQuantity(qtyParam);
  const [deal, tiers, user] = await Promise.all([
    getDealById(id),
    getPriceTiersByDealId(id),
    getServerAuthUser(),
  ]);

  if (!deal) {
    notFound();
  }

  if (isDealClosed(deal)) {
    redirect(`/product/${deal.slug}`);
  }

  const {
    applicablePrice,
    lowestPrice,
    qtyUntilNextTier,
    allTiersAchieved,
  } = getTierProgress(deal, tiers);

  const progress = Math.min(
    100,
    Math.round((deal.participants / deal.targetParticipants) * 100),
  );

  const productShipping = await getProductShippingBySlug(deal.slug);
  const subtotalEstimate = applicablePrice * cartQuantity;
  const shippingEstimate = calculateShippingFee({
    product: productShipping,
    subtotal: subtotalEstimate,
    quantity: cartQuantity,
    address: null,
  });
  const estimatedTotal = subtotalEstimate + shippingEstimate.totalShippingFee;

  return (
    <main className={`${ui.pageWrap} pb-40 shadow-soft`}>
      <SubHeader backHref={`/product/${deal.slug}`} title="상품 구매" />
      <section className={`${ui.pageBody} space-y-4`}>
        <h1 className="text-lg font-black leading-snug text-wadeal-ink">{deal.title}</h1>

        <div className={ui.panel}>
          <p className="text-xs font-bold text-wadeal-muted">결제 예정 금액 (배송비 포함)</p>
          <p className="mt-1 text-[26px] font-black text-wadeal-ink">
            {currency.format(estimatedTotal)}원
          </p>
          <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
            상품 {currency.format(subtotalEstimate)}원 + 배송{" "}
            {shippingEstimate.totalShippingFee === 0 ?
              "무료"
            : `${currency.format(shippingEstimate.totalShippingFee)}원`}
            {cartQuantity > 1 ? ` · ${cartQuantity}개` : ""}
          </p>
          <p className="mt-1 text-[10px] font-bold text-wadeal-muted">
            제주·도서산간은 추가 {currency.format(productShipping.remoteAreaExtraFee)}원 · 판매 종료 시 최종 확정
          </p>
          <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
            현재 {deal.participants}명 구매 기준
          </p>
          {!allTiersAchieved ?
            <p className="mt-1 text-[11px] font-bold text-wadeal-muted">
              {qtyUntilNextTier}개 더 구매 시 추가 혜택 · 혜택가{" "}
              {currency.format(lowestPrice)}원
            </p>
          : null}
        </div>

        <DealDeadline deal={deal} variant="join" />

        <div className={`${ui.panel} space-y-3`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-wadeal-ink">구매 현황</span>
            <span className="text-sm font-black text-wadeal-ink">
              {deal.participants}명 구매 · 혜택 기준 {deal.targetParticipants}명
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-wadeal-red transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <PriceTierSteps deal={deal} tiers={tiers} />

        <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-4 py-3 text-center">
          <p className="text-[11px] font-black text-wadeal-ink">구매 후 결제 안내</p>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-wadeal-muted">
            먼저 상품을 구매하고, 판매 종료 시점의 누적 구매 수량에 따라{" "}
            <span className="text-wadeal-ink">최종 확정 금액</span>이 결정돼요.
          </p>
        </div>
      </section>

      <div className={ui.stickyFooter}>
        <JoinActionButton
          dealSlug={deal.slug}
          initialLoggedIn={!!user}
          quantity={cartQuantity}
        />
      </div>
    </main>
  );
}
