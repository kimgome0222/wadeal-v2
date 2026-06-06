export const MIN_ORDER_QUANTITY = 1;
export const MAX_ORDER_QUANTITY = 99;

export function normalizeOrderQuantity(quantity: number | undefined | null): number {
  if (quantity == null || !Number.isFinite(quantity)) {
    return MIN_ORDER_QUANTITY;
  }

  return Math.min(MAX_ORDER_QUANTITY, Math.max(MIN_ORDER_QUANTITY, Math.round(quantity)));
}

export function isValidOrderQuantity(quantity: number | undefined | null): boolean {
  if (quantity == null || !Number.isFinite(quantity)) {
    return false;
  }

  const rounded = Math.round(quantity);
  return rounded >= MIN_ORDER_QUANTITY && rounded <= MAX_ORDER_QUANTITY;
}
