import { notFound } from "next/navigation";
import { ShareActions } from "@/components/share-actions";
import { SubHeader } from "@/components/sub-header";
import { getDealById } from "@/lib/data";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <main className={`${ui.pageWrap} pb-6 shadow-soft`}>
      <SubHeader backHref={`/join-complete?id=${deal.slug}`} title="상품 공유하기" />
      <section className={`${ui.pageBody} space-y-4`}>
        <div className="space-y-1.5 rounded-xl bg-wadeal-surface px-4 py-3.5">
          <p className="text-sm font-black text-wadeal-ink">친구에게 celloh 소개하기</p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            좋은 판매자의 상품을 함께 발견해보세요.
          </p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            마음에 드는 상품을 공유해보세요.
          </p>
        </div>

        <div className={`${ui.panel} space-y-3`}>
          <div>
            <p className="text-xs font-bold text-wadeal-muted">상품명</p>
            <p className="mt-1 text-sm font-black text-wadeal-ink">{deal.title}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-wadeal-muted">관심 고객</span>
            <span className="text-sm font-black text-wadeal-ink">{deal.participants}명</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-wadeal-muted">혜택 조건</span>
            <span className="text-sm font-black text-wadeal-ink">
              {deal.targetParticipants}명
            </span>
          </div>

          <div className="border-t border-wadeal-line pt-3">
            <p className="text-xs font-bold text-wadeal-muted">현재 혜택가</p>
            <p className="mt-1 text-[26px] font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
          </div>
        </div>

        <ShareActions />
      </section>
    </main>
  );
}
