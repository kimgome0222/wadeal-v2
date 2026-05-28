import type { CategorySlug } from "@/lib/categories";
import {
  computeDiscountRate,
  mapAdminStatusToDeal,
  mapDealStatusToAdmin,
  type AdminProductDetail,
  type AdminProductFormInput,
  type AdminProductListItem,
  type AdminProductStatus,
} from "@/lib/admin-products/shared";
import type { DealStatus } from "@/lib/types";
import type { ShippingType } from "@/lib/shipping/types";
import { DEFAULT_SHIPPING } from "@/lib/data/product-shipping";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  resolveApprovalStatusFromIntent,
  type ProductApprovalFilter,
  type ProductApprovalStatus,
} from "@/lib/products/approval-status";
import {
  buildFallbackPriceTiers,
  normalizePriceTierEntries,
  parsePriceTiersJson,
  type PriceTierEntry,
} from "@/lib/pricing/tiers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type {
  AdminProductDetail,
  AdminProductFormInput,
  AdminProductListItem,
  AdminProductStatus,
} from "@/lib/admin-products/shared";

export {
  adminProductStatusLabel,
  computeDiscountRate,
  formatAdminProductDeadline,
  formatDetailImageUrls,
  formatEndsAtForInput,
} from "@/lib/admin-products/shared";

export type AdminProductMutationResult = {
  success: boolean;
  productId?: string;
  error?:
    | "forbidden"
    | "invalid_input"
    | "slug_taken"
    | "not_found"
    | "save_failed";
};

const DEFAULT_CATEGORY = "food";
const DEFAULT_SECTION = "main";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[admin-products] using mock fallback: ${context}`);
  }
}

function computeLowestPrice(originalPrice: number, groupPrice: number): number {
  const gap = Math.max(0, originalPrice - groupPrice);
  return Math.max(0, groupPrice - Math.round(gap * 0.2));
}

function parseDetailImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateFormInput(input: AdminProductFormInput): boolean {
  if (!input.name.trim() || !input.slug.trim()) {
    return false;
  }

  if (
    !Number.isFinite(input.groupPrice) ||
    input.groupPrice < 0 ||
    !Number.isFinite(input.originalPrice) ||
    input.originalPrice <= 0
  ) {
    return false;
  }

  if (
    !Number.isFinite(input.targetParticipants) ||
    input.targetParticipants <= 0 ||
    !Number.isFinite(input.currentParticipants) ||
    input.currentParticipants < 0
  ) {
    return false;
  }

  if (!input.endsAt || Number.isNaN(new Date(input.endsAt).getTime())) {
    return false;
  }

  return true;
}

function defaultPriceTiersForForm(
  originalPrice: number,
  groupPrice: number,
  targetParticipants: number,
): PriceTierEntry[] {
  const lowestPrice = computeLowestPrice(originalPrice, groupPrice);
  return buildFallbackPriceTiers({
    originalPrice,
    groupPrice,
    lowestPrice,
    targetParticipants,
  });
}

function resolveFormPriceTiers(input: AdminProductFormInput): PriceTierEntry[] {
  const tiers =
    input.priceTiers.length > 0 ? input.priceTiers : defaultPriceTiersForForm(
      input.originalPrice,
      input.groupPrice,
      input.targetParticipants,
    );

  if (
    tiers.some(
      (tier) =>
        !Number.isFinite(tier.minQty) ||
        tier.minQty <= 0 ||
        !Number.isFinite(tier.price) ||
        tier.price < 0,
    )
  ) {
    return defaultPriceTiersForForm(
      input.originalPrice,
      input.groupPrice,
      input.targetParticipants,
    );
  }

  return normalizePriceTierEntries(tiers);
}

function toListItem(row: {
  product: {
    id: string;
    slug: string;
    name: string;
    image_url: string | null;
    original_price: number;
    approval_status: ProductApprovalStatus;
    rejected_reason: string | null;
    approved_at: string | null;
    created_by: string | null;
    stock_quantity: number | null;
    min_order_quantity: number | null;
    max_order_quantity: number | null;
    per_user_limit: number | null;
  };
  deal: {
    id: string;
    group_price: number;
    current_participants: number;
    target_participants: number;
    max_quantity: number | null;
    ends_at: string;
    status: DealStatus;
  };
}): AdminProductListItem {
  return {
    productId: row.product.id,
    dealId: row.deal.id,
    name: row.product.name,
    slug: row.product.slug,
    groupPrice: row.deal.group_price,
    originalPrice: row.product.original_price,
    discountRate: computeDiscountRate(row.product.original_price, row.deal.group_price),
    currentParticipants: row.deal.current_participants,
    targetParticipants: row.deal.target_participants,
    endsAt: row.deal.ends_at,
    status: mapDealStatusToAdmin(row.deal.status),
    approvalStatus: row.product.approval_status,
    rejectedReason: row.product.rejected_reason,
    approvedAt: row.product.approved_at,
    createdBy: row.product.created_by,
    imageUrl: row.product.image_url,
    stockQuantity: row.product.stock_quantity ?? null,
    minOrderQuantity: row.product.min_order_quantity ?? 1,
    maxOrderQuantity: row.product.max_order_quantity ?? 99,
    perUserLimit: row.product.per_user_limit ?? null,
    maxQuantity: row.deal.max_quantity ?? null,
  };
}

type MockProductRecord = AdminProductDetail & {
  category: string;
  categoryTags: CategorySlug[];
  approvalStatus: ProductApprovalStatus;
  rejectedReason: string | null;
  approvedAt: string | null;
  createdBy: string | null;
};

const mockProducts = new Map<string, MockProductRecord>();

function seedMockProducts() {
  if (mockProducts.size > 0) {
    return;
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  mockProducts.set("mock-product-1", {
    productId: "mock-product-1",
    dealId: "mock-deal-1",
    name: "제주 고당도 감귤 3kg",
    slug: "wd-citrus-001",
    groupPrice: 12900,
    originalPrice: 22900,
    discountRate: computeDiscountRate(22900, 12900),
    currentParticipants: 118,
    targetParticipants: 120,
    endsAt,
    status: "active",
    approvalStatus: "approved",
    rejectedReason: null,
    approvedAt: endsAt,
    createdBy: null,
    imageUrl:
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
    detailImageUrls: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=960&q=80",
    ],
    priceTiers: defaultPriceTiersForForm(22900, 12900, 120),
    stockQuantity: null,
    minOrderQuantity: 1,
    maxOrderQuantity: 99,
    perUserLimit: null,
    maxQuantity: null,
    shippingFee: DEFAULT_SHIPPING.shippingFee,
    freeShippingThreshold: DEFAULT_SHIPPING.freeShippingThreshold,
    shippingType: DEFAULT_SHIPPING.shippingType,
    isFreeShipping: DEFAULT_SHIPPING.isFreeShipping,
    remoteAreaExtraFee: DEFAULT_SHIPPING.remoteAreaExtraFee,
    category: DEFAULT_CATEGORY,
    categoryTags: ["all", "food"],
  });
}

function getMockProducts(filter: ProductApprovalFilter = "all"): AdminProductListItem[] {
  seedMockProducts();
  const items = Array.from(mockProducts.values()).map((item) => ({
    productId: item.productId,
    dealId: item.dealId,
    name: item.name,
    slug: item.slug,
    groupPrice: item.groupPrice,
    originalPrice: item.originalPrice,
    discountRate: item.discountRate,
    currentParticipants: item.currentParticipants,
    targetParticipants: item.targetParticipants,
    endsAt: item.endsAt,
    status: item.status,
    approvalStatus: item.approvalStatus,
    rejectedReason: item.rejectedReason,
    approvedAt: item.approvedAt,
    createdBy: item.createdBy,
    imageUrl: item.imageUrl,
    stockQuantity: item.stockQuantity ?? null,
    minOrderQuantity: item.minOrderQuantity ?? 1,
    maxOrderQuantity: item.maxOrderQuantity ?? 99,
    perUserLimit: item.perUserLimit ?? null,
    maxQuantity: item.maxQuantity ?? null,
  }));

  if (filter === "all") {
    return items;
  }

  return items.filter((item) => item.approvalStatus === filter);
}

function getMockProductById(productId: string): AdminProductDetail | null {
  seedMockProducts();
  return mockProducts.get(productId) ?? null;
}

function saveMockProduct(
  input: AdminProductFormInput,
  existing?: AdminProductDetail,
): AdminProductMutationResult {
  seedMockProducts();

  const slugTaken = Array.from(mockProducts.values()).some(
    (item) => item.slug === input.slug.trim() && item.productId !== existing?.productId,
  );

  if (slugTaken) {
    return { success: false, error: "slug_taken" };
  }

  const productId = existing?.productId ?? `mock-product-${Date.now()}`;
  const dealId = existing?.dealId ?? `mock-deal-${Date.now()}`;
  const discountRate = computeDiscountRate(input.originalPrice, input.groupPrice);
  const mockExisting = existing as MockProductRecord | undefined;

  mockProducts.set(productId, {
    productId,
    dealId,
    name: input.name.trim(),
    slug: input.slug.trim(),
    groupPrice: input.groupPrice,
    originalPrice: input.originalPrice,
    discountRate,
    currentParticipants: input.currentParticipants,
    targetParticipants: input.targetParticipants,
    endsAt: new Date(input.endsAt).toISOString(),
    status: input.status,
    approvalStatus: resolveApprovalStatusFromIntent(input.submitIntent),
    rejectedReason:
      input.submitIntent === "submit_review" ? null : mockExisting?.rejectedReason ?? null,
    approvedAt: mockExisting?.approvedAt ?? null,
    createdBy: mockExisting?.createdBy ?? null,
    imageUrl: input.imageUrl.trim() || null,
    detailImageUrls: input.detailImageUrls,
    priceTiers: resolveFormPriceTiers(input),
    stockQuantity: input.stockQuantity,
    minOrderQuantity: input.minOrderQuantity,
    maxOrderQuantity: input.maxOrderQuantity,
    perUserLimit: input.perUserLimit,
    maxQuantity: input.maxQuantity,
    shippingFee: input.shippingFee,
    freeShippingThreshold: input.freeShippingThreshold,
    shippingType: input.shippingType,
    isFreeShipping: input.isFreeShipping,
    remoteAreaExtraFee: input.remoteAreaExtraFee,
    category: mockExisting?.category ?? DEFAULT_CATEGORY,
    categoryTags: mockExisting?.categoryTags ?? (["all", DEFAULT_CATEGORY] as CategorySlug[]),
  });

  return { success: true, productId };
}

const adminProductSelect = `
  id,
  slug,
  name,
  image_url,
  detail_image_urls,
  original_price,
  approval_status,
  rejected_reason,
  approved_at,
  created_by,
  stock_quantity,
  min_order_quantity,
  max_order_quantity,
  per_user_limit,
  shipping_fee,
  free_shipping_threshold,
  shipping_type,
  is_free_shipping,
  remote_area_extra_fee,
  group_buy_deals (
    id,
    group_price,
    current_participants,
    target_participants,
    max_quantity,
    ends_at,
    status,
    price_tiers
  )
`;

async function syncDealPriceTiers(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  dealId: string,
  tiers: PriceTierEntry[],
) {
  const normalized = normalizePriceTierEntries(tiers);
  const jsonPayload = normalized.map((tier) => ({
    minQty: tier.minQty,
    price: tier.price,
  }));

  const { error: dealError } = await supabase
    .from("group_buy_deals")
    .update({ price_tiers: jsonPayload })
    .eq("id", dealId);

  if (dealError) {
    console.error("[admin-products] syncDealPriceTiers json:", dealError.message);
  }

  await supabase.from("price_tiers").delete().eq("deal_id", dealId);

  const rows = normalized.map((tier, index) => ({
    deal_id: dealId,
    required_participants: tier.minQty,
    price: tier.price,
    tier_order: index + 1,
  }));

  const { error } = await supabase.from("price_tiers").insert(rows);

  if (error) {
    console.error("[admin-products] syncDealPriceTiers rows:", error.message);
  }
}

export async function getAdminProducts(
  approvalFilter: ProductApprovalFilter = "all",
): Promise<AdminProductListItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAdminProducts");
    return shouldUseMockData() ? getMockProducts(approvalFilter) : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("getAdminProducts: no client");
    return shouldUseMockData() ? getMockProducts(approvalFilter) : [];
  }

  let query = supabase
    .from("products")
    .select(adminProductSelect)
    .order("created_at", { ascending: false });

  if (approvalFilter !== "all") {
    query = query.eq("approval_status", approvalFilter);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[admin-products] getAdminProducts:", error?.message);
    logMockFallback("getAdminProducts: query failed");
    return shouldUseMockData() ? getMockProducts(approvalFilter) : [];
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
    created_by: string | null;
    group_buy_deals: Array<{
      id: string;
      group_price: number;
      current_participants: number;
      target_participants: number;
      ends_at: string;
      status: DealStatus;
      price_tiers: unknown;
    }> | null;
  }>)
    .flatMap((product) => {
      const deal = product.group_buy_deals?.[0];
      if (!deal) {
        return [];
      }

      return [
        toListItem({
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image_url: product.image_url,
            original_price: product.original_price,
            approval_status: product.approval_status,
            rejected_reason: product.rejected_reason,
            approved_at: product.approved_at,
            created_by: product.created_by,
            stock_quantity: product.stock_quantity,
            min_order_quantity: product.min_order_quantity,
            max_order_quantity: product.max_order_quantity,
            per_user_limit: product.per_user_limit,
          },
          deal,
        }),
      ];
    });
}

export async function getAdminProductById(
  productId: string,
): Promise<AdminProductDetail | null> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAdminProductById");
    return shouldUseMockData() ? getMockProductById(productId) : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? getMockProductById(productId) : null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(adminProductSelect)
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) {
    console.error("[admin-products] getAdminProductById:", error?.message);
    return shouldUseMockData() ? getMockProductById(productId) : null;
  }

  const row = data as unknown as {
    id: string;
    slug: string;
    name: string;
    image_url: string | null;
    detail_image_urls: string[] | null;
    original_price: number;
    approval_status: ProductApprovalStatus;
    rejected_reason: string | null;
    approved_at: string | null;
    created_by: string | null;
    group_buy_deals: Array<{
      id: string;
      group_price: number;
      current_participants: number;
      target_participants: number;
      ends_at: string;
      status: DealStatus;
      price_tiers: unknown;
    }> | null;
  };

  const deal = row.group_buy_deals?.[0];
  if (!deal) {
    return null;
  }

  return {
    ...toListItem({
      product: {
        id: row.id,
        slug: row.slug,
        name: row.name,
        image_url: row.image_url,
        original_price: row.original_price,
        approval_status: row.approval_status,
        rejected_reason: row.rejected_reason,
        approved_at: row.approved_at,
        created_by: row.created_by,
      },
      deal,
    }),
    detailImageUrls: row.detail_image_urls ?? [],
    priceTiers:
      parsePriceTiersJson(deal.price_tiers).length > 0
        ? parsePriceTiersJson(deal.price_tiers)
        : defaultPriceTiersForForm(
            row.original_price,
            deal.group_price,
            deal.target_participants,
          ),
    ...mapProductShippingFields(row as Record<string, unknown>),
  };
}

function resolveProductFieldsOnSave(
  input: AdminProductFormInput,
  existing?: AdminProductDetail,
): {
  approvalStatus: ProductApprovalStatus;
  rejectedReason: string | null;
  isActive: boolean;
} {
  const approvalStatus = resolveApprovalStatusFromIntent(input.submitIntent);
  const rejectedReason =
    input.submitIntent === "submit_review" ? null : (existing?.rejectedReason ?? null);
  const isActive = approvalStatus === "approved" && input.status === "active";

  return { approvalStatus, rejectedReason, isActive };
}

export async function createAdminProduct(
  input: AdminProductFormInput,
  actorUserId?: string | null,
): Promise<AdminProductMutationResult> {
  if (!validateFormInput(input)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { success: false, error: "save_failed" };
    }

    return saveMockProduct(input);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const slug = input.slug.trim();
  const lowestPrice = computeLowestPrice(input.originalPrice, input.groupPrice);
  const dealStatus = mapAdminStatusToDeal(input.status);
  const priceTiers = resolveFormPriceTiers(input);
  const categoryTags: CategorySlug[] = ["all", DEFAULT_CATEGORY];
  const { approvalStatus, rejectedReason, isActive } = resolveProductFieldsOnSave(input);

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      slug,
      name: input.name.trim(),
      category: DEFAULT_CATEGORY,
      category_id: null,
      category_tags: categoryTags,
      brand_name: null,
      keywords: [],
      image_url: input.imageUrl.trim() || null,
      detail_image_urls: input.detailImageUrls,
      original_price: input.originalPrice,
      legacy_id: null,
      description: null,
      is_active: isActive,
      supplier_id: null,
      created_by: actorUserId ?? null,
      approval_status: approvalStatus,
      rejected_reason: rejectedReason,
      product_type: "groupbuy",
      stock_quantity: input.stockQuantity,
      min_order_quantity: input.minOrderQuantity,
      max_order_quantity: input.maxOrderQuantity,
      per_user_limit: input.perUserLimit,
      ...productShippingDbPayload(input),
    })
    .select("id")
    .single();

  if (productError || !product) {
    if (productError?.code === "23505") {
      return { success: false, error: "slug_taken" };
    }

    console.error("[admin-products] createAdminProduct product:", productError?.message);
    return { success: false, error: "save_failed" };
  }

  const productId = (product as { id: string }).id;

  const { data: deal, error: dealError } = await supabase
    .from("group_buy_deals")
    .insert({
      product_id: productId,
      title: input.name.trim(),
      section: DEFAULT_SECTION,
      current_participants: input.currentParticipants,
      target_participants: input.targetParticipants,
      group_price: input.groupPrice,
      lowest_price: lowestPrice,
      price_tiers: priceTiers.map((tier) => ({
        minQty: tier.minQty,
        price: tier.price,
      })),
      badge: null,
      starts_at: null,
      ends_at: new Date(input.endsAt).toISOString(),
      status: dealStatus,
      target_quantity: input.targetParticipants,
      max_quantity: input.maxQuantity,
    })
    .select("id")
    .single();

  if (dealError || !deal) {
    console.error("[admin-products] createAdminProduct deal:", dealError?.message);
    await supabase.from("products").delete().eq("id", productId);
    return { success: false, error: "save_failed" };
  }

  await syncDealPriceTiers(supabase, (deal as { id: string }).id, priceTiers);

  return { success: true, productId };
}

export async function updateAdminProduct(
  productId: string,
  input: AdminProductFormInput,
): Promise<AdminProductMutationResult> {
  if (!validateFormInput(input)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { success: false, error: "save_failed" };
    }

    const existing = getMockProductById(productId);
    if (!existing) {
      return { success: false, error: "not_found" };
    }

    return saveMockProduct(input, existing);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const existing = await getAdminProductById(productId);
  if (!existing) {
    return { success: false, error: "not_found" };
  }

  const slug = input.slug.trim();
  const lowestPrice = computeLowestPrice(input.originalPrice, input.groupPrice);
  const dealStatus = mapAdminStatusToDeal(input.status);
  const priceTiers = resolveFormPriceTiers(input);
  const { approvalStatus, rejectedReason, isActive } = resolveProductFieldsOnSave(
    input,
    existing,
  );

  const { error: productError } = await supabase
    .from("products")
    .update({
      slug,
      name: input.name.trim(),
      image_url: input.imageUrl.trim() || null,
      detail_image_urls: input.detailImageUrls,
      original_price: input.originalPrice,
      is_active: isActive,
      approval_status: approvalStatus,
      rejected_reason: rejectedReason,
      stock_quantity: input.stockQuantity,
      min_order_quantity: input.minOrderQuantity,
      max_order_quantity: input.maxOrderQuantity,
      per_user_limit: input.perUserLimit,
      ...productShippingDbPayload(input),
      ...(approvalStatus !== "approved"
        ? { approved_at: null, approved_by: null }
        : {}),
    })
    .eq("id", productId);

  if (productError) {
    if (productError.code === "23505") {
      return { success: false, error: "slug_taken" };
    }

    console.error("[admin-products] updateAdminProduct product:", productError.message);
    return { success: false, error: "save_failed" };
  }

  const { error: dealError } = await supabase
    .from("group_buy_deals")
    .update({
      title: input.name.trim(),
      current_participants: input.currentParticipants,
      target_participants: input.targetParticipants,
      group_price: input.groupPrice,
      lowest_price: lowestPrice,
      price_tiers: priceTiers.map((tier) => ({
        minQty: tier.minQty,
        price: tier.price,
      })),
      ends_at: new Date(input.endsAt).toISOString(),
      status: dealStatus,
      target_quantity: input.targetParticipants,
      max_quantity: input.maxQuantity,
    })
    .eq("id", existing.dealId);

  if (dealError) {
    console.error("[admin-products] updateAdminProduct deal:", dealError.message);
    return { success: false, error: "save_failed" };
  }

  await syncDealPriceTiers(supabase, existing.dealId, priceTiers);

  return { success: true, productId };
}

function normalizeShippingType(value: string | undefined): ShippingType {
  if (value === "free" || value === "conditional_free" || value === "paid") {
    return value;
  }
  return "paid";
}

function productShippingDbPayload(input: AdminProductFormInput) {
  const shippingType =
    input.isFreeShipping ? "free" : normalizeShippingType(input.shippingType);

  return {
    shipping_fee: input.isFreeShipping ? 0 : Math.max(0, Math.round(input.shippingFee)),
    free_shipping_threshold:
      shippingType === "conditional_free" && input.freeShippingThreshold != null
        ? Math.max(0, Math.round(input.freeShippingThreshold))
        : null,
    shipping_type: shippingType,
    is_free_shipping: input.isFreeShipping,
    remote_area_extra_fee: Math.max(0, Math.round(input.remoteAreaExtraFee)),
  };
}

function mapProductShippingFields(row: Record<string, unknown>) {
  return {
    shippingFee: Math.max(0, Math.round((row.shipping_fee as number) ?? DEFAULT_SHIPPING.shippingFee)),
    freeShippingThreshold:
      row.free_shipping_threshold == null
        ? null
        : Math.max(0, Math.round(row.free_shipping_threshold as number)),
    shippingType: normalizeShippingType(row.shipping_type as string | undefined),
    isFreeShipping: Boolean(row.is_free_shipping),
    remoteAreaExtraFee: Math.max(
      0,
      Math.round((row.remote_area_extra_fee as number) ?? DEFAULT_SHIPPING.remoteAreaExtraFee),
    ),
  };
}

function parseOptionalInt(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === "") {
    return null;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? Math.round(value) : null;
}

export function parseAdminProductForm(raw: {
  name: string;
  slug: string;
  groupPrice: string;
  originalPrice: string;
  imageUrl: string;
  detailImageUrls: string;
  targetParticipants: string;
  currentParticipants: string;
  endsAt: string;
  status: string;
  priceTiers?: string;
  submitIntent: string;
  stockQuantity?: string;
  minOrderQuantity?: string;
  maxOrderQuantity?: string;
  perUserLimit?: string;
  maxQuantity?: string;
  shippingFee?: string;
  freeShippingThreshold?: string;
  shippingType?: string;
  isFreeShipping?: string;
  remoteAreaExtraFee?: string;
}): AdminProductFormInput {
  let parsedTiers: PriceTierEntry[] = [];

  if (raw.priceTiers) {
    try {
      parsedTiers = parsePriceTiersJson(JSON.parse(raw.priceTiers));
    } catch {
      parsedTiers = [];
    }
  }

  return {
    name: raw.name,
    slug: raw.slug,
    groupPrice: Number(raw.groupPrice),
    originalPrice: Number(raw.originalPrice),
    imageUrl: raw.imageUrl,
    detailImageUrls: parseDetailImageUrls(raw.detailImageUrls),
    targetParticipants: Number(raw.targetParticipants),
    currentParticipants: Number(raw.currentParticipants),
    endsAt: raw.endsAt,
    status: raw.status as AdminProductStatus,
    priceTiers: parsedTiers,
    submitIntent:
      raw.submitIntent === "submit_review" ? "submit_review" : "save_draft",
    stockQuantity: parseOptionalInt(raw.stockQuantity),
    minOrderQuantity: parseOptionalInt(raw.minOrderQuantity) ?? 1,
    maxOrderQuantity: parseOptionalInt(raw.maxOrderQuantity) ?? 99,
    perUserLimit: parseOptionalInt(raw.perUserLimit),
    maxQuantity: parseOptionalInt(raw.maxQuantity),
    shippingFee: Number(raw.shippingFee ?? DEFAULT_SHIPPING.shippingFee),
    freeShippingThreshold: parseOptionalInt(raw.freeShippingThreshold),
    shippingType: normalizeShippingType(raw.shippingType),
    isFreeShipping: raw.isFreeShipping === "true" || raw.isFreeShipping === "on",
    remoteAreaExtraFee: Number(raw.remoteAreaExtraFee ?? DEFAULT_SHIPPING.remoteAreaExtraFee),
  };
}
