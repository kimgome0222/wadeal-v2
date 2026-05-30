import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getDealById } from "@/lib/data";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import { ui } from "@/lib/ui";

type JoinCompletePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function JoinCompletePage({
  searchParams,
}: JoinCompletePageProps) {
  const { id } = await searchParams;
  const deal = await getDealById(id ?? "1");

  if (!deal) {
    notFound();
  }

  const seller = resolveSellerProfileForDeal(deal);

  return (
    <PageShell>
      <SubHeader backHref="/" title="주문 완료" />
      <section className={`${ui.pageBody} flex min-h-[60vh] flex-col items-center justify-center space-y-8 pb-12 text-center`}>
        <div>
          <div
            aria-hidden
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7F6] text-[28px] text-[#2E5E4E]"
          >
            ✓
          </div>
          <h1 className="text-[24px] font-bold text-[#111111]">주문이 완료되었습니다</h1>
          <p className="mt-3 text-[14px] text-[#666666]">구매해주셔서 감사합니다.</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Link
            className={`${ui.btnPrimary} flex h-14 items-center justify-center rounded-2xl text-[15px] font-semibold`}
            href="/mypage/orders"
          >
            주문내역 보기
          </Link>
          <Link
            className={`${ui.btnOutline} flex h-14 items-center justify-center rounded-2xl text-[15px] font-semibold`}
            href={getSellerPublicProfileHref({ id: seller.id })}
          >
            판매자관 보기
          </Link>
          <Link
            className="py-2 text-[14px] font-medium text-[#666666]"
            href="/"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
