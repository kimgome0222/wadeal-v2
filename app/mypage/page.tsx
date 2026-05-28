import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import {
  getAuthDisplayName,
  getServerAuthUser,
} from "@/lib/auth/server-session";
import { MypageMenu } from "@/components/mypage-menu";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypagePage() {
  const user = await getServerAuthUser();

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="마이페이지" />
      <div className={`${ui.pageBody} space-y-3`}>
        {user ?
          <div className="rounded-xl border border-wadeal-line bg-wadeal-surface p-4">
            <p className="text-sm font-black text-wadeal-ink">
              {getAuthDisplayName(user)}님, 안녕하세요
            </p>
            <p className="mt-0.5 text-[13px] font-extrabold text-wadeal-muted">
              Wadeal과 함께 공동구매 중이에요
            </p>
          </div>
        : <Link
            className="block rounded-xl border border-wadeal-line bg-wadeal-surface p-4 active:opacity-90"
            href="/login?redirect=/mypage"
          >
            <p className="text-sm font-black text-wadeal-ink">로그인이 필요해요</p>
            <p className="mt-0.5 text-[13px] font-extrabold text-wadeal-red">
              카카오로 3초 만에 시작하기
            </p>
          </Link>
        }
        <MypageMenu />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
