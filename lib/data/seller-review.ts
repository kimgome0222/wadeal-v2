import {
  isSellerReviewCheckKey,
  SELLER_REVIEW_CHECK_KEYS,
  type SellerReviewCheckKey,
} from "@/lib/sellers/review-checklist";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SellerDocumentRecord = {
  id: string;
  sellerId: string;
  documentType: string;
  fileUrl: string;
  status: string;
  uploadedAt: string;
};

export type SellerReviewCheckRecord = {
  checkKey: SellerReviewCheckKey;
  checked: boolean;
  checkedAt: string | null;
};

function mapDocumentRow(row: Record<string, unknown>): SellerDocumentRecord {
  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    documentType: row.document_type as string,
    fileUrl: row.file_url as string,
    status: row.status as string,
    uploadedAt: row.uploaded_at as string,
  };
}

export async function getSellerDocumentsForAdmin(
  sellerId: string,
): Promise<SellerDocumentRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("seller_documents")
    .select("id, seller_id, document_type, file_url, status, uploaded_at")
    .eq("seller_id", sellerId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("[seller-review] getSellerDocumentsForAdmin:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapDocumentRow(row as Record<string, unknown>));
}

export async function getSellerReviewChecksForAdmin(
  sellerId: string,
): Promise<SellerReviewCheckRecord[]> {
  const defaults: SellerReviewCheckRecord[] = SELLER_REVIEW_CHECK_KEYS.map((checkKey) => ({
    checkKey,
    checked: false,
    checkedAt: null,
  }));

  if (!isSupabaseConfigured()) {
    return defaults;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return defaults;
  }

  const { data, error } = await supabase
    .from("seller_review_checks")
    .select("check_key, checked, checked_at")
    .eq("seller_id", sellerId);

  if (error) {
    console.error("[seller-review] getSellerReviewChecksForAdmin:", error.message);
    return defaults;
  }

  const byKey = new Map<SellerReviewCheckKey, SellerReviewCheckRecord>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    const key = row.check_key as string;
    if (!isSellerReviewCheckKey(key)) {
      continue;
    }
    byKey.set(key, {
      checkKey: key,
      checked: Boolean(row.checked),
      checkedAt: (row.checked_at as string | null | undefined) ?? null,
    });
  }

  return SELLER_REVIEW_CHECK_KEYS.map(
    (checkKey) =>
      byKey.get(checkKey) ?? {
        checkKey,
        checked: false,
        checkedAt: null,
      },
  );
}

export async function upsertSellerReviewChecksAdmin(
  sellerId: string,
  checks: Partial<Record<SellerReviewCheckKey, boolean>>,
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
  const rows: any[] = Object.entries(checks)
    .filter(([key]) => isSellerReviewCheckKey(key))
    .map(([checkKey, checked]) => ({
      seller_id: sellerId,
      check_key: checkKey,
      checked: Boolean(checked),
      checked_by: adminUserId,
      checked_at: checked ? now : null,
    }));

  if (rows.length === 0) {
    return { success: true };
  }

  const { error } = await supabase.from("seller_review_checks").upsert(rows as never, {
    onConflict: "seller_id,check_key",
  });

  if (error) {
    console.error("[seller-review] upsertSellerReviewChecksAdmin:", error.message);
    return { success: false };
  }

  return { success: true };
}
