"use client";

import type { User } from "@supabase/supabase-js";

import { MypageFollowingSellersRail } from "@/components/mypage/mypage-following-sellers-rail";
import { MypageOrderStatusBar } from "@/components/mypage/mypage-order-status-bar";
import { MypageProfileCard } from "@/components/mypage/mypage-profile-card";
import { MypageQuickMenu } from "@/components/mypage/mypage-quick-menu";
import { MypageRecentOrdersRail } from "@/components/mypage/mypage-recent-orders-rail";
import { MypageRecentViewsRail } from "@/components/mypage/mypage-recent-views-rail";
import { MypageTextMenus } from "@/components/mypage/mypage-text-menus";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { MypageHubData } from "@/lib/mypage/hub-data";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";

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
    : "일반회원";
  const couponCount = Math.max(summary.couponUsageCount, 0);

  return (
    <div className="space-y-10 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-2">
      <MypageProfileCard
        celloCash={summary.pointsBalance}
        couponCount={couponCount}
        displayName={displayName}
        memberGrade={memberGrade}
      />

      <MypageOrderStatusBar counts={hubData.orderStatusCounts} />

      <MypageQuickMenu />

      <MypageRecentOrdersRail orders={hubData.recentOrders} />

      <MypageRecentViewsRail deals={hubData.recentViewDeals} />

      <MypageFollowingSellersRail fallbackSellers={hubData.followedSellerPreviews} />

      <MypageTextMenus />

      <div className="px-6">
        <ul className="overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white">
          <li>
            <MypageLogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
