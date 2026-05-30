"use client";

import Link from "next/link";

import { MypageFollowingSellersRail } from "@/components/mypage/mypage-following-sellers-rail";
import { MypageOrderStatusBar } from "@/components/mypage/mypage-order-status-bar";
import { MypageProductRailSection } from "@/components/mypage/mypage-product-rail-section";
import { MypageProfileCard } from "@/components/mypage/mypage-profile-card";
import { MypageQuickMenu } from "@/components/mypage/mypage-quick-menu";
import { MypageRecentOrdersRail } from "@/components/mypage/mypage-recent-orders-rail";
import { MypageSupportLinks } from "@/components/mypage/mypage-support-links";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { MypageHubData } from "@/lib/mypage/hub-data";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";
import type { User } from "@supabase/supabase-js";

type MypageCelloLoggedInProps = {
  user: User;
  profile: UserProfile;
  summary: MypageDashboardSummary;
  hubData: MypageHubData;
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

export function MypageCelloLoggedIn({
  profile,
  summary,
  hubData,
}: MypageCelloLoggedInProps) {
  const displayName = resolveUserDisplayName({ profile });
  const memberGrade =
    profile.memberGrade && profile.memberGrade !== "일반" ?
      profile.memberGrade
    : "WELCOME";
  const couponCount = Math.max(summary.couponUsageCount, 0);

  return (
    <div className="space-y-8 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-2">
      <MypageProfileCard
        celloCash={summary.pointsBalance}
        couponCount={couponCount}
        displayName={displayName}
        memberGrade={memberGrade}
      />

      <MypageOrderStatusBar
        counts={hubData.orderStatusCounts}
        reviewCount={summary.reviewableCount}
      />

      <MypageQuickMenu />

      <MypageRecentOrdersRail orders={hubData.recentOrders} />

      <MypageProductRailSection
        deals={hubData.recentViewDeals}
        emptyMessage="최근 본 상품이 없어요"
        moreHref="/mypage/recent"
        title="최근 본 상품"
      />

      <MypageProductRailSection
        deals={hubData.recommendedDeals}
        title="고객님을 위한 추천"
      />

      <MypageFollowingSellersRail fallbackSellers={hubData.followedSellerPreviews} />

      <section className="px-6">
        <Link
          className="flex min-h-[48px] items-center justify-center rounded-[16px] bg-[#F5F7F6] px-4 text-[13px] font-medium text-[#2E5E4E] active:opacity-80"
          href="/sellers"
        >
          좋은 판매자 소식 받아보기 →
        </Link>
      </section>

      <MypageSupportLinks />
    </div>
  );
}
