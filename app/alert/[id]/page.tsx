import { notFound } from "next/navigation";
import { AlertForm } from "@/components/alert-form";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById } from "@/lib/deals";

type AlertPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlertPage({ params }: AlertPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader title="가격 알림 설정" />
      <div className="space-y-4 px-4 py-4">
        <div className="panel flex gap-3 p-3">
          <img
            alt={deal.title}
            className="h-16 w-16 shrink-0 rounded-lg object-cover bg-gray-100"
            src={deal.imageUrl}
          />
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-extrabold text-wadeal-ink">
              {deal.title}
            </p>
            <p className="mt-1 text-base font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
          </div>
        </div>
        <AlertForm />
      </div>
    </PageShell>
  );
}
