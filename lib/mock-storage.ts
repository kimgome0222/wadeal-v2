export const celloh_ADDRESS_SAVED = "wadeal-address-saved";
export const celloh_PAYMENT_SAVED = "wadeal-payment-saved";
export const celloh_ADDRESS_DATA = "wadeal-address-data-v1";
export const celloh_PAYMENT_DATA = "wadeal-payment-data-v1";

export const DEFAULT_CHECKOUT_RETURN = "/checkout/wd-vacuum-001";

export type SavedAddressData = {
  name: string;
  phone: string;
  addressLine: string;
  addressDetail: string;
};

export type SavedPaymentData = {
  cardName: string;
  cardNumberMasked: string;
};

export const DEFAULT_ADDRESS: SavedAddressData = {
  name: "김한글",
  phone: "010-0000-0000",
  addressLine: "서울특별시 강남구 테헤란로 123",
  addressDetail: "101동 1001호",
};

export const DEFAULT_PAYMENT: SavedPaymentData = {
  cardName: "신한카드",
  cardNumberMasked: "**** **** **** 1234",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readSavedAddress(): SavedAddressData {
  if (!isBrowser()) {
    return DEFAULT_ADDRESS;
  }

  try {
    const raw = sessionStorage.getItem(celloh_ADDRESS_DATA);
    if (!raw) {
      return DEFAULT_ADDRESS;
    }

    return { ...DEFAULT_ADDRESS, ...(JSON.parse(raw) as SavedAddressData) };
  } catch (error) {
    console.warn("[mock-storage] readSavedAddress fallback:", error);
    return DEFAULT_ADDRESS;
  }
}

export function readSavedPayment(): SavedPaymentData {
  if (!isBrowser()) {
    return DEFAULT_PAYMENT;
  }

  try {
    const raw = sessionStorage.getItem(celloh_PAYMENT_DATA);
    if (!raw) {
      return DEFAULT_PAYMENT;
    }

    return { ...DEFAULT_PAYMENT, ...(JSON.parse(raw) as SavedPaymentData) };
  } catch (error) {
    console.warn("[mock-storage] readSavedPayment fallback:", error);
    return DEFAULT_PAYMENT;
  }
}

export function writeSavedAddress(data: SavedAddressData) {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.setItem(celloh_ADDRESS_DATA, JSON.stringify(data));
  sessionStorage.setItem(celloh_ADDRESS_SAVED, "1");
}

export function writeSavedPayment(data: SavedPaymentData) {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.setItem(celloh_PAYMENT_DATA, JSON.stringify(data));
  sessionStorage.setItem(celloh_PAYMENT_SAVED, "1");
}

export function returnLabel(returnPath: string, checkoutLabel: string, defaultLabel: string) {
  return returnPath.includes("/checkout/") ? checkoutLabel : defaultLabel;
}
