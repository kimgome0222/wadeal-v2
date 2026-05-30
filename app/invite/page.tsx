import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

const BENEFIT_CARDS = [
  {
    title: "친구 초대 쿠폰",
    description: "지인이 가입하면 나와 친구 모두 쿠폰을 받아요.",
  },
  {
    title: "첫 구매 혜택",
    description: "초대받은 친구의 첫 구매에도 추가 혜택이 적용돼요.",
  },
  {
    title: "초대할수록 UP",
    description: "많이 초대할수록 더 큰 혜택을 준비 중이에요.",
  },
];

/** Quick Menu 지인초대 — 혜택 안내 */
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
        <ul className="space-y-3">
          {BENEFIT_CARDS.map((card) => (
            <li
              className="rounded-2xl border border-[#E8ECEA] bg-white p-4"
              key={card.title}
            >
              <p className="text-[15px] font-bold text-[#111111]">{card.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#666666]">{card.description}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            className="flex h-12 items-center justify-center rounded-2xl bg-[#2E5E4E] text-[14px] font-semibold text-white active:opacity-90"
            href="/mypage/invite"
          >
            초대 링크 만들기
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
