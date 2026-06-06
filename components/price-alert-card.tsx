import { currency } from "@/lib/deals";

export type PriceAlertCardItem = {
  id: string;
  dealSlug: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
  status: string;
};

type PriceAlertCardProps = {
  alert: PriceAlertCardItem;
};

export function PriceAlertCard({ alert }: PriceAlertCardProps) {
  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <p className="text-sm font-black text-wadeal-ink">{alert.productName}</p>
      <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
        <div className="flex justify-between gap-3">
          <dt>현재가</dt>
          <dd className="font-black text-wadeal-ink">
            {currency.format(alert.currentPrice)}원
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>목표가</dt>
          <dd className="font-black text-wadeal-red">
            {currency.format(alert.targetPrice)}원
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>상태</dt>
          <dd className="font-black text-wadeal-ink">{alert.status}</dd>
        </div>
      </dl>
    </article>
  );
}
