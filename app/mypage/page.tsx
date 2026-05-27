import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MypageMenu } from "@/components/mypage-menu";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function MypagePage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="마이페이지" />
      <div className={`${ui.pageBody} space-y-3`}>
        <Link
          className="block rounded-xl border border-wadeal-line bg-wadeal-surface p-4 active:opacity-90"
          href="/login"
        >
          <p className="text-sm font-black text-wadeal-ink">로그인이 필요해요</p>
          <p className="mt-0.5 text-[13px] font-extrabold text-wadeal-red">
            카카오로 3초 만에 시작하기
          </p>
        </Link>
        <MypageMenu />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
