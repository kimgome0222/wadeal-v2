import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ShareCta } from "@/components/share-cta";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById, getDealRemaining } from "@/lib/deals";
import { ui } from "@/lib/ui";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  const remaining = getDealRemaining(deal);

  return (
    <PageShell>
      <SubHeader backHref={`/product/${deal.slug}`} title="친구 초대" />
      <div className={`${ui.pageBody} space-y-4`}>
        <div className="panel overflow-hidden p-0">
          <img
            alt={deal.title}
            className="aspect-[4/3] w-full object-cover bg-gray-100"
            src={deal.imageUrl}
          />
          <div className="p-4">
            <p className="text-sm font-extrabold text-wadeal-ink">{deal.title}</p>
            <p className="mt-1 text-lg font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
            <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
              최저가까지 {remaining}명
            </p>
          </div>
        </div>
        <ShareCta remaining={remaining} />
      </div>
    </PageShell>
  );
}
