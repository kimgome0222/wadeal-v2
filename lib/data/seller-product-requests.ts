import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SellerProductRequestStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "changes_requested";

export type SellerProductRequest = {
  id: string;
  sellerId: string;
  requestedBy: string;
  productName: string;
  categoryId: string | null;
  description: string | null;
  imageUrls: string[];
  originalPrice: number | null;
  groupPrice: number | null;
  targetParticipants: number | null;
  endsAt: string | null;
  status: SellerProductRequestStatus;
  rejectedReason: string | null;
  createdAt: string;
};

function mapRow(row: Record<string, unknown>): SellerProductRequest {
  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    requestedBy: row.requested_by as string,
    productName: row.product_name as string,
    categoryId: (row.category_id as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    imageUrls: (row.image_urls as string[] | null) ?? [],
    originalPrice: (row.original_price as number | null) ?? null,
    groupPrice: (row.group_price as number | null) ?? null,
    targetParticipants: (row.target_participants as number | null) ?? null,
    endsAt: (row.ends_at as string | null) ?? null,
    status: row.status as SellerProductRequestStatus,
    rejectedReason: (row.rejected_reason as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function getSellerProductRequests(
  sellerId: string,
): Promise<SellerProductRequest[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("seller_product_requests")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[seller-product-requests] list:", error.message);
    }
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function createSellerProductRequest(input: {
  sellerId: string;
  requestedBy: string;
  productName: string;
  categoryId?: string | null;
  description?: string | null;
  imageUrls?: string[];
  originalPrice?: number | null;
  groupPrice?: number | null;
  targetParticipants?: number | null;
  endsAt?: string | null;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase
    .from("seller_product_requests")
    .insert({
      seller_id: input.sellerId,
      requested_by: input.requestedBy,
      product_name: input.productName.trim(),
      category_id: input.categoryId ?? null,
      description: input.description?.trim() || null,
      image_urls: input.imageUrls ?? [],
      original_price: input.originalPrice ?? null,
      group_price: input.groupPrice ?? null,
      target_participants: input.targetParticipants ?? null,
      ends_at: input.endsAt ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[seller-product-requests] create:", error.message);
    return { success: false, error: isMissingTableError(error.message) ? "migration_required" : "save_failed" };
  }

  return { success: true, id: (data as { id: string }).id };
}

const STATUS_LABELS: Record<SellerProductRequestStatus, string> = {
  pending: "접수",
  under_review: "검수중",
  approved: "승인",
  rejected: "반려",
  changes_requested: "수정요청",
};

export function getSellerProductRequestStatusLabel(status: SellerProductRequestStatus): string {
  return STATUS_LABELS[status] ?? status;
}
