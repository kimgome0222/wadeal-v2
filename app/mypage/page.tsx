import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MypageMenu } from "@/components/mypage-menu";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function MypagePage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="마이페이지" />
      <div className="space-y-3 px-4 py-4">
        <Link
          className="block rounded-xl border border-wadeal-line bg-gradient-to-br from-[#fff8e6] to-white p-4 active:opacity-90"
          href="/login"
        >
          <p className="text-sm font-black text-wadeal-ink">로그인이 필요해요</p>
          <p className="mt-1 text-[13px] font-extrabold text-wadeal-red">
            카카오로 3초 만에 시작하기
          </p>
        </Link>
        <MypageMenu />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
