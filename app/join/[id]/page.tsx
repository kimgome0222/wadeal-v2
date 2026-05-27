import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductSnippet } from "@/components/product-snippet";
import { SubHeader } from "@/components/sub-header";
import { getProductDetailById } from "@/lib/data";
import { ui } from "@/lib/ui";

type JoinPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { id } = await params;
  const deal = await getProductDetailById(id);

  if (!deal) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref={`/product/${deal.slug}`} title="참여 안내" />
      <div className={`${ui.pageBody} space-y-4`}>
        <div className="panel p-3">
          <ProductSnippet deal={deal} />
        </div>
        <p className="text-center text-[15px] font-black text-wadeal-ink">
          공동구매 참여를 위해 로그인이 필요해요
        </p>
        <div className="space-y-2">
          <Link
            className="btn-kakao"
            href={`/login?redirect=${encodeURIComponent(`/checkout/${deal.slug}`)}`}
          >
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
