"use client";

import type { User } from "@supabase/supabase-js";

import { MypageCelloLoggedIn } from "@/components/mypage-cello-logged-in";
import { MypageCelloLogin } from "@/components/mypage-cello-login";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";

type MypagePageContentProps = {
  initialUser: User | null;
  unreadNotificationCount?: number;
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  profile?: UserProfile | null;
  dashboardSummary?: MypageDashboardSummary | null;
  roleLinks?: RoleNavLink[];
};

export function MypagePageContent({
  initialUser,
  unreadNotificationCount = 0,
  shareStats = null,
  referralCode = null,
  profile = null,
  dashboardSummary = null,
  roleLinks = [],
}: MypagePageContentProps) {
  if (!initialUser) {
    return <MypageCelloLogin />;
  }

  if (profile && dashboardSummary) {
    return (
      <MypageCelloLoggedIn
        profile={profile}
        referralCode={referralCode}
        roleLinks={roleLinks}
        shareStats={shareStats}
        summary={dashboardSummary}
        unreadNotificationCount={unreadNotificationCount}
        user={initialUser}
      />
    );
  }

  return (
    <MypageCelloLoggedIn
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
      summary={
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
        }
      }
      unreadNotificationCount={unreadNotificationCount}
      user={initialUser}
    />
  );
}
