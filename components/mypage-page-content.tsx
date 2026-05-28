"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setPrototypeSessionAction } from "@/app/actions/auth";
import { signInWithKakaoOAuth } from "@/lib/auth/supabase-oauth";
import {
  getAuthCompletionLabel,
  getAuthIdentityLine,
} from "@/lib/auth/user-display";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { MypageDashboard } from "@/components/mypage-dashboard";
import { MypageMenu } from "@/components/mypage-menu";
import { MypageRecentActivity } from "@/components/mypage-recent-activity";
import { MypageShareStats } from "@/components/mypage-share-stats";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { RoleNavLink } from "@/lib/auth/role-nav";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import type { ShareStats } from "@/lib/share/types";
import { ui } from "@/lib/ui";

type MypagePageContentProps = {
  initialUser: User | null;
  unreadNotificationCount?: number;
  shareStats?: ShareStats | null;
  referralCode?: string | null;
  profile?: UserProfile | null;
  dashboardSummary?: MypageDashboardSummary | null;
  roleLinks?: RoleNavLink[];
};

function MypageLoginPrompt() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prototypeEnabled = isPrototypeAuthEnabled();

  async function handleMockLogin() {
    await setPrototypeSessionAction();
    router.refresh();
  }

  async function handleKakaoLogin() {
    setErrorMessage(null);
    setLoading(true);

    try {
      await signInWithKakaoOAuth("/mypage");
    } catch (error) {
      console.error("[mypage] kakao login:", error);
      setErrorMessage("카카오 로그인을 시작하지 못했어요. 다시 시도해 주세요.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <p className="text-sm font-black text-wadeal-ink">로그인이 필요해요</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">
          로그인하면 가격 알림과 참여 내역을 확인할 수 있어요.
        </p>
      </div>

      {errorMessage ?
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      <button
        className={`${ui.btnKakao} cursor-pointer`}
        disabled={loading}
        onClick={() => void handleKakaoLogin()}
        type="button"
      >
        {loading ? "카카오 로그인 연결 중..." : "카카오로 시작하기"}
      </button>
      {prototypeEnabled ?
        <button
          className={`${ui.btnOutline} cursor-pointer`}
          onClick={() => void handleMockLogin()}
          type="button"
        >
          데모 로그인 (프로토타입)
        </button>
      : null}
    </div>
  );
}

export function MypagePageContent({
  initialUser,
  unreadNotificationCount = 0,
  shareStats = null,
  referralCode = null,
  profile = null,
  dashboardSummary = null,
  roleLinks = [],
}: MypagePageContentProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <div className="space-y-3">
        <MypageLoginPrompt />
        <MypageRecentActivity />
        <MypageMenu roleLinks={roleLinks} unreadNotificationCount={unreadNotificationCount} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {profile && dashboardSummary ?
        <MypageDashboard profile={profile} summary={dashboardSummary} />
      : <div className="rounded-xl border border-wadeal-line bg-white p-4">
          <p className="text-sm font-black text-wadeal-ink">{getAuthCompletionLabel(user)}</p>
          <p className="mt-2 break-all text-xs font-bold text-wadeal-muted">
            {getAuthIdentityLine(user)}
          </p>
        </div>
      }

      {shareStats ?
        <MypageShareStats referralCode={referralCode} stats={shareStats} />
      : null}

      <MypageRecentActivity />
      <MypageMenu unreadNotificationCount={unreadNotificationCount} />
    </div>
  );
}
