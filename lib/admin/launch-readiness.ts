import {
  isProductionRuntime,
  isPrototypeAuthEnabled,
  shouldUseMockData,
} from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LaunchEnvCheck = {
  key: string;
  label: string;
  required: boolean;
  present: boolean;
  note?: string;
};

export type LaunchReadinessSnapshot = {
  envChecks: LaunchEnvCheck[];
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  supabaseError: string | null;
  productCount: number | null;
  activeDealsCount: number | null;
  unprocessedSupportTicketsCount: number | null;
  unprocessedRefundRequestsCount: number | null;
  usingMockData: boolean;
  isProduction: boolean;
  demoLoginEnabled: boolean;
};

function envPresent(key: string): boolean {
  const value = process.env[key];
  return Boolean(value && value.trim().length > 0);
}

function buildEnvChecks(): LaunchEnvCheck[] {
  const isProduction = isProductionRuntime();

  return [
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      label: "Supabase URL",
      required: true,
      present: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      label: "Supabase Publishable Key",
      required: true,
      present: envPresent("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    },
    {
      key: "NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY",
      label: "카카오 JS SDK (공유)",
      required: false,
      present: envPresent("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY"),
      note: "카카오톡 공유 기능에 필요",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      label: "사이트 URL",
      required: false,
      present: envPresent("NEXT_PUBLIC_SITE_URL"),
      note: "공유·초대 링크 기본 URL",
    },
    {
      key: "REFERRAL_IP_SALT",
      label: "초대 IP 해시 Salt",
      required: false,
      present: envPresent("REFERRAL_IP_SALT"),
      note: "미설정 시 기본값 사용",
    },
    {
      key: "NEXT_PUBLIC_ALLOW_DEMO_LOGIN",
      label: "데모 로그인 허용",
      required: false,
      present: envPresent("NEXT_PUBLIC_ALLOW_DEMO_LOGIN"),
      note: isProduction ?
          isPrototypeAuthEnabled() ?
            "⚠️ 프로덕션에서 활성화됨"
          : "비활성 (권장)"
        : "개발 환경에서는 기본 허용",
    },
    {
      key: "NEXT_PUBLIC_TOSS_CLIENT_KEY",
      label: "토스페이먼츠 Client Key",
      required: false,
      present:
        envPresent("NEXT_PUBLIC_TOSS_CLIENT_KEY") ||
        envPresent("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY"),
      note: "결제위젯",
    },
    {
      key: "TOSS_SECRET_KEY",
      label: "토스페이먼츠 Secret Key",
      required: false,
      present: envPresent("TOSS_SECRET_KEY") || envPresent("TOSS_PAYMENTS_SECRET_KEY"),
      note: "서버 승인·웹훅 조회",
    },
    {
      key: "KAKAO_ALIMTALK_API_KEY",
      label: "카카오 알림톡 API Key (예정)",
      required: false,
      present: envPresent("KAKAO_ALIMTALK_API_KEY"),
      note: "알림톡 연동 전 — 미구현",
    },
  ];
}

export async function getLaunchReadinessSnapshot(): Promise<LaunchReadinessSnapshot> {
  const envChecks = buildEnvChecks();
  const supabaseConfigured = isSupabaseConfigured();
  const usingMockData = shouldUseMockData();
  const isProduction = isProductionRuntime();
  const demoLoginEnabled = isPrototypeAuthEnabled();

  let supabaseConnected = false;
  let supabaseError: string | null = null;
  let productCount: number | null = null;
  let activeDealsCount: number | null = null;
  let unprocessedSupportTicketsCount: number | null = null;
  let unprocessedRefundRequestsCount: number | null = null;

  if (!supabaseConfigured) {
    return {
      envChecks,
      supabaseConfigured,
      supabaseConnected,
      supabaseError: "Supabase 환경변수가 설정되지 않았습니다.",
      productCount,
      activeDealsCount,
      unprocessedSupportTicketsCount,
      unprocessedRefundRequestsCount,
      usingMockData,
      isProduction,
      demoLoginEnabled,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      envChecks,
      supabaseConfigured,
      supabaseConnected,
      supabaseError: "Supabase 클라이언트 생성에 실패했습니다.",
      productCount,
      activeDealsCount,
      unprocessedSupportTicketsCount,
      unprocessedRefundRequestsCount,
      usingMockData,
      isProduction,
      demoLoginEnabled,
    };
  }

  const [
    productsResult,
    dealsResult,
    ticketsResult,
    refundsResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("group_buy_deals")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .not("refund_requested_at", "is", null)
      .not("order_status", "in", '("cancelled","refunded")'),
  ]);

  const firstError =
    productsResult.error ??
    dealsResult.error ??
    ticketsResult.error ??
    refundsResult.error;

  if (firstError) {
    supabaseError = firstError.message;
  } else {
    supabaseConnected = true;
    productCount = productsResult.count ?? 0;
    activeDealsCount = dealsResult.count ?? 0;
    unprocessedSupportTicketsCount = ticketsResult.count ?? 0;
    unprocessedRefundRequestsCount = refundsResult.count ?? 0;
  }

  return {
    envChecks,
    supabaseConfigured,
    supabaseConnected,
    supabaseError,
    productCount,
    activeDealsCount,
    unprocessedSupportTicketsCount,
    unprocessedRefundRequestsCount,
    usingMockData,
    isProduction,
    demoLoginEnabled,
  };
}
