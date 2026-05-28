import { formatPriceAlertCondition } from "@/lib/data/alert-options";
import { getDealUuidById } from "@/lib/services/deals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
    return mockAlerts;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
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
    return [];
  }

  return (
    data as Array<{
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
    return { success: false, error: "save_failed" };
  }

  const dealUuid = await getDealUuidById(input.dealId);
  if (!dealUuid) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("price_alerts")
    .insert({
      deal_id: dealUuid,
      user_id: input.userId,
      target_price: input.targetPrice ?? null,
      notify_at_lowest_price: input.notifyAtLowestPrice ?? false,
      notify_before_deadline: input.notifyBeforeDeadline ?? false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[data] createPriceAlert:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: (data as { id: string }).id };
}
