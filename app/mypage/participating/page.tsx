import Link from "next/link";
import { redirect } from "next/navigation";
import { MypagePagination } from "@/components/mypage-pagination";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getParticipatingDealSlugs, getProductDetailById } from "@/lib/data";
import { currency } from "@/lib/deals";
import { parseMypagePageParam } from "@/lib/pagination/mypage";
import { ui } from "@/lib/ui";

type ParticipatingPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ParticipatingPage({ searchParams }: ParticipatingPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/participating");
  }

  const { page: pageParam } = await searchParams;
  const page = parseMypagePageParam(pageParam);
  const participatingResult = await getParticipatingDealSlugs(user.id, { page, pageSize: 10 });
  const deals = (
    await Promise.all(
      participatingResult.items.map(async (slug) => getProductDetailById(slug)),
    )
  ).filter(Boolean);

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="구매 중인 상품" />
      {deals.length === 0 ?
        <div className={`${ui.pageBody} rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center`}>
          <p className="text-sm font-black text-wadeal-ink">구매 중인 상품이 없어요.</p>
        </div>
      : <>
          <ul className={`${ui.listDivider} ${ui.pageBody}`}>
            {deals.map((deal) =>
              deal ?
                <li className="py-3.5" key={deal.slug}>
                  <Link className="flex gap-3 active:opacity-80" href={`/product/${deal.slug}`}>
                    <img
                      alt={deal.title}
                      className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 object-cover"
                      src={deal.imageUrl}
                    />
                    <div>
                      <p className="text-sm font-extrabold text-wadeal-ink">{deal.title}</p>
                      <p className="mt-1 text-sm font-black text-wadeal-red">
                        {currency.format(deal.groupPrice)}원
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-wadeal-red">구매 중</p>
                    </div>
                  </Link>
                </li>
              : null,
            )}
          </ul>
          <div className={`${ui.pageBody} pt-0`}>
            <MypagePagination
              basePath="/mypage/participating"
              pagination={{
                page: participatingResult.page,
                total: participatingResult.total,
                totalPages: participatingResult.totalPages,
              }}
            />
          </div>
        </>
      }
    </PageShell>
  );
}
