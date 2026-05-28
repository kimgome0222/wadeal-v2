import {
  getRequiredProductReviewCheckKeys,
  isProductReviewCheckKey,
  PRODUCT_REVIEW_CHECK_KEYS,
  type ProductReviewCheckKey,
} from "@/lib/products/review-checklist";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProductReviewCheckRecord = {
  checkKey: ProductReviewCheckKey;
  checked: boolean;
  memo: string | null;
  checkedAt: string | null;
};

export type ProductReviewChecklistStatus = {
  checks: ProductReviewCheckRecord[];
  requiredKeys: ProductReviewCheckKey[];
  incompleteRequiredKeys: ProductReviewCheckKey[];
  isComplete: boolean;
};

function defaultChecks(): ProductReviewCheckRecord[] {
  return PRODUCT_REVIEW_CHECK_KEYS.map((checkKey) => ({
    checkKey,
    checked: false,
    memo: null,
    checkedAt: null,
  }));
}

export async function getProductReviewChecksForAdmin(
  productId: string,
): Promise<ProductReviewCheckRecord[]> {
  const defaults = defaultChecks();

  if (!isSupabaseConfigured()) {
    return defaults;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return defaults;
  }

  const { data, error } = await supabase
    .from("product_review_checklists")
    .select("check_key, checked, memo, checked_at")
    .eq("product_id", productId);

  if (error) {
    console.error("[product-review-checklist] getProductReviewChecksForAdmin:", error.message);
    return defaults;
  }

  const byKey = new Map<ProductReviewCheckKey, ProductReviewCheckRecord>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    const key = row.check_key as string;
    if (!isProductReviewCheckKey(key)) {
      continue;
    }
    byKey.set(key, {
      checkKey: key,
      checked: Boolean(row.checked),
      memo: (row.memo as string | null | undefined) ?? null,
      checkedAt: (row.checked_at as string | null | undefined) ?? null,
    });
  }

  return PRODUCT_REVIEW_CHECK_KEYS.map(
    (checkKey) =>
      byKey.get(checkKey) ?? {
        checkKey,
        checked: false,
        memo: null,
        checkedAt: null,
      },
  );
}

export async function getProductReviewChecklistStatus(
  productId: string,
): Promise<ProductReviewChecklistStatus> {
  const checks = await getProductReviewChecksForAdmin(productId);
  const requiredKeys = getRequiredProductReviewCheckKeys();
  const incompleteRequiredKeys = requiredKeys.filter(
    (key) => !checks.find((check) => check.checkKey === key)?.checked,
  );

  return {
    checks,
    requiredKeys,
    incompleteRequiredKeys,
    isComplete: incompleteRequiredKeys.length === 0,
  };
}

export async function upsertProductReviewChecksAdmin(
  productId: string,
  checks: Partial<Record<ProductReviewCheckKey, boolean>>,
  memos: Partial<Record<ProductReviewCheckKey, string>>,
  adminUserId: string,
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const now = new Date().toISOString();
  const rows = Object.entries(checks)
    .filter(([key]) => isProductReviewCheckKey(key))
    .map(([checkKey, checked]) => ({
      product_id: productId,
      check_key: checkKey,
      checked: Boolean(checked),
      memo: memos[checkKey as ProductReviewCheckKey]?.trim() || null,
      checked_by: adminUserId,
      checked_at: checked ? now : null,
    }));

  if (rows.length === 0) {
    return { success: true };
  }

  const { error } = await supabase.from("product_review_checklists").upsert(rows as never, {
    onConflict: "product_id,check_key",
  });

  if (error) {
    console.error("[product-review-checklist] upsertProductReviewChecksAdmin:", error.message);
    return { success: false };
  }

  return { success: true };
}
