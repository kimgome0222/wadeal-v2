import Link from "next/link";

import { ReferralInvitePanel } from "@/components/referral/referral-invite-panel";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

/** Quick Menu 지인초대 — 혜택 안내 + mock CTA */
export default function InvitePage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title="지인초대" />
      <div className={`${ui.pageBody} space-y-4 pb-8`}>
        <div>
          <h1 className="text-[22px] font-bold text-[#111111]">지인초대 혜택</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
            좋은 상품을 함께 쓰는 celloh, 지인을 초대하고 쿠폰 혜택을 받아보세요.
          </p>
        </div>
        <div className="rounded-2xl border border-[#2E5E4E]/20 bg-[#F5F7F6] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#2E5E4E]">이벤트</p>
          <h2 className="mt-1 text-[18px] font-bold text-[#111111]">지인초대 혜택</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">
            친구가 가입하면 3,000원 쿠폰, 친구 첫 구매 완료 시 나에게도 3,000원 쿠폰 (mock).
            실제 지급 전 법무·프로모션 검토가 필요합니다.
          </p>
        </div>
        <ReferralInvitePanel
          inviteUrl="https://celloh.example/invite?ref=GUEST-MOCK"
          referralCode="GUEST-MOCK"
        />
        <div className="flex flex-col gap-3 pt-2">
          <Link
            className="flex h-12 items-center justify-center rounded-2xl bg-[#2E5E4E] text-[14px] font-semibold text-white active:opacity-90"
            href="/login?next=/mypage/invite"
          >
            로그인하고 초대 링크 만들기
          </Link>
          <Link
            className="flex h-12 items-center justify-center rounded-2xl border border-[#E8ECEA] text-[14px] font-semibold text-[#2E5E4E]"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
