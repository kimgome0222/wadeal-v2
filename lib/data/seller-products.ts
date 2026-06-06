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

export type SellerProductEditDetail = {
  productId: string;
  dealId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  originalPrice: number;
  groupPrice: number;
  targetParticipants: number;
  endsAtInput: string;
  stockQuantity: number | null;
  approvalStatus: ProductApprovalStatus;
  dealStatus: DealStatus;
  canEditPricing: boolean;
};

const sellerProductEditSelect = `
  id,
  slug,
  name,
  image_url,
  description,
  original_price,
  stock_quantity,
  approval_status,
  group_buy_deals (
    id,
    group_price,
    target_participants,
    ends_at,
    status
  )
`;

function formatDateInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function getSellerProductEditDetail(
  sellerUserId: string,
  productId: string,
): Promise<SellerProductEditDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(sellerProductEditSelect)
    .eq("id", productId)
    .eq("created_by", sellerUserId)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[seller-products] getSellerProductEditDetail:", error.message);
    }
    return null;
  }

  const row = data as unknown as {
    id: string;
    slug: string;
    name: string;
    image_url: string | null;
    description: string | null;
    original_price: number;
    stock_quantity: number | null;
    approval_status: ProductApprovalStatus;
    group_buy_deals: Array<{
      id: string;
      group_price: number;
      target_participants: number;
      ends_at: string;
      status: DealStatus;
    }> | null;
  };

  const deal = row.group_buy_deals?.[0];
  if (!deal) {
    return null;
  }

  const canEditPricing =
    row.approval_status !== "approved" || deal.status !== "active";

  return {
    productId: row.id,
    dealId: deal.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url,
    description: row.description,
    originalPrice: row.original_price,
    groupPrice: deal.group_price,
    targetParticipants: deal.target_participants,
    endsAtInput: formatDateInput(deal.ends_at),
    stockQuantity: row.stock_quantity,
    approvalStatus: row.approval_status,
    dealStatus: deal.status,
    canEditPricing,
  };
}

export type UpdateSellerProductInput = {
  sellerUserId: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  originalPrice: number;
  groupPrice: number;
  targetParticipants: number;
  endsAt: string | null;
  stockQuantity: number | null;
};

export async function updateSellerProduct(
  input: UpdateSellerProductInput,
): Promise<{ success: boolean; error?: "not_found" | "locked" | "invalid_input" | "save_failed" }> {
  if (!input.name.trim()) {
    return { success: false, error: "invalid_input" };
  }

  if (input.groupPrice <= 0 || input.originalPrice <= 0 || input.targetParticipants <= 0) {
    return { success: false, error: "invalid_input" };
  }

  const existing = await getSellerProductEditDetail(input.sellerUserId, input.productId);
  if (!existing) {
    return { success: false, error: "not_found" };
  }

  const pricingChanged =
    existing.originalPrice !== input.originalPrice ||
    existing.groupPrice !== input.groupPrice ||
    existing.targetParticipants !== input.targetParticipants;

  const stockChanged =
    existing.stockQuantity !== input.stockQuantity &&
    input.stockQuantity !== null;

  if (!existing.canEditPricing && (pricingChanged || stockChanged)) {
    return { success: false, error: "locked" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      image_url: input.imageUrl?.trim() || null,
      description: input.description?.trim() || null,
      original_price: input.originalPrice,
      stock_quantity: input.stockQuantity,
    })
    .eq("id", input.productId)
    .eq("created_by", input.sellerUserId);

  if (productError) {
    console.error("[seller-products] updateSellerProduct product:", productError.message);
    return { success: false, error: "save_failed" };
  }

  const dealPayload: {
    group_price: number;
    target_participants: number;
    ends_at?: string;
  } = {
    group_price: input.groupPrice,
    target_participants: input.targetParticipants,
  };

  if (input.endsAt) {
    dealPayload.ends_at = input.endsAt;
  }

  const { error: dealError } = await supabase
    .from("group_buy_deals")
    .update(dealPayload)
    .eq("id", existing.dealId);

  if (dealError) {
    console.error("[seller-products] updateSellerProduct deal:", dealError.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}
