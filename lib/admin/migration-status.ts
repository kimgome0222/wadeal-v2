import { existsSync } from "node:fs";
import { join } from "node:path";

import type { User } from "@supabase/supabase-js";

import { isAdminUser } from "@/lib/auth/admin-access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MigrationApplyStatus = "applied" | "missing" | "partial" | "unknown";

export type MigrationProbeTarget = {
  kind: "table" | "column" | "view" | "storage_bucket";
  name: string;
  /** For column probes: table to select from */
  table?: string;
};

export type MigrationDefinition = {
  id: string;
  filename: string;
  label: string;
  description: string;
  targets: MigrationProbeTarget[];
};

export type MigrationStatusItem = {
  definition: MigrationDefinition;
  fileExists: boolean;
  status: MigrationApplyStatus;
  message: string;
  targetResults: Array<{
    target: MigrationProbeTarget;
    ok: boolean;
    message: string;
  }>;
};

export type MigrationStatusSummary = {
  applied: number;
  missing: number;
  partial: number;
  unknown: number;
  total: number;
};

export type MigrationStatusResult = {
  items: MigrationStatusItem[];
  summary: MigrationStatusSummary;
  supabaseConfigured: boolean;
  probeMode: "service_role" | "session" | "none";
  checkedAt: string;
};

/** Priority migrations for Supabase SQL Editor (030–045). */
export const PRIORITY_MIGRATIONS: MigrationDefinition[] = [
  {
    id: "030",
    filename: "030_business_settings.sql",
    label: "사업자 설정",
    description: "business_settings singleton 테이블 · RLS",
    targets: [{ kind: "table", name: "business_settings" }],
  },
  {
    id: "038",
    filename: "038_notifications_unified.sql",
    label: "통합 알림",
    description: "notifications target_role · seller_id · RPC",
    targets: [
      { kind: "table", name: "notifications" },
      { kind: "column", name: "target_role", table: "notifications" },
      { kind: "column", name: "seller_id", table: "notifications" },
    ],
  },
  {
    id: "039",
    filename: "039_seller_notices.sql",
    label: "판매자 공지",
    description: "seller_notices 테이블 · RLS",
    targets: [{ kind: "table", name: "seller_notices" }],
  },
  {
    id: "040",
    filename: "040_seller_application_review.sql",
    label: "입점 심사",
    description: "seller_documents · seller_review_checks",
    targets: [
      { kind: "table", name: "seller_documents" },
      { kind: "table", name: "seller_review_checks" },
    ],
  },
  {
    id: "041",
    filename: "041_category_product_review.sql",
    label: "상품 검수",
    description: "category_review_rules · product_review_checklists",
    targets: [
      { kind: "table", name: "category_review_rules" },
      { kind: "table", name: "product_review_checklists" },
    ],
  },
  {
    id: "042",
    filename: "042_seller_extended_tables.sql",
    label: "판매자 확장",
    description: "seller_users · seller_product_requests · seller_payout_accounts · seller_settlements view",
    targets: [
      { kind: "table", name: "seller_users" },
      { kind: "table", name: "seller_product_requests" },
      { kind: "table", name: "seller_payout_accounts" },
      { kind: "view", name: "seller_settlements" },
    ],
  },
  {
    id: "043",
    filename: "043_order_timelines.sql",
    label: "주문 타임라인",
    description: "order_timelines · append_order_timeline RPC",
    targets: [{ kind: "table", name: "order_timelines" }],
  },
  {
    id: "044",
    filename: "044_storage_seller_settlement_buckets.sql",
    label: "Storage 버킷",
    description: "seller-documents · settlement-files buckets",
    targets: [
      { kind: "storage_bucket", name: "seller-documents" },
      { kind: "storage_bucket", name: "settlement-files" },
    ],
  },
  {
    id: "045",
    filename: "045_refunds_cancel_flow.sql",
    label: "환불·취소",
    description: "refunds 테이블 · orders.refund_status",
    targets: [
      { kind: "table", name: "refunds" },
      { kind: "column", name: "refund_status", table: "orders" },
    ],
  },
  {
    id: "047",
    filename: "047_profile_usernames.sql",
    label: "아이디 로그인",
    description: "profile_usernames 테이블",
    targets: [{ kind: "table", name: "profile_usernames" }],
  },
  {
    id: "048",
    filename: "048_featured_search_terms.sql",
    label: "인기 검색어",
    description: "featured_search_terms 테이블",
    targets: [{ kind: "table", name: "featured_search_terms" }],
  },
  {
    id: "049",
    filename: "049_seller_payout_request.sql",
    label: "정산 출금요청",
    description: "settlement_records payout 컬럼 · enum 확장",
    targets: [
      { kind: "column", name: "payout_bank_name", table: "settlement_records" },
      { kind: "column", name: "payout_requested_at", table: "settlement_records" },
    ],
  },
  {
    id: "050",
    filename: "050_admin_cms_tables.sql",
    label: "Admin CMS",
    description: "admin_banners · admin_events · admin_category_overrides",
    targets: [
      { kind: "table", name: "admin_banners" },
      { kind: "table", name: "admin_events" },
      { kind: "table", name: "admin_category_overrides" },
    ],
  },
];

function migrationFilePath(filename: string): string {
  return join(process.cwd(), "supabase", "migrations", filename);
}

function migrationFileExists(filename: string): boolean {
  return existsSync(migrationFilePath(filename));
}

function isMissingProbeError(message: string | undefined): boolean {
  if (!message) {
    return false;
  }

  return (
    isMissingTableError(message) ||
    message.includes("PGRST204") ||
    message.includes("Could not find") ||
    (message.includes("column") && message.includes("does not exist"))
  );
}

async function probeTable(
  supabase: NonNullable<
    Awaited<ReturnType<typeof createServerSupabaseClient>>
  >,
  table: string,
): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from(table as "orders")
    .select("id", { head: true, count: "exact" });

  if (error) {
    if (isMissingProbeError(error.message)) {
      return { ok: false, message: "테이블 없음" };
    }
    return { ok: true, message: "테이블 존재 (조회 제한 가능)" };
  }

  return { ok: true, message: "테이블 존재" };
}

async function probeColumn(
  supabase: NonNullable<
    Awaited<ReturnType<typeof createServerSupabaseClient>>
  >,
  table: string,
  column: string,
): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from(table as "orders")
    .select(column)
    .limit(0);

  if (error) {
    if (isMissingProbeError(error.message)) {
      return { ok: false, message: "컬럼 없음" };
    }
    return { ok: true, message: "컬럼 존재 (조회 제한 가능)" };
  }

  return { ok: true, message: "컬럼 존재" };
}

async function probeStorageBucket(
  supabase: NonNullable<
    Awaited<ReturnType<typeof createServerSupabaseClient>>
  >,
  bucketId: string,
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    return { ok: false, message: "버킷 목록 조회 불가" };
  }

  const found = (data ?? []).some((bucket) => bucket.id === bucketId);
  return found ?
      { ok: true, message: "버킷 존재" }
    : { ok: false, message: "버킷 없음" };
}

async function probeTarget(
  supabase: NonNullable<
    Awaited<ReturnType<typeof createServerSupabaseClient>>
  >,
  target: MigrationProbeTarget,
): Promise<{ ok: boolean; message: string }> {
  switch (target.kind) {
    case "table":
    case "view":
      return probeTable(supabase, target.name);
    case "column":
      return probeColumn(supabase, target.table ?? "orders", target.name);
    case "storage_bucket":
      return probeStorageBucket(supabase, target.name);
    default:
      return { ok: false, message: "알 수 없는 대상" };
  }
}

function resolveMigrationStatus(
  targetResults: MigrationStatusItem["targetResults"],
): MigrationApplyStatus {
  if (targetResults.length === 0) {
    return "unknown";
  }

  const okCount = targetResults.filter((result) => result.ok).length;

  if (okCount === targetResults.length) {
    return "applied";
  }
  if (okCount === 0) {
    return "missing";
  }
  return "partial";
}

function buildSummary(items: MigrationStatusItem[]): MigrationStatusSummary {
  return {
    applied: items.filter((item) => item.status === "applied").length,
    missing: items.filter((item) => item.status === "missing").length,
    partial: items.filter((item) => item.status === "partial").length,
    unknown: items.filter((item) => item.status === "unknown").length,
    total: items.length,
  };
}

async function resolveSupabaseClient(): Promise<{
  client: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>> | null;
  probeMode: MigrationStatusResult["probeMode"];
}> {
  const serviceRole = createServiceRoleSupabaseClient();
  if (serviceRole) {
    return { client: serviceRole, probeMode: "service_role" };
  }

  const sessionClient = await createServerSupabaseClient();
  if (sessionClient) {
    return { client: sessionClient, probeMode: "session" };
  }

  return { client: null, probeMode: "none" };
}

export async function getMigrationStatus(): Promise<MigrationStatusResult> {
  const supabaseConfigured = isSupabaseConfigured();
  const checkedAt = new Date().toISOString();

  if (!supabaseConfigured) {
    const items: MigrationStatusItem[] = PRIORITY_MIGRATIONS.map((definition) => ({
      definition,
      fileExists: migrationFileExists(definition.filename),
      status: "unknown" as const,
      message: "Supabase 환경변수 미설정 — 원격 적용 여부를 확인할 수 없습니다.",
      targetResults: definition.targets.map((target) => ({
        target,
        ok: false,
        message: "미확인",
      })),
    }));

    return {
      items,
      summary: buildSummary(items),
      supabaseConfigured: false,
      probeMode: "none",
      checkedAt,
    };
  }

  const { client, probeMode } = await resolveSupabaseClient();

  if (!client) {
    const items: MigrationStatusItem[] = PRIORITY_MIGRATIONS.map((definition) => ({
      definition,
      fileExists: migrationFileExists(definition.filename),
      status: "unknown" as const,
      message: "Supabase 클라이언트 생성 실패",
      targetResults: definition.targets.map((target) => ({
        target,
        ok: false,
        message: "미확인",
      })),
    }));

    return {
      items,
      summary: buildSummary(items),
      supabaseConfigured: true,
      probeMode: "none",
      checkedAt,
    };
  }

  const items: MigrationStatusItem[] = [];

  for (const definition of PRIORITY_MIGRATIONS) {
    const fileExists = migrationFileExists(definition.filename);
    const targetResults: MigrationStatusItem["targetResults"] = [];

    for (const target of definition.targets) {
      const result = await probeTarget(client, target);
      targetResults.push({ target, ...result });
    }

    const status = fileExists ? resolveMigrationStatus(targetResults) : "unknown";
    const okTargets = targetResults.filter((result) => result.ok).length;
    const totalTargets = targetResults.length;

    let message: string;
    if (!fileExists) {
      message = "로컬 migration 파일 없음";
    } else if (status === "applied") {
      message = `모든 대상(${totalTargets}) 확인됨`;
    } else if (status === "missing") {
      message = "미적용 — Supabase SQL Editor에서 실행 필요";
    } else if (status === "partial") {
      message = `일부만 적용됨 (${okTargets}/${totalTargets})`;
    } else {
      message = "상태 확인 불가";
    }

    items.push({
      definition,
      fileExists,
      status,
      message,
      targetResults,
    });
  }

  return {
    items,
    summary: buildSummary(items),
    supabaseConfigured: true,
    probeMode,
    checkedAt,
  };
}

/** Admin-gated wrapper. Returns null when the caller is not an admin. */
export async function getMigrationStatusForAdmin(
  user: User | null,
): Promise<MigrationStatusResult | null> {
  if (!user || !(await isAdminUser(user))) {
    return null;
  }

  return getMigrationStatus();
}
