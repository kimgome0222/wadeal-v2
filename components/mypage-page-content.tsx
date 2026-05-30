"use client";

import type { User } from "@supabase/supabase-js";

import { MypageCelloGuest } from "@/components/mypage/mypage-cello-guest";
import { MypageCelloLoggedIn } from "@/components/mypage-cello-logged-in";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { Deal } from "@/lib/deals";
import type { MypageHubData } from "@/lib/mypage/hub-data";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";

type MypagePageContentProps = {
  initialUser: User | null;
  unreadNotificationCount?: number;
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  profile?: UserProfile | null;
  dashboardSummary?: MypageDashboardSummary | null;
  hubData?: MypageHubData | null;
  roleLinks?: RoleNavLink[];
  guestPreviewDeals?: Deal[];
};

export function MypagePageContent({
  initialUser,
  shareStats = null,
  referralCode = null,
  profile = null,
  dashboardSummary = null,
  hubData = null,
  roleLinks = [],
  guestPreviewDeals = [],
}: MypagePageContentProps) {
  if (!initialUser) {
    return <MypageCelloGuest />;
  }

  const summary =
    dashboardSummary ?? {
      totalOrders: 0,
      paymentPendingCount: 0,
      shippingCount: 0,
      activeGroupBuyCount: 0,
      reviewableCount: 0,
      pointsBalance: 0,
      couponUsageCount: 0,
      wishlistCount: 0,
      recentViewsCount: 0,
      supportOpenCount: 0,
    };

  const emptyHub: MypageHubData = {
    orderStatusCounts: { paid: 0, preparing: 0, shipping: 0, delivered: 0 },
    recentOrders: [],
    recentViewDeals: [],
    recommendedDeals: [],
    repeatPurchaseDeals: [],
    couponRecommendedDeals: [],
    wishlistSimilarDeals: [],
    followedSellerPreviews: [],
  };

  return (
    <MypageCelloLoggedIn
      hubData={hubData ?? emptyHub}
      profile={
        profile ?? {
          userId: initialUser.id,
          nickname: null,
          email: initialUser.email ?? null,
          realName: null,
          phone: null,
          birthDate: null,
          gender: null,
          phoneVerifiedAt: null,
          verificationStatus: "unverified",
          marketingAgreedAt: null,
          accountStatus: "active",
          withdrawalRequestedAt: null,
          memberGrade: "일반",
          providerLabel: null,
        }
      }
      referralCode={referralCode}
      roleLinks={roleLinks}
      shareStats={shareStats}
      summary={summary}
      user={initialUser}
    />
  );
}
