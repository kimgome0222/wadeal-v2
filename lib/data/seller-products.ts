import {
  computeDiscountRate,
  formatAdminProductDeadline,
  mapDealStatusToAdmin,
} from "@/lib/admin-products/shared";
import type { ProductApprovalStatus } from "@/lib/products/approval-status";
import type { DealStatus } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SellerProductListItem = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  groupPrice: number;
  originalPrice: number;
  discountRate: number;
  currentParticipants: number;
  targetParticipants: number;
  endsAt: string;
  dealStatus: ReturnType<typeof mapDealStatusToAdmin>;
  approvalStatus: ProductApprovalStatus;
  rejectedReason: string | null;
  approvedAt: string | null;
};

const sellerProductSelect = `
  id,
  slug,
  name,
  image_url,
  original_price,
  approval_status,
  rejected_reason,
  approved_at,
  group_buy_deals (
    id,
    group_price,
    current_participants,
    target_participants,
    ends_at,
    status
  )
`;

export async function getSellerProducts(
  sellerUserId: string,
): Promise<SellerProductListItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(sellerProductSelect)
    .eq("created_by", sellerUserId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[seller-products] getSellerProducts:", error?.message);
    return [];
  }

  return (data as unknown as Array<{
    id: string;
    slug: string;
    name: string;
    image_url: string | null;
    original_price: number;
    approval_status: ProductApprovalStatus;
    rejected_reason: string | null;
    approved_at: string | null;
    group_buy_deals: Array<{
      group_price: number;
      current_participants: number;
      target_participants: number;
      ends_at: string;
      status: DealStatus;
    }> | null;
  }>).flatMap((product) => {
    const deal = product.group_buy_deals?.[0];
    if (!deal) {
      return [];
    }

    return [
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.image_url,
        groupPrice: deal.group_price,
        originalPrice: product.original_price,
        discountRate: computeDiscountRate(product.original_price, deal.group_price),
        currentParticipants: deal.current_participants,
        targetParticipants: deal.target_participants,
        endsAt: deal.ends_at,
        dealStatus: mapDealStatusToAdmin(deal.status),
        approvalStatus: product.approval_status,
        rejectedReason: product.rejected_reason,
        approvedAt: product.approved_at,
      },
    ];
  });
}

export async function getSellerProductById(
  sellerUserId: string,
  productId: string,
): Promise<SellerProductListItem | null> {
  const products = await getSellerProducts(sellerUserId);
  return products.find((product) => product.productId === productId) ?? null;
}
