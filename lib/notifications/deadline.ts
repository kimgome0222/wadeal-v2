import { notifyDealParticipants } from "@/lib/notifications/create";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type DeadlineSoonWindow = "24h" | "3h";

function formatDeadlineLabel(endsAt: string): string {
  const date = new Date(endsAt);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function windowLabel(window: DeadlineSoonWindow): string {
  return window === "24h" ? "24시간" : "3시간";
}

/**
 * Notify deal participants that the group-buy deadline is approaching.
 * Callable manually or from cron.
 */
export async function notifyDealDeadlineSoon(
  dealId: string,
  window: DeadlineSoonWindow = "24h",
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const { data: dealRow, error } = await supabase
    .from("group_buy_deals")
    .select("id, ends_at, status, product_id")
    .eq("id", dealId)
    .maybeSingle();

  if (error || !dealRow || dealRow.status !== "active") {
    return { success: false };
  }

  const { data: productRow } = await supabase
    .from("products")
    .select("slug, name")
    .eq("id", dealRow.product_id as string)
    .maybeSingle();

  if (!productRow) {
    return { success: false };
  }

  const endsAt = dealRow.ends_at as string;
  const deadlineLabel = formatDeadlineLabel(endsAt);

  await notifyDealParticipants(dealId, "deal_deadline_soon", {
    title: `혜택 종료 ${windowLabel(window)} 전`,
    message: `${productRow.name as string} · ${deadlineLabel} 혜택 종료`,
    linkUrl: `/product/${productRow.slug as string}`,
  });

  return { success: true };
}

/**
 * Scan active deals and notify participants for deals entering a deadline window.
 * Intended for cron / Edge Function (pass windowHours: 24 or 3).
 */
export async function notifyDealsDeadlineSoon(
  windowHours: 24 | 3,
): Promise<{ processed: number }> {
  if (!isSupabaseConfigured()) {
    return { processed: 0 };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { processed: 0 };
  }

  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;
  const fromIso = new Date(now).toISOString();
  const toIso = new Date(now + windowMs).toISOString();

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select("id")
    .eq("status", "active")
    .gt("ends_at", fromIso)
    .lte("ends_at", toIso);

  if (error || !data) {
    console.error("[notifications] notifyDealsDeadlineSoon:", error?.message);
    return { processed: 0 };
  }

  const window: DeadlineSoonWindow = windowHours === 24 ? "24h" : "3h";
  let processed = 0;

  for (const row of data) {
    const result = await notifyDealDeadlineSoon(row.id as string, window);
    if (result.success) {
      processed += 1;
    }
  }

  return { processed };
}
