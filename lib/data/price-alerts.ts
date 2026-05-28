import { formatPriceAlertCondition } from "@/lib/data/alert-options";
import { getDealUuidById } from "@/lib/services/deals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[price-alerts] using mock fallback: ${context}`);
  }
}

export type PriceAlertListItem = {
  id: string;
  dealSlug: string;
  productName: string;
  condition: string;
  href: string;
};

const mockAlerts: PriceAlertListItem[] = [
  {
    id: "mock-1",
    dealSlug: "wd-vacuum-001",
    productName: "초경량 무선 청소기",
    condition: "39,000원 이하",
    href: "/alert/wd-vacuum-001",
  },
];

export async function getPriceAlertsForUser(
  userId: string,
): Promise<PriceAlertListItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getPriceAlertsForUser: Supabase is not configured");
    return mockAlerts;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getPriceAlertsForUser: failed to create Supabase client");
    return mockAlerts;
  }

  const { data, error } = await supabase
    .from("price_alerts")
    .select(
      `
      id,
      target_price,
      notify_at_lowest_price,
      notify_before_deadline,
      group_buy_deals!inner (
        products!inner (
          slug,
          name
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[data] getPriceAlertsForUser:", error?.message);
    logMockFallback("getPriceAlertsForUser: query error");
    return mockAlerts;
  }

  if (data.length === 0) {
    logMockFallback("getPriceAlertsForUser: empty result");
    return mockAlerts;
  }

  return (
    data as unknown as Array<{
      id: string;
      target_price: number | null;
      notify_at_lowest_price: boolean;
      notify_before_deadline: boolean;
      group_buy_deals: { products: { slug: string; name: string } };
    }>
  ).map((row) => {
    const slug = row.group_buy_deals.products.slug;
    return {
      id: row.id,
      dealSlug: slug,
      productName: row.group_buy_deals.products.name,
      condition: formatPriceAlertCondition(row),
      href: `/alert/${slug}`,
    };
  });
}

export type CreatePriceAlertResult = {
  success: boolean;
  id?: string;
  error?: "login_required" | "invalid_target_price" | "save_failed";
};

export async function createPriceAlert(input: {
  dealId: string;
  userId: string;
  targetPrice?: number | null;
  notifyAtLowestPrice?: boolean;
  notifyBeforeDeadline?: boolean;
}): Promise<CreatePriceAlertResult> {
  if (
    input.targetPrice != null &&
    (!Number.isFinite(input.targetPrice) || input.targetPrice < 0)
  ) {
    return { success: false, error: "invalid_target_price" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-alert" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("createPriceAlert: failed to create Supabase client");
    return { success: true, id: "mock-alert" };
  }

  const dealUuid = await getDealUuidById(input.dealId);
  if (!dealUuid) {
    logMockFallback("createPriceAlert: deal not found");
    return { success: true, id: "mock-alert" };
  }

  // TODO(kakao): 목표가 도달 시 kakao_notify_status='pending' row에 대해
  // 카카오톡 메시지 알림(알림톡/비즈메시지) 발송 — /alert/[id] 「알림 메세지 받기」와 연동
  const { data, error } = await supabase
    .from("price_alerts")
    .insert({
      deal_id: dealUuid,
      user_id: input.userId,
      target_price: input.targetPrice ?? null,
      notify_at_lowest_price: input.notifyAtLowestPrice ?? false,
      notify_before_deadline: input.notifyBeforeDeadline ?? false,
      kakao_notify_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[data] createPriceAlert:", error.message);
    logMockFallback("createPriceAlert: insert failed");
    return { success: true, id: "mock-alert" };
  }

  return { success: true, id: (data as { id: string }).id };
}
