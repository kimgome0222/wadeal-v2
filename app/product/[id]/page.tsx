import Link from "next/link";
import { notFound } from "next/navigation";
import { SubHeader } from "@/components/sub-header";
import {
  currency,
  getDealById,
  getDealDiscount,
  getDealRemaining,
} from "@/lib/deals";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  const remainingUsers = getDealRemaining(deal);
  const discount = getDealDiscount(deal);

  return (
    <main className="mx-auto min-h-screen max-w-[480px] bg-white pb-28 shadow-soft">
      <SubHeader title="공동구매 상세" />
      <img
        alt={deal.title}
        className="aspect-square w-full object-cover"
        src={deal.imageUrl}
      />
      <section className="space-y-4 px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-wadeal-red px-2.5 py-1 text-xs font-black text-white">
            {deal.badge}
          </span>
          <span className="text-xs font-black text-wadeal-red">
            {deal.endsIn} 남음
          </span>
        </div>
        <h1 className="text-[22px] font-black leading-7 text-wadeal-ink">
          {deal.title}
        </h1>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-wadeal-red">{discount}%</span>
            <span className="text-sm font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
          </div>
          <div className="mt-1 text-[30px] font-black tracking-normal text-wadeal-ink">
            {currency.format(deal.groupPrice)}원
          </div>
          <p className="mt-1 text-sm font-extrabold text-wadeal-red">
            최저가 {currency.format(deal.lowestPrice)}원
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-sm font-extrabold">
          <div className="flex justify-between">
            <span className="text-wadeal-muted">{deal.participants}명 참여</span>
            <span className="text-wadeal-red">최저가까지 {remainingUsers}명</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            className="flex h-11 items-center justify-center rounded-md border border-wadeal-line text-sm font-black text-wadeal-ink"
            href={`/alert/${deal.slug}`}
          >
            가격 알림 설정
          </Link>
          <Link
            className="flex h-11 items-center justify-center rounded-md border border-wadeal-kakao bg-wadeal-kakao text-sm font-black text-[#3c1e1e]"
            href={`/share/${deal.slug}`}
          >
            친구 초대
          </Link>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-wadeal-line bg-white px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <Link
          className="flex h-12 w-full items-center justify-center rounded-md bg-wadeal-red text-base font-black text-white"
          href={`/checkout/${deal.slug}`}
        >
          공동구매 참여하기
        </Link>
      </div>
    </main>
  );
}
