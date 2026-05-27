import Link from "next/link";
import type { Deal } from "@/lib/deals";
import { getDealDiscount, getDealRemaining } from "@/lib/deals";
import { badgeTone } from "@/lib/ui";

const currency = new Intl.NumberFormat("ko-KR");

type DealCardProps = {
  deal: Deal;
};

export function DealCard({ deal }: DealCardProps) {
  const remainingUsers = getDealRemaining(deal);
  const discount = getDealDiscount(deal);

  return (
    <Link className="deal-card" href={`/product/${deal.slug}`}>
      <article>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            alt={deal.title}
            className="h-full w-full object-cover"
            src={deal.imageUrl}
          />
          <span
            className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-black ${badgeTone(deal.badge)}`}
          >
            {deal.badge}
          </span>
          <span className="absolute right-2 top-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-black text-white">
            {deal.endsIn}
          </span>
        </div>
        <div className="p-2.5 pt-2">
          <h3 className="line-clamp-2 min-h-[2.35rem] text-[13px] font-extrabold leading-[1.3] text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[15px] font-black text-wadeal-red">{discount}%</span>
            <span className="text-[11px] font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
          </div>
          <p className="mt-0.5 text-[18px] font-black leading-none text-wadeal-ink">
            {currency.format(deal.groupPrice)}
            <span className="text-[12px] font-extrabold">원</span>
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-extrabold">
            <span className="text-wadeal-muted">{deal.participants}명</span>
            <span className="text-wadeal-red">최저가까지 {remainingUsers}명</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
