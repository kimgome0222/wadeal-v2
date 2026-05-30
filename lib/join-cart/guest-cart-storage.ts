export type GuestJoinCartSnapshot = {
  productSlug: string;
  productName: string;
  estimatedUnitPrice: number;
  sellerName: string;
  imageUrl: string;
};

export type GuestJoinCartItem = GuestJoinCartSnapshot & {
  id: string;
  quantity: number;
  estimatedLineTotal: number;
  qtyUntilNextTier: number;
  participants: number;
  badge: string;
  closed: boolean;
};

const STORAGE_KEY = "celloh-guest-join-cart";
export const GUEST_CART_CHANGED_EVENT = "celloh-guest-cart-changed";

function sanitizeGuestCartItem(raw: unknown): GuestJoinCartItem | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Partial<GuestJoinCartItem>;
  const productSlug = typeof item.productSlug === "string" ? item.productSlug.trim() : "";
  if (!productSlug) {
    return null;
  }

  const quantity = Math.min(99, Math.max(0, Math.floor(Number(item.quantity) || 0)));
  if (quantity <= 0) {
    return null;
  }

  const estimatedUnitPrice = Number.isFinite(Number(item.estimatedUnitPrice))
    ? Math.max(0, Number(item.estimatedUnitPrice))
    : 0;

  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id : `guest-${productSlug}`,
    productSlug,
    productName: typeof item.productName === "string" ? item.productName : "상품",
    quantity,
    estimatedUnitPrice,
    estimatedLineTotal: estimatedUnitPrice * quantity,
    qtyUntilNextTier: Math.max(0, Math.floor(Number(item.qtyUntilNextTier) || 0)),
    participants: Math.max(0, Math.floor(Number(item.participants) || 0)),
    badge: typeof item.badge === "string" ? item.badge : "",
    closed: Boolean(item.closed),
    sellerName: typeof item.sellerName === "string" ? item.sellerName : "celloh 셀러",
    imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
  };
}

function readRaw(): GuestJoinCartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => sanitizeGuestCartItem(item))
      .filter((item): item is GuestJoinCartItem => item != null);
  } catch {
    return [];
  }
}

function writeRaw(items: GuestJoinCartItem[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(GUEST_CART_CHANGED_EVENT));
}

export function readGuestJoinCartItems(): GuestJoinCartItem[] {
  return readRaw();
}

export function getGuestJoinCartCount(): number {
  return readRaw().reduce((sum, item) => sum + item.quantity, 0);
}

export function getGuestJoinCartQuantityBySlug(productSlug: string): number {
  const item = readRaw().find((entry) => entry.productSlug === productSlug);
  return item?.quantity ?? 0;
}

export function setGuestJoinCartQuantityBySlug(
  snapshot: GuestJoinCartSnapshot,
  quantity: number,
) {
  if (quantity <= 0) {
    writeRaw(readRaw().filter((item) => item.productSlug !== snapshot.productSlug));
    return;
  }

  const items = readRaw();
  const existing = items.find((item) => item.productSlug === snapshot.productSlug);

  if (existing) {
    existing.quantity = Math.min(99, quantity);
    existing.estimatedLineTotal = existing.estimatedUnitPrice * existing.quantity;
    writeRaw(items);
    return;
  }

  addGuestJoinCartItem(snapshot, quantity);
}

export function addGuestJoinCartItem(snapshot: GuestJoinCartSnapshot, quantity = 1) {
  const items = readRaw();
  const existing = items.find((item) => item.productSlug === snapshot.productSlug);

  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + quantity);
    existing.estimatedLineTotal = existing.estimatedUnitPrice * existing.quantity;
  } else {
    items.push({
      ...snapshot,
      id: `guest-${snapshot.productSlug}`,
      quantity,
      estimatedLineTotal: snapshot.estimatedUnitPrice * quantity,
      qtyUntilNextTier: 0,
      participants: 0,
      badge: "",
      closed: false,
    });
  }

  writeRaw(items);
}

export function updateGuestJoinCartQuantity(cartItemId: string, quantity: number) {
  const items = readRaw().map((item) => {
    if (item.id !== cartItemId) {
      return item;
    }
    const nextQuantity = Math.min(99, Math.max(1, quantity));
    return {
      ...item,
      quantity: nextQuantity,
      estimatedLineTotal: item.estimatedUnitPrice * nextQuantity,
    };
  });
  writeRaw(items);
}

export function removeGuestJoinCartItem(cartItemId: string) {
  writeRaw(readRaw().filter((item) => item.id !== cartItemId));
}

/** 로그인 장바구니 → guest store badge/stepper 동기화 */
export function syncGuestJoinCartFromServerItems(
  items: Array<{
    id: string;
    productSlug: string;
    productName: string;
    quantity: number;
    estimatedUnitPrice: number;
    estimatedLineTotal: number;
    qtyUntilNextTier: number;
    participants: number;
    badge: string;
    closed: boolean;
    sellerName: string;
    imageUrl: string;
  }>,
) {
  const next = items.map((item) => ({
    id: item.id,
    productSlug: item.productSlug,
    productName: item.productName,
    quantity: item.quantity,
    estimatedUnitPrice: item.estimatedUnitPrice,
    estimatedLineTotal: item.estimatedLineTotal,
    qtyUntilNextTier: item.qtyUntilNextTier,
    participants: item.participants,
    badge: item.badge,
    closed: item.closed,
    sellerName: item.sellerName,
    imageUrl: item.imageUrl,
  }));

  const current = readRaw();
  if (JSON.stringify(current) === JSON.stringify(next)) {
    return;
  }

  writeRaw(next);
}
