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

/** 공통 cart key — 로그인 여부와 무관하게 동일 key 사용 */
export const GUEST_JOIN_CART_STORAGE_KEY = "celloh-guest-join-cart";
const STORAGE_KEY = GUEST_JOIN_CART_STORAGE_KEY;
export const GUEST_CART_CHANGED_EVENT = "celloh-guest-cart-changed";

/** spec alias + legacy keys — migrate 후 제거 */
const LEGACY_CART_STORAGE_KEYS = [
  "celloh-cart",
  "celloh-guest-cart",
  "wadeal-guest-join-cart",
] as const;

let migrationDone = false;

function parseStoredCartItems(raw: string): GuestJoinCartItem[] {
  try {
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

function mergeCartItemsBySlug(
  base: GuestJoinCartItem[],
  incoming: GuestJoinCartItem[],
): GuestJoinCartItem[] {
  const merged = [...base];

  for (const item of incoming) {
    const existing = merged.find((entry) => entry.productSlug === item.productSlug);
    if (existing) {
      existing.quantity = Math.min(99, Math.max(existing.quantity, item.quantity));
      existing.estimatedLineTotal = existing.estimatedUnitPrice * existing.quantity;
      continue;
    }

    merged.push(item);
  }

  return merged;
}

function migrateLegacyCartKeys() {
  if (typeof window === "undefined" || migrationDone) {
    return;
  }

  migrationDone = true;

  let merged = parseStoredCartItems(window.localStorage.getItem(STORAGE_KEY) ?? "[]");

  for (const legacyKey of LEGACY_CART_STORAGE_KEYS) {
    const raw = window.localStorage.getItem(legacyKey);
    if (!raw) {
      continue;
    }

    const legacyItems = parseStoredCartItems(raw);
    if (legacyItems.length > 0) {
      merged = mergeCartItemsBySlug(merged, legacyItems);
    }

    window.localStorage.removeItem(legacyKey);
  }

  writeRaw(merged);
}

export function ensureGuestJoinCartStorageReady() {
  migrateLegacyCartKeys();
}

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

  migrateLegacyCartKeys();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  return parseStoredCartItems(raw);
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

type ServerJoinCartItem = {
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
};

/** 로그인 장바구니 → local cart merge (local 우선, server empty면 유지) */
export function mergeGuestJoinCartFromServerItems(items: ServerJoinCartItem[]) {
  if (items.length === 0) {
    return;
  }

  const incoming = items.map((item) => ({
    id: item.id,
    productSlug: item.productSlug,
    productName: item.productName,
    quantity: Math.min(99, Math.max(1, Math.floor(Number(item.quantity) || 1))),
    estimatedUnitPrice: Math.max(0, Number(item.estimatedUnitPrice) || 0),
    estimatedLineTotal: 0,
    qtyUntilNextTier: Math.max(0, Math.floor(Number(item.qtyUntilNextTier) || 0)),
    participants: Math.max(0, Math.floor(Number(item.participants) || 0)),
    badge: item.badge,
    closed: item.closed,
    sellerName: item.sellerName,
    imageUrl: item.imageUrl,
  }));

  for (const item of incoming) {
    item.estimatedLineTotal = item.estimatedUnitPrice * item.quantity;
  }

  const merged = mergeCartItemsBySlug(readRaw(), incoming);
  const current = readRaw();

  if (JSON.stringify(current) === JSON.stringify(merged)) {
    return;
  }

  writeRaw(merged);
}

/** @deprecated local cart overwrite — mergeGuestJoinCartFromServerItems 사용 */
export function syncGuestJoinCartFromServerItems(items: ServerJoinCartItem[]) {
  mergeGuestJoinCartFromServerItems(items);
}
