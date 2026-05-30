"use client";

import Link from "next/link";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import { MypageFollowingSellersRail } from "@/components/mypage/mypage-following-sellers-rail";
import { MypageOrderStatusBar } from "@/components/mypage/mypage-order-status-bar";
import { MypageProductRailSection } from "@/components/mypage/mypage-product-rail-section";
import { MypageProfileCard } from "@/components/mypage/mypage-profile-card";
import { MypageQuickMenu } from "@/components/mypage/mypage-quick-menu";
import { MypageRecentViewsSection } from "@/components/mypage/mypage-recent-views-section";
import { MypageRecentOrdersRail } from "@/components/mypage/mypage-recent-orders-rail";
import { MypageSupportLinks } from "@/components/mypage/mypage-support-links";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { Deal } from "@/lib/deals";
import type { MypageHubData } from "@/lib/mypage/hub-data";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import { getMockCouponBadge } from "@/lib/growth/cart-growth-mock";
import type { ShareStats } from "@/lib/share/types";
import type { User } from "@supabase/supabase-js";

type MypageCelloLoggedInProps = {
  user: User;
  profile: UserProfile;
  summary: MypageDashboardSummary;
  hubData: MypageHubData;
  catalog: Deal[];
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

export function MypageCelloLoggedIn({
  profile,
  summary,
  hubData,
  catalog,
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

      <MypageRecentViewsSection catalog={catalog} serverDeals={hubData.recentViewDeals} />

      <MypageProductRailSection
        deals={hubData.repeatPurchaseDeals}
        emptyMessage="다시 구매할 상품을 준비 중이에요"
        title="다시 살 만한 상품"
      />

      <GrowthProductRailSection
        ariaLabel="쿠폰 적용 추천"
        deals={hubData.couponRecommendedDeals}
        maxItems={12}
        resolveBadge={getMockCouponBadge}
        showCouponPrice
        subtitle="쿠폰으로 더 저렴하게 살 수 있어요"
        title="쿠폰 적용 추천"
      />

      <MypageProductRailSection
        deals={hubData.wishlistSimilarDeals}
        title="찜한 상품과 비슷한 상품"
      />

      <MypageSupportLinks />

      <MypageRecentOrdersRail orders={hubData.recentOrders} />

      <MypageFollowingSellersRail fallbackSellers={hubData.followedSellerPreviews} />

      <section className="px-6">
        <Link
          className="flex min-h-[48px] items-center justify-center rounded-[16px] bg-[#F5F7F6] px-4 text-[13px] font-medium text-[#2E5E4E] active:opacity-80"
          href="/search?q=인기판매자&tab=sellers"
        >
          좋은 판매자 소식 받아보기 →
        </Link>
      </section>
    </div>
  );
}
