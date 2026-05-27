import Link from "next/link";
import type { Deal } from "@/lib/deals";

type DealCardProps = {
  deal: Deal;
};

const currency = new Intl.NumberFormat("ko-KR");

export function DealCard({ deal }: DealCardProps) {
  const remainingUsers = Math.max(0, deal.targetParticipants - deal.participants);
  const discount = Math.round(
    ((deal.originalPrice - deal.groupPrice) / deal.originalPrice) * 100,
  );

  return (
    <Link
      className="block overflow-hidden rounded-lg border border-wadeal-line bg-white active:bg-gray-50"
      href={`/product/${deal.slug}`}
    >
      <article>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            alt={deal.title}
            className="h-full w-full object-cover"
            src={deal.imageUrl}
          />
          <div className="absolute left-2 top-2 rounded-full bg-wadeal-red px-2 py-1 text-[11px] font-black text-white">
            {deal.badge}
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[11px] font-black text-white">
            {deal.endsIn}
          </div>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-10 text-[14px] font-extrabold leading-5 text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[15px] font-black text-wadeal-red">{discount}%</span>
            <span className="text-xs font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}
            </span>
          </div>
          <div className="mt-0.5 text-[19px] font-black tracking-normal text-wadeal-ink">
            {currency.format(deal.groupPrice)}원
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs font-extrabold">
            <span className="text-wadeal-muted">{deal.participants}명 참여</span>
            <span className="text-wadeal-red">
              최저가까지 {remainingUsers}명
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function WideDealCard({ deal }: DealCardProps) {
  const remainingUsers = Math.max(0, deal.targetParticipants - deal.participants);
  const discount = Math.round(
    ((deal.originalPrice - deal.groupPrice) / deal.originalPrice) * 100,
  );

  return (
    <Link
      className="block rounded-lg border border-wadeal-line bg-white p-2 active:bg-gray-50"
      href={`/product/${deal.slug}`}
    >
      <article className="flex gap-3">
        <div className="relative h-[116px] w-[116px] shrink-0 overflow-hidden rounded-md bg-gray-100">
          <img
            alt={deal.title}
            className="h-full w-full object-cover"
            src={deal.imageUrl}
          />
          <span className="absolute left-2 top-2 rounded-full bg-wadeal-red px-2 py-1 text-[11px] font-black text-white">
            {deal.badge}
          </span>
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="text-xs font-black text-wadeal-red">{deal.endsIn} 남음</div>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold leading-5 text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-base font-black text-wadeal-red">{discount}%</span>
            <span className="text-xs font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}
            </span>
          </div>
          <div className="text-[21px] font-black tracking-normal text-wadeal-ink">
            {currency.format(deal.groupPrice)}원
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-xs font-extrabold">
            <span className="text-wadeal-muted">{deal.participants}명 참여</span>
            <span className="text-wadeal-red">최저가까지 {remainingUsers}명</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
