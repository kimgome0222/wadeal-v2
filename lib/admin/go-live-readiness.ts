import { existsSync } from "node:fs";
import { join } from "node:path";

import type { User } from "@supabase/supabase-js";

import { isAdminUser } from "@/lib/auth/admin-access";
import {
  getBusinessSettings,
  isBusinessSettingsConfigured,
} from "@/lib/data/business-settings";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getTossClientKey,
  getTossSecretKey,
  getTossWebhookSecret,
} from "@/lib/payments/toss/env";

export type ReadinessStatus = "ready" | "warning" | "missing";

export type ReadinessItem = {
  id: string;
  label: string;
  status: ReadinessStatus;
  message: string;
  detailUrl?: string;
};

export type GoLiveReadinessSummary = {
  ready: number;
  warning: number;
  missing: number;
  total: number;
  overallStatus: ReadinessStatus;
  progressPercent: number;
};

export type GoLiveReadinessResult = {
  items: ReadinessItem[];
  summary: GoLiveReadinessSummary;
  checkedAt: string;
};

const POLICY_PAGES = [
  { slug: "terms", label: "이용약관", detailUrl: "/terms" },
  { slug: "privacy", label: "개인정보처리방침", detailUrl: "/privacy" },
  { slug: "refund-policy", label: "환불·교환 정책", detailUrl: "/refund-policy" },
  { slug: "commerce-policy", label: "쇼핑 운영정책", detailUrl: "/commerce-policy" },
] as const;

function worstStatus(statuses: ReadinessStatus[]): ReadinessStatus {
  if (statuses.includes("missing")) {
    return "missing";
  }
  if (statuses.includes("warning")) {
    return "warning";
  }
  return "ready";
}

function buildSummary(items: ReadinessItem[]): GoLiveReadinessSummary {
  const ready = items.filter((item) => item.status === "ready").length;
  const warning = items.filter((item) => item.status === "warning").length;
  const missing = items.filter((item) => item.status === "missing").length;
  const total = items.length;

  return {
    ready,
    warning,
    missing,
    total,
    overallStatus: worstStatus(items.map((item) => item.status)),
    progressPercent: total === 0 ? 0 : Math.round((ready / total) * 100),
  };
}

function policyPageExists(slug: string): boolean {
  const pagePath = join(process.cwd(), "app", slug, "page.tsx");
  return existsSync(pagePath);
}

function checkPgEnv(): ReadinessItem {
  const clientKey = getTossClientKey();
  const secretKey = getTossSecretKey();

  if (clientKey && secretKey) {
    return {
      id: "pg-env",
      label: "PG 결제 키",
      status: "ready",
      message: "토스페이먼츠 Client Key · Secret Key가 설정되어 있습니다.",
      detailUrl: "/admin/payments",
    };
  }

  if (clientKey || secretKey) {
    const missing = clientKey ? "Secret Key" : "Client Key";
    return {
      id: "pg-env",
      label: "PG 결제 키",
      status: "warning",
      message: `토스페이먼츠 ${missing}가 누락되었습니다.`,
      detailUrl: "/admin/payments",
    };
  }

  return {
    id: "pg-env",
    label: "PG 결제 키",
    status: "missing",
    message:
      "NEXT_PUBLIC_TOSS_CLIENT_KEY · TOSS_SECRET_KEY(또는 TOSS_PAYMENTS_* 별칭)를 설정해 주세요.",
    detailUrl: "/admin/payments",
  };
}

function checkWebhookConfigured(hasWebhookLogs: boolean): ReadinessItem {
  const webhookSecret = getTossWebhookSecret();

  if (webhookSecret) {
    return {
      id: "toss-webhook",
      label: "토스 웹훅",
      status: "ready",
      message: "웹훅 시크릿이 설정되어 있습니다.",
      detailUrl: "/admin/payments",
    };
  }

  if (hasWebhookLogs) {
    return {
      id: "toss-webhook",
      label: "토스 웹훅",
      status: "warning",
      message: "웹훅 로그는 있으나 TOSS_WEBHOOK_SECRET 미설정 — 서명 검증을 확인하세요.",
      detailUrl: "/admin/payments",
    };
  }

  return {
    id: "toss-webhook",
    label: "토스 웹훅",
    status: "warning",
    message:
      "TOSS_WEBHOOK_SECRET 미설정 · PG 콘솔에 /api/payments/toss/webhook URL 등록 후 시크릿을 설정하세요.",
    detailUrl: "/admin/payments",
  };
}

async function checkCriticalErrors(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
): Promise<ReadinessItem> {
  const { count, error } = await supabase
    .from("error_logs")
    .select("id", { count: "exact", head: true })
    .eq("level", "critical")
    .is("resolved_at", null);

  if (error) {
    const isMissingTable =
      error.message.includes("error_logs") ||
      error.code === "42P01" ||
      error.code === "PGRST205";

    if (isMissingTable) {
      return {
        id: "critical-errors",
        label: "치명적 오류",
        status: "warning",
        message: "error_logs 테이블이 없습니다. 모니터링 구성 후 재확인하세요.",
      };
    }

    return {
      id: "critical-errors",
      label: "치명적 오류",
      status: "warning",
      message: `오류 로그 조회 실패: ${error.message}`,
    };
  }

  const unresolved = count ?? 0;

  if (unresolved === 0) {
    return {
      id: "critical-errors",
      label: "치명적 오류",
      status: "ready",
      message: "미해결 치명적 오류가 없습니다.",
      detailUrl: "/admin/error-logs",
    };
  }

  return {
    id: "critical-errors",
    label: "치명적 오류",
    status: "warning",
    message: `미해결 치명적 오류 ${unresolved.toLocaleString("ko-KR")}건 — 즉시 확인이 필요합니다.`,
    detailUrl: "/admin/error-logs",
  };
}

async function buildGoLiveReadinessItems(): Promise<ReadinessItem[]> {
  const items: ReadinessItem[] = [];

  const settings = await getBusinessSettings();
  const businessCoreFilled = Boolean(
    settings.businessName?.trim() &&
      settings.businessNumber?.trim() &&
      settings.mailOrderSalesNumber?.trim(),
  );

  items.push(
    businessCoreFilled ?
      {
        id: "business-info",
        label: "사업자 정보",
        status: isBusinessSettingsConfigured(settings) ? "ready" : "warning",
        message:
          isBusinessSettingsConfigured(settings) ?
            "필수 사업자·통신판매업 정보가 입력되어 있습니다."
          : "핵심 항목은 입력됐으나 주소·대표자 등 추가 정보를 확인하세요.",
        detailUrl: "/admin/settings/business",
      }
    : {
        id: "business-info",
        label: "사업자 정보",
        status: "missing",
        message: "상호·사업자등록번호·통신판매업 신고번호를 입력해 주세요.",
        detailUrl: "/admin/settings/business",
      },
  );

  const missingPolicies = POLICY_PAGES.filter((page) => !policyPageExists(page.slug));
  items.push(
    missingPolicies.length === 0 ?
      {
        id: "policy-pages",
        label: "정책 페이지",
        status: "ready",
        message: "이용약관·개인정보·환불·쇼핑 운영정책 페이지가 준비되어 있습니다.",
      }
    : {
        id: "policy-pages",
        label: "정책 페이지",
        status: "missing",
        message: `누락된 정책 페이지: ${missingPolicies.map((page) => page.label).join(", ")}`,
      },
  );

  items.push(checkPgEnv());

  const supabaseConfigured = isSupabaseConfigured();
  let hasWebhookLogs = false;

  if (!supabaseConfigured) {
    items.push(
      {
        id: "supabase",
        label: "Supabase 연결",
        status: "missing",
        message: "Supabase 환경변수가 설정되지 않았습니다.",
      },
      {
        id: "products",
        label: "등록 상품",
        status: "missing",
        message: "Supabase 연결 후 상품 수를 확인할 수 있습니다.",
        detailUrl: "/admin/products",
      },
      checkWebhookConfigured(false),
      {
        id: "support-tickets",
        label: "미처리 문의",
        status: "missing",
        message: "Supabase 연결 후 문의 건수를 확인할 수 있습니다.",
        detailUrl: "/admin/support",
      },
      {
        id: "refunds",
        label: "환불 요청 대기",
        status: "missing",
        message: "Supabase 연결 후 환불 대기 건수를 확인할 수 있습니다.",
        detailUrl: "/admin/orders",
      },
      {
        id: "critical-errors",
        label: "치명적 오류",
        status: "missing",
        message: "Supabase 연결 후 오류 로그를 확인할 수 있습니다.",
      },
    );

    return items;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    items.push(
      {
        id: "supabase",
        label: "Supabase 연결",
        status: "missing",
        message: "Supabase 클라이언트 생성에 실패했습니다.",
      },
      checkWebhookConfigured(false),
    );
    return items;
  }

  const [
    productsResult,
    activeProductsResult,
    ticketsResult,
    refundsResult,
    webhookLogsResult,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .not("refund_requested_at", "is", null)
      .not("order_status", "in", '("cancelled","refunded")'),
    supabase.from("webhook_logs").select("id", { count: "exact", head: true }).limit(1),
  ]);

  const supabaseError =
    productsResult.error ??
    activeProductsResult.error ??
    ticketsResult.error ??
    refundsResult.error;

  items.push(
    supabaseError ?
      {
        id: "supabase",
        label: "Supabase 연결",
        status: "missing",
        message: supabaseError.message,
      }
    : {
        id: "supabase",
        label: "Supabase 연결",
        status: "ready",
        message: "데이터베이스 연결이 정상입니다.",
      },
  );

  const productCount = productsResult.count ?? 0;
  const activeProductCount = activeProductsResult.count ?? 0;

  items.push(
    activeProductCount > 0 ?
      {
        id: "products",
        label: "등록 상품",
        status: "ready",
        message: `전체 ${productCount.toLocaleString("ko-KR")}개 · 활성 ${activeProductCount.toLocaleString("ko-KR")}개`,
        detailUrl: "/admin/products",
      }
    : productCount > 0 ?
      {
        id: "products",
        label: "등록 상품",
        status: "warning",
        message: `등록 ${productCount.toLocaleString("ko-KR")}개 · 활성 상품 0개 — 출시 전 활성화가 필요합니다.`,
        detailUrl: "/admin/products",
      }
    : {
        id: "products",
        label: "등록 상품",
        status: "missing",
        message: "등록된 상품이 없습니다.",
        detailUrl: "/admin/products",
      },
  );

  hasWebhookLogs = !webhookLogsResult.error && (webhookLogsResult.count ?? 0) > 0;
  items.push(checkWebhookConfigured(hasWebhookLogs));

  const ticketCount = ticketsResult.error ? null : (ticketsResult.count ?? 0);
  items.push(
    ticketCount === null ?
      {
        id: "support-tickets",
        label: "미처리 문의",
        status: "warning",
        message: "문의 건수를 조회하지 못했습니다.",
        detailUrl: "/admin/support",
      }
    : ticketCount === 0 ?
      {
        id: "support-tickets",
        label: "미처리 문의",
        status: "ready",
        message: "미처리 문의가 없습니다.",
        detailUrl: "/admin/support",
      }
    : {
        id: "support-tickets",
        label: "미처리 문의",
        status: "warning",
        message: `미처리 문의 ${ticketCount.toLocaleString("ko-KR")}건`,
        detailUrl: "/admin/support",
      },
  );

  const refundCount = refundsResult.error ? null : (refundsResult.count ?? 0);
  items.push(
    refundCount === null ?
      {
        id: "refunds",
        label: "환불 요청 대기",
        status: "warning",
        message: "환불 대기 건수를 조회하지 못했습니다.",
        detailUrl: "/admin/orders",
      }
    : refundCount === 0 ?
      {
        id: "refunds",
        label: "환불 요청 대기",
        status: "ready",
        message: "대기 중인 환불 요청이 없습니다.",
        detailUrl: "/admin/orders",
      }
    : {
        id: "refunds",
        label: "환불 요청 대기",
        status: "warning",
        message: `환불 요청 대기 ${refundCount.toLocaleString("ko-KR")}건`,
        detailUrl: "/admin/orders",
      },
  );

  items.push(await checkCriticalErrors(supabase));

  const { count: pendingReviewReports, error: reviewReportsError } = await supabase
    .from("review_reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  items.push(
    reviewReportsError ?
      {
        id: "review-reports",
        label: "신고 리뷰",
        status: "warning",
        message: "신고 리뷰 건수를 조회하지 못했습니다.",
        detailUrl: "/admin/review-reports",
      }
    : (pendingReviewReports ?? 0) === 0 ?
      {
        id: "review-reports",
        label: "신고 리뷰",
        status: "ready",
        message: "미처리 신고 리뷰가 없습니다.",
        detailUrl: "/admin/review-reports",
      }
    : {
        id: "review-reports",
        label: "신고 리뷰",
        status: "warning",
        message: `미처리 신고 리뷰 ${(pendingReviewReports ?? 0).toLocaleString("ko-KR")}건`,
        detailUrl: "/admin/review-reports",
      },
  );

  return items;
}

/** Server-side go-live readiness snapshot. Call only after admin auth check. */
export async function getGoLiveReadiness(): Promise<GoLiveReadinessResult> {
  const items = await buildGoLiveReadinessItems();

  return {
    items,
    summary: buildSummary(items),
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Admin-gated wrapper. Returns null when the caller is not an admin.
 */
export async function getGoLiveReadinessForAdmin(
  user: User | null,
): Promise<GoLiveReadinessResult | null> {
  if (!user || !(await isAdminUser(user))) {
    return null;
  }

  return getGoLiveReadiness();
}
