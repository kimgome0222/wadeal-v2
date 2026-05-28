"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { logAdminActionFailure } from "@/lib/monitoring/log-admin-failure";
import { finalizeDeal, finalizeDealByProductId } from "@/lib/orders/finalize-deal";

export type FinalizeDealActionResult = {
  success: boolean;
  message: string;
  finalUnitPrice?: number;
  updatedOrderCount?: number;
};

async function ensureAdmin() {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false as const, message: "로그인이 필요해요." };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false as const, message: "관리자만 마감 처리할 수 있어요." };
  }

  return { ok: true as const };
}

function resultMessage(result: Awaited<ReturnType<typeof finalizeDeal>>): FinalizeDealActionResult {
  if (result.success && result.error !== "already_finalized") {
    return {
      success: true,
      message: result.message ?? "공동구매 마감 처리가 완료됐어요.",
      finalUnitPrice: result.finalUnitPrice,
      updatedOrderCount: result.updatedOrderCount,
    };
  }

  if (result.error === "already_finalized") {
    return {
      success: true,
      message: result.message ?? "이미 마감 처리된 공동구매예요.",
    };
  }

  const messages: Record<string, string> = {
    deal_not_found: "공동구매를 찾을 수 없어요.",
    not_due: "아직 마감 시간이 지나지 않았어요.",
    no_price_tiers: "가격 단계가 없어 마감할 수 없어요.",
    no_orders: "참여 주문이 없어 마감할 수 없어요.",
    not_configured: "Supabase 설정을 확인해 주세요.",
    save_failed: "마감 처리 중 오류가 발생했어요.",
  };

  return {
    success: false,
    message: result.message ?? messages[result.error ?? "save_failed"] ?? "마감 처리에 실패했어요.",
  };
}

function revalidateDealPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/settlements");
  revalidatePath("/");
  revalidatePath("/product/[id]", "page");
  revalidatePath("/checkout/[id]", "page");
  revalidatePath("/join/[id]", "page");
  revalidatePath("/mypage/orders");
}

export async function finalizeDealAction(dealId: string): Promise<FinalizeDealActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const result = await finalizeDeal(dealId, { force: true });
  const payload = resultMessage(result);

  if (!payload.success) {
    void logAdminActionFailure({
      message: payload.message,
      action: "finalize_deal",
      targetType: "deal",
      targetId: dealId,
      metadata: { error: result.error },
    });
  }

  if (payload.success) {
    revalidateDealPaths();
  }

  return payload;
}

export async function finalizeDealByProductAction(
  productId: string,
): Promise<FinalizeDealActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const result = await finalizeDealByProductId(productId, { force: true });
  const payload = resultMessage(result);

  if (payload.success) {
    revalidateDealPaths();
  }

  return payload;
}

/** Cron / Edge Function entry (requires service role or admin context). */
export async function finalizeDueDealsAction(): Promise<FinalizeDealActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, message: auth.message };
  }

  const { finalizeDueDeals } = await import("@/lib/orders/finalize-deal");
  const { processed, results } = await finalizeDueDeals();

  revalidateDealPaths();

  const failed = results.filter((item) => !item.success && item.error !== "already_finalized");

  return {
    success: failed.length === 0,
    message:
      processed === 0
        ? "마감 대상 공동구매가 없어요."
        : `${processed}건 처리 · 성공 ${results.length - failed.length}건`,
  };
}
