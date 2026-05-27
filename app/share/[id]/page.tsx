import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ShareCta } from "@/components/share-cta";
import { SubHeader } from "@/components/sub-header";
import { getProductDetailById } from "@/lib/data";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const deal = await getProductDetailById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/join-complete?id=${deal.slug}`} title="친구 초대" />
      <div className={`${ui.pageBody} space-y-4`}>
        <div className="panel overflow-hidden p-0">
          <img
            alt={deal.title}
            className="aspect-[4/3] w-full bg-gray-100 object-cover"
            src={deal.imageUrl}
          />
          <div className="p-4">
            <p className="text-sm font-extrabold text-wadeal-ink">{deal.title}</p>
            <p className="mt-1 text-lg font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
          </div>
        </div>
        <ShareCta />
      </div>
    </PageShell>
  );
}
