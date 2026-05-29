import { DealDeadline } from "@/components/deal-deadline";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { ProductSellerPanel } from "@/components/product-seller-panel";
import { ProductTrustStats } from "@/components/product-trust-stats";
import { SellerStorySection } from "@/components/seller-story-section";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import {
  currency,
  getDealBadgeLabel,
  getDealRemaining,
  isDealClosed,
  isDealGroupBuySucceeded,
  isDealSoldOut,
} from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import {
  formatRemainingStockLabel,
  inventoryFromDeal,
} from "@/lib/products/inventory";
import { badgeTone } from "@/lib/ui";

type ProductSummaryPanelProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  isLoggedIn?: boolean;
  loginNext?: string;
};

export function ProductSummaryPanel({
  deal,
  reviewSummary,
  isLoggedIn = false,
  loginNext,
}: ProductSummaryPanelProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const closed = isDealClosed(deal);
  const soldOut = isDealSoldOut(deal);
  const succeeded = isDealGroupBuySucceeded(deal);
  const remaining = getDealRemaining(deal);
  const inventory = inventoryFromDeal(deal);
  const remainingStockLabel = formatRemainingStockLabel(inventory);
  const { applicablePrice, lowestPrice, allTiersAchieved } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  return (
    <section className="animate-celloh-fade-in-up -mt-5 relative z-10 rounded-t-2xl bg-white px-4 pb-5 pt-5 shadow-[0_-4px_20px_rgba(17,24,39,0.06)]">
      {/* 1. 상품 */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${badgeTone(badgeLabel)}`}
        >
          {badgeLabel}
        </span>
        {closed ?
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-black text-wadeal-muted">
            판매 종료
          </span>
        : null}
        {soldOut && !closed ?
          <span className="rounded-md bg-gray-800 px-2.5 py-1 text-[11px] font-black text-white">
            품절
          </span>
        : null}
        {succeeded ?
          <span className="rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700">
            할인가 적용
          </span>
        : null}
      </div>

      <h1 className="mt-3 text-xl font-bold leading-snug tracking-[-0.02em] text-wadeal-ink">
        {deal.title}
      </h1>

      <div className="mt-2">
        <ProductTrustStats
          participantCount={deal.participants}
          reviewSummary={reviewSummary}
        />
      </div>

      {/* 2. 가격 (상단 구매 정보) */}
      <div className="mt-4 rounded-2xl border border-wadeal-line bg-gray-50/80 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-wadeal-muted">정가</span>
          <span className="text-sm font-bold text-gray-400 line-through">
            {currency.format(deal.originalPrice)}원
          </span>
        </div>

        <div className="mt-3">
          <p className="text-xs font-bold text-wadeal-muted">판매가</p>
          <p className="mt-1 flex items-baseline gap-2">
            {discount > 0 ?
              <span className="text-[28px] font-bold leading-none text-wadeal-coral">
                {discount}%
              </span>
            : null}
            <span className="text-[28px] font-bold leading-none text-wadeal-ink">
              {currency.format(applicablePrice)}
              <span className="text-base font-bold">원</span>
            </span>
          </p>
          {!allTiersAchieved ?
            <p className="mt-2 text-[11px] font-bold text-wadeal-muted">
              수량에 따라 추가 할인이 적용될 수 있어요 · 최종가는 주문 시 확정
            </p>
          : <p className="mt-2 text-[11px] font-bold text-wadeal-coral">할인가 적용 중</p>}
        </div>

        {lowestPrice < applicablePrice ?
          <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <span className="text-[11px] font-bold text-wadeal-muted">최저가</span>
            <span className="text-sm font-black text-wadeal-ink">
              {currency.format(lowestPrice)}원
            </span>
          </div>
        : null}
      </div>

      {/* 3. 판매자 카드 (신뢰 지표) */}
      <ProductSellerPanel
        deal={deal}
        isLoggedIn={isLoggedIn}
        loginNext={loginNext}
        reviewSummary={reviewSummary}
      />
      <SellerStorySection deal={deal} />

      <div className="mt-4 space-y-3 rounded-2xl border border-wadeal-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-wadeal-ink">판매 현황</span>
          <span className="text-sm font-bold text-wadeal-ink">
            {deal.participants.toLocaleString("ko-KR")}명이 구매했어요
          </span>
        </div>
        <GroupBuyProgress deal={deal} showEndsIn />
        {!succeeded && remaining > 0 ?
          <p className="text-center text-[11px] font-bold text-wadeal-muted">
            판매 정보를 확인하고 구매해 보세요
          </p>
        : null}
      </div>

      <div className="mt-4 rounded-xl border border-wadeal-line p-4">
        <TierPriceSummary deal={deal} variant="inline" />
      </div>

      <div className="mt-4 rounded-xl border border-wadeal-line p-4">
        <DealDeadline deal={deal} variant="detail" />
      </div>

      <dl className="mt-4 space-y-2 rounded-xl border border-wadeal-line p-4 text-xs font-bold text-wadeal-muted">
        {remainingStockLabel ?
          <div className="flex justify-between gap-3">
            <dt>남은 수량</dt>
            <dd className={`font-black ${soldOut ? "text-wadeal-muted" : "text-wadeal-ink"}`}>
              {remainingStockLabel}
            </dd>
          </div>
        : null}
        <div className="flex justify-between gap-3">
          <dt>최소 주문</dt>
          <dd className="font-black text-wadeal-ink">{inventory.minOrderQuantity}개</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>최대 주문</dt>
          <dd className="font-black text-wadeal-ink">{inventory.maxOrderQuantity}개</dd>
        </div>
        {inventory.perUserLimit != null ?
          <div className="flex justify-between gap-3">
            <dt>1인 구매 한도</dt>
            <dd className="font-black text-wadeal-ink">{inventory.perUserLimit}개</dd>
          </div>
        : null}
      </dl>
    </section>
  );
}
