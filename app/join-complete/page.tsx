import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import {
  currency,
  getDealById,
  getDealRemaining,
} from "@/lib/deals";

type JoinCompletePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function JoinCompletePage({
  searchParams,
}: JoinCompletePageProps) {
  const { id } = await searchParams;
  const deal = getDealById(id ?? "wd-vacuum-001");

  if (!deal) {
    notFound();
  }

  const remaining = getDealRemaining(deal);

  return (
    <PageShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-black text-wadeal-red">
          ✓
        </div>
        <h1 className="text-lg font-black text-wadeal-ink">
          공동구매 참여가 완료됐어요
        </h1>
        <p className="mt-2 text-sm font-extrabold text-wadeal-red">
          최저가까지 {remaining}명 남음
        </p>
        <div className="panel mt-6 w-full p-3 text-left">
          <ProductSnippet deal={deal} size="sm" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-gray-50 py-2">
              <p className="text-[10px] font-bold text-wadeal-muted">참여 인원</p>
              <p className="mt-0.5 text-sm font-black text-wadeal-ink">
                {deal.participants}명
              </p>
            </div>
            <div className="rounded-lg bg-red-50 py-2">
              <p className="text-[10px] font-bold text-wadeal-red">예상 결제가</p>
              <p className="mt-0.5 text-sm font-black text-wadeal-red">
                {currency.format(deal.groupPrice)}원
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full space-y-2">
          <Link className="btn-kakao" href={`/share/${deal.slug}`}>
            카카오톡으로 친구 초대
          </Link>
          <Link className="btn-outline h-12 text-[15px]" href="/">
            홈으로
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
