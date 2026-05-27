import Link from "next/link";
import type { Deal } from "@/lib/deals";
import { getDealDiscount, getDealRemaining } from "@/lib/deals";
import { badgeTone } from "@/lib/ui";

const currency = new Intl.NumberFormat("ko-KR");

type DealCardProps = {
  deal: Deal;
};

function DealCardContent({ deal }: DealCardProps) {
  const remainingUsers = getDealRemaining(deal);
  const discount = getDealDiscount(deal);

  return (
    <>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          alt={deal.title}
          className="h-full w-full object-cover"
          src={deal.imageUrl}
        />
        <span
          className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] font-black leading-none ${badgeTone(deal.badge)}`}
        >
          {deal.badge}
        </span>
        <span className="absolute right-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
          {deal.endsIn}
        </span>
      </div>
      <div className="p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-extrabold leading-[1.35] text-wadeal-ink">
          {deal.title}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-sm font-black text-wadeal-red">{discount}%</span>
          <span className="text-[11px] font-bold text-gray-400 line-through">
            {currency.format(deal.originalPrice)}원
          </span>
        </div>
        <p className="mt-0.5 text-[17px] font-black leading-tight text-wadeal-ink">
          {currency.format(deal.groupPrice)}
          <span className="text-[13px] font-extrabold">원</span>
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-1 text-[11px] font-extrabold">
          <span className="text-wadeal-muted">{deal.participants}명 참여</span>
          <span className="text-wadeal-red">최저가까지 {remainingUsers}명</span>
        </div>
      </div>
    </>
  );
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Link
      className="block overflow-hidden rounded-xl border border-wadeal-line bg-white active:bg-gray-50"
      href={`/product/${deal.slug}`}
    >
      <article>
        <DealCardContent deal={deal} />
      </article>
    </Link>
  );
}

export function FeaturedDealCard({ deal }: DealCardProps) {
  const remainingUsers = getDealRemaining(deal);
  const discount = getDealDiscount(deal);

  return (
    <Link
      className="col-span-2 block overflow-hidden rounded-xl border border-wadeal-line bg-white active:bg-gray-50"
      href={`/product/${deal.slug}`}
    >
      <article className="flex gap-3 p-2.5">
        <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            alt={deal.title}
            className="h-full w-full object-cover"
            src={deal.imageUrl}
          />
          <span
            className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] font-black ${badgeTone(deal.badge)}`}
          >
            {deal.badge}
          </span>
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-black text-white">
            {deal.endsIn}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-wadeal-red">{discount}%</span>
            <span className="text-xs font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
          </div>
          <p className="mt-0.5 text-[22px] font-black leading-tight text-wadeal-ink">
            {currency.format(deal.groupPrice)}
            <span className="text-sm font-extrabold">원</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-extrabold">
            <span className="text-wadeal-muted">{deal.participants}명 참여</span>
            <span className="text-wadeal-red">최저가까지 {remainingUsers}명</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
