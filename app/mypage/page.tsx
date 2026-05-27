import { BottomNavigation } from "@/components/bottom-navigation";
import { MypageMenu } from "@/components/mypage-menu";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";

export default function MypagePage() {
  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="마이페이지" />
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-lg border border-wadeal-line p-4">
          <p className="text-lg font-black text-wadeal-ink">김가나님</p>
          <p className="mt-1 text-sm font-bold text-wadeal-muted">
            이번 달 공동구매 3회 참여
          </p>
        </section>
        <MypageMenu />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
