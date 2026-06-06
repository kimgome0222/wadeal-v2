import { shouldUseMockData } from "@/lib/env/runtime";
import type { PriceAlertCardItem } from "@/components/price-alert-card";
import type { CreateUserAlertInput } from "@/lib/database/types";
import {
  buildMypagePaginatedResult,
  paginateArray,
  resolveMypagePagination,
  type MypagePaginatedResult,
  type MypagePaginationOptions,
} from "@/lib/pagination/mypage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[alerts] using mock fallback: ${context}`);
  }
}

export type UserAlertRow = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  current_price: number;
  target_price: number;
  created_at: string;
  updated_at: string;
};

export type CreateUserAlertResult = {
  success: boolean;
  id?: string;
  error?: "login_required" | "invalid_target_price" | "product_not_found" | "save_failed";
};

const mockAlertItems: PriceAlertCardItem[] = [
  {
    id: "mock-alert-1",
    dealSlug: "wd-citrus-001",
    productName: "제주 고당도 감귤 3kg",
    currentPrice: 12900,
    targetPrice: 10900,
    status: "알림 대기중",
  },
];

async function getProductUuidBySlug(slug: string): Promise<string | undefined> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const numericId = Number(slug);
  const isNumeric = Number.isInteger(numericId) && numericId > 0;

  let query = supabase.from("products").select("id, slug");

  query =
    isNumeric ?
      query.eq("legacy_id", numericId)
    : query.eq("slug", slug);

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    console.error("[data] getProductUuidBySlug:", error?.message);
    return undefined;
  }

  return (data as { id: string }).id;
}

async function getProductSlugById(productId: string): Promise<string> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return productId;
  }

  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) {
    return productId;
  }

  return (data as { slug: string }).slug;
}

export async function getAlertsForUser(userId: string): Promise<PriceAlertCardItem[]>;
export async function getAlertsForUser(
  userId: string,
  options: MypagePaginationOptions,
): Promise<MypagePaginatedResult<PriceAlertCardItem>>;
export async function getAlertsForUser(
  userId: string,
  options?: MypagePaginationOptions,
): Promise<PriceAlertCardItem[] | MypagePaginatedResult<PriceAlertCardItem>> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAlertsForUser: Supabase is not configured");
    const items = shouldUseMockData() ? mockAlertItems : [];
    if (options) {
      return paginateArray(items, options);
    }
    return items;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getAlertsForUser: failed to create Supabase client");
    const items = shouldUseMockData() ? mockAlertItems : [];
    if (options) {
      return paginateArray(items, options);
    }
    return items;
  }

  let query = supabase
    .from("alerts")
    .select("id, product_id, product_name, current_price, target_price, created_at", options ? { count: "exact" } : undefined)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options) {
    const { pageSize, offset } = resolveMypagePagination(options);
    query = query.range(offset, offset + pageSize - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[data] getAlertsForUser:", error.message);
    logMockFallback("getAlertsForUser: query error");
    const items = shouldUseMockData() ? mockAlertItems : [];
    if (options) {
      return paginateArray(items, options);
    }
    return items;
  }

  const rows = data ?? [];
  if (rows.length === 0) {
    logMockFallback("getAlertsForUser: empty result");
    const items = shouldUseMockData() ? mockAlertItems : [];
    if (options) {
      return paginateArray(items, options);
    }
    return items;
  }

  const items = await Promise.all(
    rows.map(async (row) => ({
      id: row.id as string,
      dealSlug: await getProductSlugById(row.product_id as string),
      productName: row.product_name as string,
      currentPrice: row.current_price as number,
      targetPrice: row.target_price as number,
      status: "알림 대기중",
    })),
  );

  if (options) {
    const { page, pageSize } = resolveMypagePagination(options);
    return buildMypagePaginatedResult(items, count ?? items.length, page, pageSize);
  }

  return items;
}

export async function createUserAlert(
  userId: string,
  input: CreateUserAlertInput,
): Promise<CreateUserAlertResult> {
  if (!Number.isFinite(input.targetPrice) || input.targetPrice <= 0) {
    return { success: false, error: "invalid_target_price" };
  }

  if (!Number.isFinite(input.currentPrice) || input.currentPrice < 0) {
    return { success: false, error: "save_failed" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-alert" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("createUserAlert: failed to create Supabase client");
    return { success: true, id: "mock-alert" };
  }

  const productId = await getProductUuidBySlug(input.productSlug);
  if (!productId) {
    console.error(
      "[data] createUserAlert: product not found for slug",
      input.productSlug,
    );
    logMockFallback("createUserAlert: product not found");
    return { success: true, id: "mock-alert" };
  }

  // TODO(kakao): 목표가 도달 시 alerts row 기준으로 카카오톡 메시지 API(알림톡/비즈메시지) 발송
  const { data, error } = await supabase
    .from("alerts")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        product_name: input.productName,
        current_price: Math.round(input.currentPrice),
        target_price: Math.round(input.targetPrice),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" },
    )
    .select("id")
    .single();

  if (error) {
    console.error("[data] createUserAlert:", error.message);
    logMockFallback("createUserAlert: insert failed");
    return { success: true, id: "mock-alert" };
  }

  return { success: true, id: (data as { id: string }).id };
}
