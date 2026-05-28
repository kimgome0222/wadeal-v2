import { isGroupBuyProduct, isNormalProduct, type ProductType } from "@/lib/products/product-type";

export type ProductInventory = {
  productType: ProductType;
  stockQuantity: number | null;
  soldQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  perUserLimit: number | null;
  isSoldOut: boolean;
  soldOutAt: string | null;
  targetQuantity: number | null;
  currentQuantity: number;
  maxQuantity: number | null;
};

export type InventoryValidationError =
  | "sold_out"
  | "insufficient_stock"
  | "insufficient_capacity"
  | "quantity_out_of_range"
  | "per_user_limit_exceeded"
  | "invalid_quantity";

export type InventoryValidationResult =
  | { ok: true }
  | {
      ok: false;
      error: InventoryValidationError;
      message: string;
      min?: number;
      max?: number;
      remaining?: number;
      limit?: number;
      existing?: number;
    };

export function getGroupBuyCapacityCap(inventory: ProductInventory): number | null {
  return inventory.maxQuantity ?? inventory.targetQuantity;
}

export function getRemainingStock(inventory: ProductInventory): number | null {
  if (isNormalProduct(inventory.productType)) {
    if (inventory.stockQuantity == null) {
      return null;
    }

    return Math.max(0, inventory.stockQuantity - inventory.soldQuantity);
  }

  const cap = getGroupBuyCapacityCap(inventory);
  if (cap == null) {
    return null;
  }

  return Math.max(0, cap - inventory.currentQuantity);
}

export function isSoldOut(inventory: ProductInventory): boolean {
  if (inventory.isSoldOut) {
    return true;
  }

  const remaining = getRemainingStock(inventory);
  return remaining != null && remaining <= 0;
}

export function validateOrderQuantity(
  inventory: ProductInventory,
  quantity: number,
  userExistingQty = 0,
): InventoryValidationResult {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return {
      ok: false,
      error: "invalid_quantity",
      message: "주문 수량이 올바르지 않아요.",
    };
  }

  const rounded = Math.round(quantity);

  if (isSoldOut(inventory)) {
    return {
      ok: false,
      error: "sold_out",
      message: "품절된 상품이에요.",
    };
  }

  if (rounded < inventory.minOrderQuantity || rounded > inventory.maxOrderQuantity) {
    return {
      ok: false,
      error: "quantity_out_of_range",
      message: `주문 수량은 ${inventory.minOrderQuantity}~${inventory.maxOrderQuantity}개까지 가능해요.`,
      min: inventory.minOrderQuantity,
      max: inventory.maxOrderQuantity,
    };
  }

  if (inventory.perUserLimit != null && userExistingQty + rounded > inventory.perUserLimit) {
    const allowed = Math.max(0, inventory.perUserLimit - userExistingQty);
    return {
      ok: false,
      error: "per_user_limit_exceeded",
      message:
        allowed > 0
          ? `1인당 최대 ${inventory.perUserLimit}개까지 구매할 수 있어요. (추가 가능 ${allowed}개)`
          : `1인당 최대 ${inventory.perUserLimit}개까지 구매할 수 있어요.`,
      limit: inventory.perUserLimit,
      existing: userExistingQty,
    };
  }

  const remaining = getRemainingStock(inventory);
  if (remaining != null && rounded > remaining) {
    return {
      ok: false,
      error: isNormalProduct(inventory.productType) ? "insufficient_stock" : "insufficient_capacity",
      message:
        remaining > 0
          ? `남은 수량은 ${remaining}개예요.`
          : isGroupBuyProduct(inventory.productType)
            ? "공동구매 참여 가능 수량이 모두 찼어요."
            : "재고가 부족해요.",
      remaining,
    };
  }

  return { ok: true };
}

export function canPurchaseProduct(
  inventory: ProductInventory,
  quantity: number,
  userExistingQty = 0,
): boolean {
  return validateOrderQuantity(inventory, quantity, userExistingQty).ok;
}

export function clampOrderQuantity(
  inventory: ProductInventory,
  quantity: number,
  userExistingQty = 0,
): number {
  let clamped = Math.round(quantity);
  clamped = Math.max(inventory.minOrderQuantity, Math.min(inventory.maxOrderQuantity, clamped));

  if (inventory.perUserLimit != null) {
    const allowed = Math.max(0, inventory.perUserLimit - userExistingQty);
    clamped = Math.min(clamped, allowed);
  }

  const remaining = getRemainingStock(inventory);
  if (remaining != null) {
    clamped = Math.min(clamped, remaining);
  }

  return Math.max(0, clamped);
}

export function inventoryFromDeal(deal: {
  productType?: string | null;
  stockQuantity?: number | null;
  soldQuantity?: number | null;
  minOrderQuantity?: number | null;
  maxOrderQuantity?: number | null;
  perUserLimit?: number | null;
  isSoldOut?: boolean | null;
  soldOutAt?: string | null;
  targetQuantity?: number | null;
  currentQuantity?: number | null;
  maxQuantity?: number | null;
}): ProductInventory {
  return {
    productType: (deal.productType === "normal" ? "normal" : "groupbuy") as ProductType,
    stockQuantity: deal.stockQuantity ?? null,
    soldQuantity: deal.soldQuantity ?? 0,
    minOrderQuantity: deal.minOrderQuantity ?? 1,
    maxOrderQuantity: deal.maxOrderQuantity ?? 99,
    perUserLimit: deal.perUserLimit ?? null,
    isSoldOut: deal.isSoldOut ?? false,
    soldOutAt: deal.soldOutAt ?? null,
    targetQuantity: deal.targetQuantity ?? null,
    currentQuantity: deal.currentQuantity ?? 0,
    maxQuantity: deal.maxQuantity ?? null,
  };
}

export function formatRemainingStockLabel(inventory: ProductInventory): string | null {
  const remaining = getRemainingStock(inventory);
  if (remaining == null) {
    return null;
  }

  if (remaining <= 0) {
    return "품절";
  }

  return `${remaining.toLocaleString("ko-KR")}개 남음`;
}
