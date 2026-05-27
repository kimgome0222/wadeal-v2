import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById } from "@/lib/deals";

type JoinPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/product/${deal.slug}`} title="공동구매 참여" />
      <div className="space-y-5 px-4 py-6">
        <div className="panel flex gap-3 p-3">
          <img
            alt={deal.title}
            className="h-20 w-20 shrink-0 rounded-lg object-cover bg-gray-100"
            src={deal.imageUrl}
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-extrabold text-wadeal-ink">
              {deal.title}
            </p>
            <p className="mt-2 text-lg font-black text-wadeal-red">
              {currency.format(deal.groupPrice)}원
            </p>
          </div>
        </div>

        <p className="text-center text-base font-black text-wadeal-ink">
          공동구매 참여를 위해 로그인이 필요해요
        </p>

        <div className="space-y-2.5">
          <Link className="btn-kakao" href="/login">
            로그인하고 참여하기
          </Link>
          <Link className="btn-outline h-12 text-[15px]" href={`/checkout/${deal.slug}`}>
            이미 로그인했어요
          </Link>
        </div>

        <Link
          className="block text-center text-sm font-bold text-wadeal-muted"
          href={`/product/${deal.slug}`}
        >
          상품 상세로 돌아가기
        </Link>
      </div>
    </PageShell>
  );
}
