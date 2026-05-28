import { existsSync } from "node:fs";
import { join } from "node:path";

import type { User } from "@supabase/supabase-js";

import { isAdminUser } from "@/lib/auth/admin-access";
import {
  getBusinessSettings,
  isBusinessSettingsConfigured,
} from "@/lib/data/business-settings";
import { isPrototypeAuthEnabled, isProductionRuntime } from "@/lib/env/runtime";
import {
  getTossClientKey,
  getTossSecretKey,
  getTossWebhookSecret,
} from "@/lib/payments/toss/env";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MvpReadinessStatus = "ready" | "partial" | "missing" | "risk";

export type MvpReadinessCategory = "mvp" | "post-beta" | "deferred" | "risk";

export type MvpRiskLevel = "high" | "medium" | "low";

export type MvpReadinessItem = {
  id: string;
  label: string;
  category: MvpReadinessCategory;
  status: MvpReadinessStatus;
  message: string;
  detailUrl?: string;
  risk?: MvpRiskLevel;
};

export type MvpReadinessSummary = {
  mvpReady: number;
  mvpPartial: number;
  mvpMissing: number;
  mvpRisk: number;
  mvpTotal: number;
  mvpProgressPercent: number;
  overallMvpStatus: MvpReadinessStatus;
  incompleteCount: number;
  launchRiskCount: number;
};

export type MvpReadinessResult = {
  items: MvpReadinessItem[];
  summary: MvpReadinessSummary;
  checkedAt: string;
};

const POLICY_PAGES = [
  { slug: "terms", label: "이용약관" },
  { slug: "privacy", label: "개인정보처리방침" },
  { slug: "refund-policy", label: "환불·교환 정책" },
  { slug: "commerce-policy", label: "공동구매 운영정책" },
] as const;

const MVP_ROUTE_CHECKS: Array<{ id: string; label: string; segments: string[]; detailUrl?: string }> =
  [
    { id: "auth-login", label: "로그인·회원", segments: ["login", "page.tsx"], detailUrl: "/login" },
    {
      id: "product-catalog",
      label: "상품 목록·상세",
      segments: ["product", "[id]", "page.tsx"],
      detailUrl: "/",
    },
    {
      id: "group-buy-join",
      label: "공동구매 참여",
      segments: ["join", "[id]", "page.tsx"],
    },
    { id: "checkout-flow", label: "체크아웃", segments: ["checkout", "[id]", "page.tsx"] },
    { id: "order-history", label: "주문 내역", segments: ["mypage", "orders", "page.tsx"] },
    {
      id: "addresses",
      label: "배송지 관리",
      segments: ["mypage", "addresses", "page.tsx"],
      detailUrl: "/mypage/addresses",
    },
    {
      id: "payment-methods",
      label: "결제수단 선택",
      segments: ["mypage", "payment", "page.tsx"],
      detailUrl: "/mypage/payment",
    },
    {
      id: "admin-products",
      label: "관리자 상품",
      segments: ["admin", "products", "page.tsx"],
      detailUrl: "/admin/products",
    },
    {
      id: "admin-orders",
      label: "관리자 주문",
      segments: ["admin", "orders", "page.tsx"],
      detailUrl: "/admin/orders",
    },
    {
      id: "support-tickets-user",
      label: "고객 문의",
      segments: ["support", "page.tsx"],
      detailUrl: "/support",
    },
    {
      id: "support-tickets-admin",
      label: "관리자 문의",
      segments: ["admin", "support", "page.tsx"],
      detailUrl: "/admin/support",
    },
  ];

function appPath(...segments: string[]): string {
  return join(process.cwd(), "app", ...segments);
}

function fileExists(...segments: string[]): boolean {
  return existsSync(appPath(...segments));
}

function libExists(...segments: string[]): boolean {
  return existsSync(join(process.cwd(), "lib", ...segments));
}

function migrationExists(filename: string): boolean {
  return existsSync(join(process.cwd(), "supabase", "migrations", filename));
}

function policyPageExists(slug: string): boolean {
  return fileExists(slug, "page.tsx");
}

function worstMvpStatus(statuses: MvpReadinessStatus[]): MvpReadinessStatus {
  if (statuses.includes("missing")) {
    return "missing";
  }
  if (statuses.includes("risk")) {
    return "risk";
  }
  if (statuses.includes("partial")) {
    return "partial";
  }
  return "ready";
}

function buildSummary(items: MvpReadinessItem[]): MvpReadinessSummary {
  const mvpItems = items.filter((item) => item.category === "mvp");
  const mvpReady = mvpItems.filter((item) => item.status === "ready").length;
  const mvpPartial = mvpItems.filter((item) => item.status === "partial").length;
  const mvpMissing = mvpItems.filter((item) => item.status === "missing").length;
  const mvpRisk = mvpItems.filter((item) => item.status === "risk").length;
  const mvpTotal = mvpItems.length;

  const incompleteCount = items.filter(
    (item) =>
      item.category === "mvp" && (item.status === "partial" || item.status === "missing"),
  ).length;

  const launchRiskCount = items.filter(
    (item) =>
      item.status === "risk" ||
      item.category === "risk" ||
      (item.risk === "high" && item.status !== "ready"),
  ).length;

  return {
    mvpReady,
    mvpPartial,
    mvpMissing,
    mvpRisk,
    mvpTotal,
    mvpProgressPercent:
      mvpTotal === 0 ? 0 : Math.round((mvpReady / mvpTotal) * 100),
    overallMvpStatus: worstMvpStatus(mvpItems.map((item) => item.status)),
    incompleteCount,
    launchRiskCount,
  };
}

function routeCheckItem(check: (typeof MVP_ROUTE_CHECKS)[number]): MvpReadinessItem {
  const exists = fileExists(...check.segments);

  return {
    id: check.id,
    label: check.label,
    category: "mvp",
    status: exists ? "ready" : "missing",
    message: exists ? "필수 화면·라우트가 구현되어 있습니다." : "필수 페이지 파일이 없습니다.",
    detailUrl: check.detailUrl,
  };
}

function checkTierPricing(): MvpReadinessItem {
  const hasComponent = existsSync(join(process.cwd(), "components", "tier-pricing.tsx"));
  const hasLib =
    libExists("notifications", "price-tier.ts") || migrationExists("013_price_tiers_jsonb.sql");

  if (hasComponent && hasLib) {
    return {
      id: "tier-pricing",
      label: "수량 티어 가격",
      category: "mvp",
      status: "ready",
      message: "티어 UI·스키마·확정 로직이 준비되어 있습니다.",
    };
  }

  return {
    id: "tier-pricing",
    label: "수량 티어 가격",
    category: "mvp",
    status: hasComponent || hasLib ? "partial" : "missing",
    message: "티어 가격 구성요소 일부가 누락되었습니다.",
  };
}

function checkInstantPay(): MvpReadinessItem {
  const hasWidget = existsSync(join(process.cwd(), "components", "toss-payment-widget.tsx"));
  const hasConfirm = fileExists("api", "payments", "toss", "confirm", "route.ts");
  const hasPaymentRequest = fileExists("payment", "request", "[orderId]", "page.tsx");
  const clientKey = getTossClientKey();
  const secretKey = getTossSecretKey();

  if (!hasWidget || !hasConfirm || !hasPaymentRequest) {
    return {
      id: "instant-pay",
      label: "일반 즉시 결제",
      category: "mvp",
      status: "missing",
      message: "결제 위젯·확정 API·결제 요청 화면 중 일부가 없습니다.",
      detailUrl: "/admin/payments",
    };
  }

  if (!clientKey || !secretKey) {
    return {
      id: "instant-pay",
      label: "일반 즉시 결제",
      category: "mvp",
      status: "partial",
      message: "결제 UI·API는 있으나 토스 PG 키가 미설정입니다.",
      detailUrl: "/admin/payments",
      risk: "high",
    };
  }

  return {
    id: "instant-pay",
    label: "일반 즉시 결제",
    category: "mvp",
    status: "ready",
    message: "토스 위젯·승인 API·PG 키가 준비되어 있습니다.",
    detailUrl: "/admin/payments",
  };
}

function checkTossPgStructure(): MvpReadinessItem {
  const routes = [
    fileExists("api", "payments", "toss", "confirm", "route.ts"),
    fileExists("api", "payments", "toss", "webhook", "route.ts"),
    libExists("payments", "toss", "client.ts"),
    libExists("payments", "toss", "apply-confirm-result.ts"),
  ];
  const readyCount = routes.filter(Boolean).length;

  if (readyCount === routes.length) {
    return {
      id: "toss-pg-structure",
      label: "토스 결제 연동 구조",
      category: "mvp",
      status: "ready",
      message: "승인·웹훅·클라이언트·주문 반영 파이프라인이 구현되어 있습니다.",
      detailUrl: "/admin/payments",
    };
  }

  return {
    id: "toss-pg-structure",
    label: "토스 결제 연동 구조",
    category: "mvp",
    status: readyCount > 0 ? "partial" : "missing",
    message: `결제 연동 파일 ${readyCount}/${routes.length}개 확인됨`,
    detailUrl: "/admin/payments",
  };
}

function checkGroupBuyFinalize(): MvpReadinessItem {
  const hasLib = libExists("orders", "finalize-deal.ts");
  const hasAdminAction = existsSync(
    join(process.cwd(), "components", "admin-finalize-deal-button.tsx"),
  );

  if (hasLib && hasAdminAction) {
    return {
      id: "group-buy-finalize",
      label: "공동구매 확정",
      category: "mvp",
      status: "ready",
      message: "티어 확정·주문 금액 반영·관리자 확정 UI가 있습니다.",
      detailUrl: "/admin/orders",
    };
  }

  return {
    id: "group-buy-finalize",
    label: "공동구매 확정",
    category: "mvp",
    status: hasLib ? "partial" : "missing",
    message: hasLib ? "확정 로직은 있으나 관리자 UI를 확인하세요." : "확정 로직이 없습니다.",
    detailUrl: "/admin/orders",
  };
}

function checkReviewsBasic(): MvpReadinessItem {
  const hasData = libExists("data", "reviews.ts");
  const hasProductSection = existsSync(
    join(process.cwd(), "components", "product-reviews-section.tsx"),
  );
  const localLikes = libExists("reviews", "local-review-likes.ts");

  if (hasData && hasProductSection) {
    return {
      id: "reviews-basic",
      label: "기본 리뷰",
      category: "mvp",
      status: localLikes ? "partial" : "ready",
      message:
        localLikes ?
          "리뷰 CRUD·상품 노출은 구현됨. 좋아요는 localStorage 폴백(베타 이후 DB 전환 권장)."
        : "리뷰 목록·작성·관리자 검수가 구현되어 있습니다.",
      detailUrl: "/admin/reviews",
      risk: localLikes ? "low" : undefined,
    };
  }

  return {
    id: "reviews-basic",
    label: "기본 리뷰",
    category: "mvp",
    status: "missing",
    message: "리뷰 데이터 레이어 또는 UI가 없습니다.",
  };
}

function checkPolicies(): MvpReadinessItem {
  const missing = POLICY_PAGES.filter((page) => !policyPageExists(page.slug));

  if (missing.length === 0) {
    return {
      id: "policies-legal",
      label: "약관·정책 페이지",
      category: "mvp",
      status: "ready",
      message: "이용약관·개인정보·환불·공동구매 운영정책 페이지가 있습니다.",
    };
  }

  return {
    id: "policies-legal",
    label: "약관·정책 페이지",
    category: "mvp",
    status: "missing",
    message: `누락: ${missing.map((page) => page.label).join(", ")}`,
  };
}

async function checkBusinessFooter(): Promise<MvpReadinessItem> {
  const settings = await getBusinessSettings();
  const coreFilled = Boolean(
    settings.businessName?.trim() &&
      settings.businessNumber?.trim() &&
      settings.mailOrderSalesNumber?.trim(),
  );
  const footerExists = existsSync(join(process.cwd(), "components", "site-footer.tsx"));

  if (!footerExists) {
    return {
      id: "business-footer",
      label: "사업자 정보·푸터",
      category: "mvp",
      status: "missing",
      message: "SiteFooter 컴포넌트가 없습니다.",
      detailUrl: "/admin/settings/business",
    };
  }

  if (coreFilled && isBusinessSettingsConfigured(settings)) {
    return {
      id: "business-footer",
      label: "사업자 정보·푸터",
      category: "mvp",
      status: "ready",
      message: "사업자·통신판매업 정보와 푸터 연동이 준비되어 있습니다.",
      detailUrl: "/admin/settings/business",
    };
  }

  return {
    id: "business-footer",
    label: "사업자 정보·푸터",
    category: "mvp",
    status: coreFilled ? "partial" : "missing",
    message: coreFilled ?
        "핵심 사업자 정보는 입력됐으나 추가 항목·푸터 노출을 확인하세요."
      : "사업자·통신판매업 정보 입력이 필요합니다.",
    detailUrl: "/admin/settings/business",
    risk: coreFilled ? "medium" : "high",
  };
}

function checkSecurityRls(): MvpReadinessItem {
  const hasProductionRls = migrationExists("009_production_rls.sql");
  const hasHardening = migrationExists("019_security_rls_hardening.sql");

  if (hasProductionRls && hasHardening) {
    return {
      id: "security-rls",
      label: "보안·RLS",
      category: "mvp",
      status: "ready",
      message: "프로덕션 RLS·보안 강화 마이그레이션이 저장소에 있습니다. 배포 DB 적용을 확인하세요.",
    };
  }

  return {
    id: "security-rls",
    label: "보안·RLS",
    category: "mvp",
    status: hasProductionRls || hasHardening ? "partial" : "missing",
    message: "RLS 마이그레이션 일부 누락 — Supabase에 마이그레이션 적용 필요",
    risk: "high",
  };
}

function checkDeployment(): MvpReadinessItem {
  const supabaseOk = isSupabaseConfigured();
  const siteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

  if (supabaseOk && siteUrl) {
    return {
      id: "deployment",
      label: "Vercel·Supabase 배포",
      category: "mvp",
      status: "ready",
      message: "Supabase env·사이트 URL이 설정되어 있습니다. Vercel 프로덕션 배포·도메인은 콘솔에서 확인하세요.",
    };
  }

  if (supabaseOk) {
    return {
      id: "deployment",
      label: "Vercel·Supabase 배포",
      category: "mvp",
      status: "partial",
      message: "Supabase는 설정됨. NEXT_PUBLIC_SITE_URL·Vercel 프로덕션 배포를 확인하세요.",
      risk: "medium",
    };
  }

  return {
    id: "deployment",
    label: "Vercel·Supabase 배포",
    category: "mvp",
    status: "missing",
    message: "Supabase 환경변수 미설정 — 로컬·프로덕션 배포 전 필수",
    risk: "high",
  };
}

function buildPostBetaItems(): MvpReadinessItem[] {
  const billingStub = libExists("payments", "toss", "billing.ts");
  const alimtalkEnv = Boolean(process.env.KAKAO_ALIMTALK_API_KEY?.trim());
  const hasSupplierAdmin = fileExists("admin", "suppliers", "page.tsx");
  const hasSettlements = fileExists("admin", "settlements", "page.tsx");
  const hasCouponsMigration = migrationExists("026_coupons_points.sql");
  const hasReferral = migrationExists("017_share_referral_system.sql");
  const hasSearchLogs = migrationExists("016_search_categories.sql");
  const hasReviewImages = migrationExists("017_review_images_storage.sql");

  return [
    {
      id: "billing-auto-pay",
      label: "자동결제·빌링키 강화",
      category: "post-beta",
      status: billingStub ? "partial" : "missing",
      message: "빌링 API는 스텁·mock 위주. 실 API 연동은 베타 이후.",
    },
    {
      id: "alimtalk",
      label: "알림톡",
      category: "post-beta",
      status: alimtalkEnv ? "partial" : "missing",
      message: alimtalkEnv ?
          "API 키는 있으나 발송 로직 TODO 상태입니다."
        : "카카오 알림톡 env·발송 로직 미연동 (가격 알림 TODO).",
    },
    {
      id: "app-push",
      label: "앱 푸시",
      category: "post-beta",
      status: "missing",
      message: "인앱 알림센터만 구현. FCM/Web Push 미구현.",
      detailUrl: "/notifications",
    },
    {
      id: "supplier-onboarding",
      label: "공급사 온보딩",
      category: "post-beta",
      status: hasSupplierAdmin ? "partial" : "missing",
      message: "관리자 공급사 CRUD는 있으나 셀러 셀프 온보딩 플로우는 제한적.",
      detailUrl: "/admin/suppliers",
    },
    {
      id: "settlement-automation",
      label: "정산 자동화",
      category: "post-beta",
      status: hasSettlements ? "partial" : "missing",
      message: "정산 UI·mock 폴백 존재. PG·회계 자동 연동은 베타 이후.",
      detailUrl: "/admin/settlements",
    },
    {
      id: "recommendations",
      label: "추천·랭킹",
      category: "post-beta",
      status: "missing",
      message: "개인화 추천 엔진 없음. 운영 대시보드 인기 공동구매 집계만 존재.",
    },
    {
      id: "coupons-points",
      label: "쿠폰·포인트 강화",
      category: "post-beta",
      status: hasCouponsMigration ? "partial" : "missing",
      message: "체크아웃 할인·포인트 예약은 구현. 운영·마케팅 고도화는 베타 이후.",
    },
    {
      id: "friend-invite",
      label: "친구 초대 리워드",
      category: "post-beta",
      status: hasReferral ? "partial" : "missing",
      message: "추천 코드·공유 스키마는 있으나 리워드 정산 자동화는 미완.",
      detailUrl: "/share",
    },
    {
      id: "popular-search",
      label: "인기 검색어(로그)",
      category: "post-beta",
      status: hasSearchLogs ? "partial" : "missing",
      message: "search_logs·RPC 집계 구현. 데이터 축적 후 UI 노출 검증 필요.",
      detailUrl: "/search",
    },
    {
      id: "review-images",
      label: "리뷰 이미지 강화",
      category: "post-beta",
      status: hasReviewImages ? "partial" : "missing",
      message: "스토리지 마이그레이션·업로드 UI 존재. 운영 정책·용량 관리는 베타 이후.",
    },
  ];
}

function buildDeferredItems(): MvpReadinessItem[] {
  return [
    {
      id: "aggressive-auto-pay",
      label: "공격적 자동결제",
      category: "deferred",
      status: "risk",
      message: "출시 전 전량 자동결제·빌링 강제는 지양. 공동구매 확정 후 결제 흐름을 우선 검증하세요.",
      risk: "high",
    },
    {
      id: "complex-settlement",
      label: "복잡한 공급사 정산",
      category: "deferred",
      status: "partial",
      message: "수동·스프레드시트 정산으로 시작. 자동 분개·세금계산서 연동은 이후.",
      risk: "medium",
    },
    {
      id: "excessive-promotions",
      label: "과도한 프로모션·포인트",
      category: "deferred",
      status: "partial",
      message: "기본 쿠폰·포인트만 사용. 대규모 적립·중복 할인은 출시 후 단계적 도입.",
      risk: "medium",
    },
    {
      id: "unverified-external-apis",
      label: "미검증 외부 API",
      category: "deferred",
      status: "risk",
      message: "알림톡·PG 웹훅·서드파티는 스테이징·계약 검증 후 프로덕션 ON.",
      risk: "high",
    },
  ];
}

function buildLaunchRiskItems(): MvpReadinessItem[] {
  const items: MvpReadinessItem[] = [];

  if (isProductionRuntime() && isPrototypeAuthEnabled()) {
    items.push({
      id: "demo-login-prod",
      label: "프로덕션 데모 로그인",
      category: "risk",
      status: "risk",
      message: "NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true — 출시 전 비활성화 필수",
      risk: "high",
    });
  }

  const webhookSecret = getTossWebhookSecret();
  if (!webhookSecret) {
    items.push({
      id: "webhook-secret",
      label: "웹훅 시크릿",
      category: "risk",
      status: "risk",
      message: "TOSS_WEBHOOK_SECRET 미설정 — 웹훅 위·변조 검증 미흡",
      detailUrl: "/admin/payments",
      risk: "high",
    });
  }

  const secretKey = getTossSecretKey();

  if (isProductionRuntime() && secretKey && process.env.TOSS_BILLING_MOCK === "true") {
    items.push({
      id: "billing-mock-prod",
      label: "프로덕션 빌링 Mock",
      category: "risk",
      status: "risk",
      message: "TOSS_BILLING_MOCK=true — 실결제 전 반드시 해제",
      detailUrl: "/admin/payments",
      risk: "high",
    });
  }

  return items;
}

async function buildMvpReadinessItems(): Promise<MvpReadinessItem[]> {
  const items: MvpReadinessItem[] = [];

  for (const check of MVP_ROUTE_CHECKS) {
    items.push(routeCheckItem(check));
  }

  items.push(
    checkTierPricing(),
    checkInstantPay(),
    checkTossPgStructure(),
    checkGroupBuyFinalize(),
    checkReviewsBasic(),
    checkPolicies(),
    await checkBusinessFooter(),
    checkSecurityRls(),
    checkDeployment(),
  );

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { count: activeProducts, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      if (!error) {
        items.push({
          id: "active-products",
          label: "활성 상품(운영)",
          category: "mvp",
          status: (activeProducts ?? 0) > 0 ? "ready" : "partial",
          message:
            (activeProducts ?? 0) > 0 ?
              `활성 상품 ${(activeProducts ?? 0).toLocaleString("ko-KR")}개`
            : "활성 상품 0개 — 소규모 런칭 전 등록·활성화 필요",
          detailUrl: "/admin/products",
          risk: (activeProducts ?? 0) > 0 ? undefined : "medium",
        });
      }
    }
  }

  items.push(...buildPostBetaItems(), ...buildDeferredItems(), ...buildLaunchRiskItems());

  return items;
}

/** Server-side MVP readiness snapshot. Call only after admin auth check. */
export async function getMvpReadiness(): Promise<MvpReadinessResult> {
  const items = await buildMvpReadinessItems();

  return {
    items,
    summary: buildSummary(items),
    checkedAt: new Date().toISOString(),
  };
}

/** Admin-gated wrapper. Returns null when the caller is not an admin. */
export async function getMvpReadinessForAdmin(
  user: User | null,
): Promise<MvpReadinessResult | null> {
  if (!user || !(await isAdminUser(user))) {
    return null;
  }

  return getMvpReadiness();
}
