export type ShippingType = "paid" | "free" | "conditional_free";

export type ProductShippingProfile = {
  shippingFee: number;
  freeShippingThreshold: number | null;
  shippingType: ShippingType;
  isFreeShipping: boolean;
  remoteAreaExtraFee: number;
};

export type AddressForShipping = {
  postalCode?: string | null;
  isRemoteArea?: boolean;
};

export type ShippingFeeResult = {
  baseShippingFee: number;
  remoteExtraFee: number;
  totalShippingFee: number;
  isFreeShipping: boolean;
  /** Amount still needed for conditional free shipping (0 if not applicable). */
  amountUntilFreeShipping: number;
  freeShippingThreshold: number | null;
};
