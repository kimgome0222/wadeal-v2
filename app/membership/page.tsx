import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

const BENEFIT_CARDS = [
  {
    title: "멤버십 전용 쿠폰",
    description: "매월 멤버십 회원만 받을 수 있는 쿠폰을 준비해요.",
  },
  {
    title: "적립 포인트 UP",
    description: "구매할수록 쌓이는 포인트 혜택을 더 크게 드려요.",
  },
  {
    title: "단독 특가 먼저",
    description: "셀로단독특가와 한정 상품을 먼저 만나볼 수 있어요.",
  },
];

/** Quick Menu 셀로 멤버십 — 혜택 안내 */
export default function MembershipPage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title="셀로 멤버십" />
      <div className={`${ui.pageBody} space-y-4 pb-8`}>
        <div>
          <h1 className="text-[22px] font-bold text-[#111111]">셀로 멤버십</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
            celloh 멤버십 혜택을 준비 중이에요. 곧 더 많은 혜택으로 찾아올게요.
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
            href="/mypage/benefits"
          >
            쿠폰·포인트 보러가기
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
