import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ShareCta } from "@/components/share-cta";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById, getDealRemaining } from "@/lib/deals";

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
      <SubHeader title="친구 초대" />
      <div className="space-y-6 px-4 py-6">
        <div className="overflow-hidden rounded-lg border border-wadeal-line">
          <img
            alt={deal.title}
            className="aspect-video w-full object-cover"
            src={deal.imageUrl}
          />
          <div className="p-4">
            <p className="text-sm font-extrabold text-wadeal-ink">{deal.title}</p>
            <p className="mt-1 text-lg font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">
              최저가까지 {remaining}명
            </p>
          </div>
        </div>
        <ShareCta />
      </div>
    </PageShell>
  );
}
