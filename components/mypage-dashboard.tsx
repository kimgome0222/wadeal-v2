"use client";

import Link from "next/link";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageDashboardProps = {
  profile: UserProfile;
  summary: MypageDashboardSummary;
};

type DashboardCard = {
  label: string;
  value: string | number;
  href: string;
  highlight?: boolean;
};

function DashboardCardLink({ card }: { card: DashboardCard }) {
  return (
    <Link className={`${ui.panelClickable} block`} href={card.href}>
      <p className="text-xs font-bold text-wadeal-muted">{card.label}</p>
      <p
        className={`mt-1 text-lg font-black ${card.highlight ? "text-wadeal-red" : "text-wadeal-ink"}`}
      >
        {card.value}
      </p>
    </Link>
  );
}

export function MypageDashboard({ profile, summary }: MypageDashboardProps) {
  const cards: DashboardCard[] = [
    {
      label: "주문·배송",
      value: summary.totalOrders,
      href: "/mypage/orders",
    },
    {
      label: "배송 진행",
      value: summary.shippingCount,
      href: "/mypage/orders",
      highlight: summary.shippingCount > 0,
    },
    {
      label: "결제 대기",
      value: summary.paymentPendingCount,
      href: "/mypage/orders",
      highlight: summary.paymentPendingCount > 0,
    },
    {
      label: "참여 중 공구",
      value: summary.activeGroupBuyCount,
      href: "/mypage/groupbuys",
      highlight: summary.activeGroupBuyCount > 0,
    },
    {
      label: "리뷰 작성",
      value: summary.reviewableCount,
      href: "/mypage/reviews",
      highlight: summary.reviewableCount > 0,
    },
    {
      label: "포인트",
      value: `${summary.pointsBalance.toLocaleString("ko-KR")}P`,
      href: "/mypage/benefits",
    },
    {
      label: "쿠폰 사용",
      value: summary.couponUsageCount,
      href: "/mypage/benefits",
    },
    {
      label: "찜한 상품",
      value: summary.wishlistCount,
      href: "/saved",
    },
    {
      label: "최근 본 상품",
      value: summary.recentViewsCount,
      href: "/mypage/recent",
    },
    {
      label: "문의 진행",
      value: summary.supportOpenCount,
      href: "/mypage/support",
      highlight: summary.supportOpenCount > 0,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-wadeal-ink">
              {profile.nickname ?? profile.realName ?? "회원"}
            </p>
            <p className="mt-1 truncate text-xs font-bold text-wadeal-muted">
              {profile.email ?? profile.providerLabel ?? ""}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-600">
            {profile.memberGrade}
          </span>
        </div>
        <Link className="mt-3 block rounded-lg bg-wadeal-surface px-3 py-2.5 active:bg-gray-100" href="/mypage/profile">
          <p className="text-xs font-semibold text-wadeal-muted">개인정보 · 배송지 · 결제수단</p>
          <p className="mt-0.5 text-sm font-bold text-wadeal-ink">개인정보 관리 ›</p>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-xs font-bold text-wadeal-muted">내 쇼핑 요약</h2>
        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => (
            <DashboardCardLink card={card} key={card.label} />
          ))}
        </div>
      </section>

      <Link
        className={`${ui.panelClickable} flex items-center justify-between`}
        href="/mypage/support"
      >
        <div>
          <p className="text-sm font-black text-wadeal-ink">고객센터</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            문의 내역 확인 · 새 문의하기
          </p>
        </div>
        <span aria-hidden className="text-gray-400">
          ›
        </span>
      </Link>
    </div>
  );
}
