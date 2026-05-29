import { PageShell } from "@/components/page-shell";
import { MypageFollowingSellersContent } from "@/components/mypage-following-sellers-content";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export default async function MypageFollowingSellersPage() {
  const user = await getServerAuthUser();

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="팔로우한 판매자" />
      <div className={`${ui.pageBody} space-y-3`}>
        <p className="text-xs font-medium text-wadeal-muted">
          관심 있는 판매자의 상품을 모아 확인하세요.
        </p>
        <MypageFollowingSellersContent isLoggedIn={!!user} />
      </div>
    </PageShell>
  );
}
