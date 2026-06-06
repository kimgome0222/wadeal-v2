import { redirect } from "next/navigation";
import { MypagePagination } from "@/components/mypage-pagination";
import { MypagePointsContent } from "@/components/mypage-points-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getPointBalance, getPointTransactionsForUser } from "@/lib/discounts/points";
import { parseMypagePageParam } from "@/lib/pagination/mypage";
import type { MypagePaginatedResult } from "@/lib/pagination/mypage";
import type { PointTransaction } from "@/lib/discounts/points";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type MypagePointsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MypagePointsPage({ searchParams }: MypagePointsPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/points");
  }

  const { page: pageParam } = await searchParams;
  const page = parseMypagePageParam(pageParam);

  const [balance, transactionsResult] = await Promise.all([
    getPointBalance(user.id),
    getPointTransactionsForUser(user.id, { page, pageSize: 10 }),
  ]);

  const paginatedTransactions = transactionsResult as MypagePaginatedResult<PointTransaction>;

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="포인트" />
      <div className={`${ui.pageBody} space-y-3`}>
        <MypagePointsContent
          balance={balance}
          transactions={paginatedTransactions.items}
        />
        <MypagePagination
          basePath="/mypage/points"
          pagination={{
            page: paginatedTransactions.page,
            total: paginatedTransactions.total,
            totalPages: paginatedTransactions.totalPages,
          }}
        />
      </div>
    </PageShell>
  );
}
