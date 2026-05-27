import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import {
  currency,
  getDealRemaining,
} from "@/lib/deals";
import { getProductDetailById } from "@/lib/data";

type JoinCompletePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function JoinCompletePage({
  searchParams,
}: JoinCompletePageProps) {
  const { id } = await searchParams;
  const deal = await getProductDetailById(id ?? "wd-vacuum-001");

  if (!deal) {
    notFound();
  }

  const remaining = getDealRemaining(deal);
  return (
    <PageShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-black text-wadeal-red">
          ✓
        </div>
        <h1 className="text-xl font-black text-wadeal-ink">
          공동구매 참여가 완료됐어요!
        </h1>
        <p className="mt-3 text-sm font-extrabold text-wadeal-ink">
          현재 {deal.participants}명 참여 중
        </p>
        <p className="mt-1 text-base font-black text-wadeal-red">
          최저가까지 {remaining}명 남았어요
        </p>
        <p className="mt-4 text-sm font-extrabold leading-relaxed text-wadeal-muted">
          친구를 초대하면 더 낮은 가격에 살 수 있어요.
        </p>

        <div className="panel mt-6 w-full p-3 text-left">
          <ProductSnippet deal={deal} size="sm" />
          <p className="mt-3 text-center text-xs font-bold text-wadeal-muted">
            예상 결제가 {currency.format(deal.groupPrice)}원 · 최저가{" "}
            {currency.format(deal.lowestPrice)}원
          </p>
        </div>

        <div className="mt-6 w-full space-y-2">
          <Link className="btn-kakao" href={`/share/${deal.slug}`}>
            카카오톡으로 친구 초대
          </Link>
          <Link className="btn-outline h-12 text-[15px]" href="/">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
