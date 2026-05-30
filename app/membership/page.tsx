import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

const BENEFIT_CARDS = [
  {
    title: "무료배송 쿠폰",
    description: "멤버십 회원 전용 무료배송 쿠폰 (mock)",
  },
  {
    title: "멤버십 전용 특가",
    description: "셀로단독특가·한정 상품 선공개",
  },
  {
    title: "생일·리뷰 혜택",
    description: "생일 쿠폰, 리뷰 적립 포인트 UP (준비 중)",
  },
];

/** Quick Menu 셀로 멤버십 — mock 혜택 안내 */
export default function MembershipPage() {
  return (
    <PageShell>
      <SubHeader backHref="/" title="셀로 멤버십" />
      <div className={`${ui.pageBody} space-y-4 pb-8`}>
        <div className="rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[12px] leading-relaxed text-[#666666]">
          셀로 멤버십은 <strong>준비 중</strong>입니다. 정기결제·자동결제는 PG 계약 및 법무 검토 후
          제공 예정이에요.
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-[#111111]">셀로 멤버십</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
            월 구독 가격: TODO — 운영 확정 · 현재 mock 혜택 안내만 제공합니다.
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
            href="/policies/membership"
          >
            멤버십 정책 보기
          </Link>
          <Link
            className="flex h-12 items-center justify-center rounded-2xl border border-[#E8ECEA] text-[14px] font-semibold text-[#666666]"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
