import Link from "next/link";
import { notFound } from "next/navigation";
import { SubHeader } from "@/components/sub-header";
import { TierPricing } from "@/components/tier-pricing";
import {
  currency,
  getDealById,
  getDealDiscount,
} from "@/lib/deals";
import { badgeTone, ui } from "@/lib/ui";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  const discount = getDealDiscount(deal);

  return (
    <main className={`${ui.pageWrap} pb-28 shadow-soft`}>
      <SubHeader backHref="/" title="상품 상세" />
      <img
        alt={deal.title}
        className="aspect-square w-full object-cover bg-gray-100"
        src={deal.imageUrl}
      />
      <section className={`${ui.pageBody} space-y-3`}>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-black ${badgeTone(deal.badge)}`}
          >
            {deal.badge}
          </span>
          <span className="text-xs font-black text-wadeal-red">{deal.endsIn}</span>
        </div>
        <h1 className="text-lg font-black leading-snug text-wadeal-ink">{deal.title}</h1>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-wadeal-red">{discount}%</span>
            <span className="text-sm font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
          </div>
          <p className="mt-0.5 text-[26px] font-black text-wadeal-ink">
            {currency.format(deal.groupPrice)}원
          </p>
        </div>
        <TierPricing deal={deal} />
        <div className="grid grid-cols-2 gap-2">
          <Link className="btn-outline" href={`/alert/${deal.slug}`}>
            가격 알림 설정
          </Link>
          <Link className="btn-kakao text-sm" href={`/share/${deal.slug}`}>
            카카오 공유
          </Link>
        </div>
      </section>
      <div className={ui.stickyFooter}>
        <Link className="btn-primary" href={`/join/${deal.slug}`}>
          공동구매 참여하기
        </Link>
      </div>
    </main>
  );
}
