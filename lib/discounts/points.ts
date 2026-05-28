import type { PointTransactionType } from "@/lib/discounts/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  buildMypagePaginatedResult,
  paginateArray,
  resolveMypagePagination,
  type MypagePaginatedResult,
  type MypagePaginationOptions,
} from "@/lib/pagination/mypage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PointTransaction = {
  id: string;
  userId: string;
  orderId: string | null;
  type: PointTransactionType;
  amount: number;
  reason: string | null;
  createdAt: string;
};

const mockBalances = new Map<string, number>();
const mockTransactions = new Map<string, PointTransaction[]>();

export function getMaxUsablePoints(subtotalAfterCoupon: number, balance: number): number {
  const subtotal = Math.max(0, Math.round(subtotalAfterCoupon));
  const available = Math.max(0, Math.round(balance));
  return Math.min(subtotal, available);
}

export async function getPointBalance(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return mockBalances.get(userId) ?? 5000;
    }
    return 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { data, error } = await supabase
    .from("user_points")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[points] getPointBalance:", error.message);
    return 0;
  }

  return ((data as { balance: number } | null)?.balance) ?? 0;
}

export async function reservePoints(input: {
  userId: string;
  amount: number;
  orderId: string;
}): Promise<{ success: boolean; error?: "insufficient_points" | "save_failed" }> {
  const amount = Math.round(input.amount);
  if (amount <= 0) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const balance = mockBalances.get(input.userId) ?? 5000;
      if (balance < amount) {
        return { success: false, error: "insufficient_points" };
      }
      mockBalances.set(input.userId, balance - amount);
      const txns = mockTransactions.get(input.userId) ?? [];
      txns.unshift({
        id: `mock-tx-${Date.now()}`,
        userId: input.userId,
        orderId: input.orderId,
        type: "use",
        amount,
        reason: "order_reserve",
        createdAt: new Date().toISOString(),
      });
      mockTransactions.set(input.userId, txns);
      return { success: true };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase.rpc("reserve_points", {
    p_user_id: input.userId,
    p_amount: amount,
    p_order_id: input.orderId,
  });

  if (error) {
    if (error.message.includes("insufficient_points")) {
      return { success: false, error: "insufficient_points" };
    }
    console.error("[points] reservePoints:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function commitDiscounts(
  orderId: string,
): Promise<{ success: boolean; error?: "save_failed" }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase.rpc("commit_discounts", {
    p_order_id: orderId,
  });

  if (error) {
    console.error("[points] commitDiscounts:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function rollbackDiscounts(
  orderId: string,
): Promise<{ success: boolean; error?: "save_failed" }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase.rpc("rollback_discounts", {
    p_order_id: orderId,
  });

  if (error) {
    console.error("[points] rollbackDiscounts:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function getPointTransactionsForUser(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<PointTransaction[] | MypagePaginatedResult<PointTransaction>> {
  const limit = options ? resolveMypagePagination(options).pageSize : 50;
  const offset = options ? resolveMypagePagination(options).offset : 0;

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const all = mockTransactions.get(userId) ?? [];
      if (options) {
        return paginateArray(all, options);
      }
      return all;
    }
    return options ? buildMypagePaginatedResult([], 0, 1, limit) : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return options ? buildMypagePaginatedResult([], 0, 1, limit) : [];
  }

  const { data, error, count } = await supabase
    .from("point_transactions")
    .select("id, user_id, order_id, type, amount, reason, created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[points] getPointTransactionsForUser:", error.message);
    return options ? buildMypagePaginatedResult([], 0, 1, limit) : [];
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const items = rows.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    orderId: (row.order_id as string | null) ?? null,
    type: row.type as PointTransactionType,
    amount: row.amount as number,
    reason: (row.reason as string | null) ?? null,
    createdAt: row.created_at as string,
  }));

  if (options) {
    const { page, pageSize } = resolveMypagePagination(options);
    return buildMypagePaginatedResult(items, count ?? items.length, page, pageSize);
  }

  return items;
}
