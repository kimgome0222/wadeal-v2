export const PRODUCT_TYPES = ["normal", "groupbuy"] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export function isProductType(value: string | null | undefined): value is ProductType {
  return value != null && (PRODUCT_TYPES as readonly string[]).includes(value);
}

export function normalizeProductType(value: string | null | undefined): ProductType {
  return isProductType(value) ? value : "groupbuy";
}

export function isGroupBuyProduct(productType: string | null | undefined): boolean {
  return normalizeProductType(productType) === "groupbuy";
}

export function isNormalProduct(productType: string | null | undefined): boolean {
  return normalizeProductType(productType) === "normal";
}

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  normal: "일반 상품",
  groupbuy: "셀러 상품",
};

export function getProductTypeLabel(productType: string | null | undefined): string {
  return PRODUCT_TYPE_LABELS[normalizeProductType(productType)];
}
