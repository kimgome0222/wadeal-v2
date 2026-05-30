"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { CoupangMenuSection } from "@/components/coupang-menu-list";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import { MypageOrderStatusBar } from "@/components/mypage-order-status-bar";
import { MypageShareStats } from "@/components/mypage-share-stats";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type MypageCelloLoggedInProps = {
  user: User;
  profile: UserProfile;
  summary: MypageDashboardSummary;
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

function SummaryCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      className="flex flex-1 flex-col rounded-xl border border-[#DDE8E2] bg-white px-3 py-3 transition-colors hover:bg-[#FAFBFA]"
      href={href}
    >
      <span className={`${ds.type.caption} text-wadeal-muted`}>{label}</span>
      <span className="mt-1 text-[15px] font-semibold text-wadeal-ink">{value}</span>
    </Link>
  );
}

export function MypageCelloLoggedIn({
  user,
  profile,
  summary,
  shareStats = null,
  referralCode = null,
  unreadNotificationCount = 0,
  roleLinks = [],
}: MypageCelloLoggedInProps) {
  const displayName = resolveUserDisplayName({ user, profile });
  const membershipLabel =
    profile.memberGrade && profile.memberGrade !== "일반" ?
      "이용중"
    : "일반 회원";

  const quickMenu = [
    { label: "주문내역", href: "/mypage/orders" },
    { label: "찜 리스트", href: "/saved" },
    { label: "찜 판매자", href: "/mypage/following-sellers" },
    { label: "최근 본 상품", href: "/mypage/recent" },
    { label: "리뷰관리", href: "/mypage/reviews" },
  ];

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3 pt-1">
        <h1 className={`truncate ${ds.type.h2}`}>{displayName}님</h1>
        <Link
          aria-label="설정"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDE8E2] text-wadeal-ink hover:bg-[#FAFBFA]"
          href="/mypage/settings"
        >
          <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.36.41.89.65 1.51.65H21a2 2 0 1 1 0 4h-.09c-.62 0-1.15.24-1.51.65Z" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      <div className="flex gap-2">
        <SummaryCard href="/mypage/benefits" label="멤버십" value={membershipLabel} />
        <SummaryCard
          href="/mypage/benefits"
          label="셀로 캐시"
          value={`${summary.pointsBalance.toLocaleString("ko-KR")}P`}
        />
        <SummaryCard href="/mypage/payment" label="셀로 머니" value="0원" />
      </div>

      <section className={`${ds.card.padded} !p-3`}>
        <p className={`mb-2 ${ds.type.label}`}>빠른 메뉴</p>
        <div className="grid grid-cols-5 gap-1">
          {quickMenu.map((item) => (
            <Link
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-center transition-colors hover:bg-[#F8FAF8]"
              href={item.href}
              key={item.href}
            >
              <span className="text-[11px] font-medium text-wadeal-ink">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <MypageOrderStatusBar summary={summary} />

      <section className="space-y-2">
        <div className="flex items-end justify-between gap-2">
          <h2 className={ds.type.h3}>최근 주문 상품</h2>
          <Link className={`${ds.type.link} text-[12px]`} href="/mypage/orders">
            더보기
          </Link>
        </div>
        {summary.totalOrders > 0 ?
          <p className={`${ds.type.bodySm} text-wadeal-muted`}>
            주문 {summary.totalOrders}건 · 진행 중 {summary.activeGroupBuyCount}건
          </p>
        : <div className={`${ui.panel} text-center ${ds.type.bodySm} text-wadeal-muted`}>
            아직 주문 내역이 없어요.
          </div>}
      </section>

      <section className="space-y-2">
        <h2 className={ds.type.h3}>자주 구매한 상품</h2>
        <div className={`${ui.panel} text-center ${ds.type.bodySm} text-wadeal-muted`}>
          구매 이력이 쌓이면 추천해 드려요.
        </div>
      </section>

      {shareStats ?
        <MypageShareStats referralCode={referralCode} stats={shareStats} />
      : null}

      <CoupangMenuSection
        items={[
          { label: "주문내역", href: "/mypage/orders" },
          { label: "찜리스트", href: "/saved" },
          { label: "최근본상품", href: "/mypage/recent" },
          { label: "자주산상품", href: "/mypage/recent", meta: "준비중" },
          { label: "취소/반품/교환 내역", href: "/mypage/orders" },
          { label: "결제수단·셀로페이", href: "/mypage/payment" },
          { label: "상품리뷰", href: "/mypage/reviews" },
          { label: "선물함", href: "/mypage/benefits", meta: "준비중" },
        ]}
        title="쇼핑"
      />

      <CoupangMenuSection
        items={[
          { label: "셀로 멤버십", href: "/mypage/benefits" },
          { label: "셀로 구독서비스", href: "/mypage/benefits", meta: "준비중" },
          { label: "셀로캐시", href: "/mypage/benefits" },
          { label: "결제수단", href: "/mypage/payment" },
          { label: "쿠폰/이용권", href: "/mypage/benefits" },
          { label: "셀로 체험단", href: "/mypage/benefits", meta: "준비중" },
        ]}
        title="결제 및 혜택"
      />

      <CoupangMenuSection items={[{ label: "친구초대", href: "/mypage/invite" }]} title="혜택" />

      <CoupangMenuSection
        items={[
          { label: "고객센터", href: "/support" },
          { label: "배송안내", href: "/refund-policy" },
          { label: "공지사항", href: "/support" },
          { label: "상품문의", href: "/mypage/support" },
          { label: "자주하는 질문", href: "/support" },
          { label: "1:1 문의", href: "/support/new" },
          { label: "대량 주문 문의", href: "/support/new", meta: "준비중" },
        ]}
        title="서비스 안내"
      />

      {roleLinks.length > 1 ?
        <CoupangMenuSection
          items={roleLinks.map((link) => ({ label: link.label, href: link.href }))}
          title="센터 바로가기"
        />
      : null}

      {unreadNotificationCount > 0 ?
        <p className={`text-center ${ds.type.caption}`}>
          읽지 않은 알림 {unreadNotificationCount}건 ·{" "}
          <Link className={ds.type.link} href="/notifications">
            확인하기
          </Link>
        </p>
      : null}

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </div>
  );
}
