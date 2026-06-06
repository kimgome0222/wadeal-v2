import type {
  AddressForShipping,
  ProductShippingProfile,
  ShippingFeeResult,
  ShippingType,
} from "@/lib/shipping/types";
import { isRemoteAreaPostalCode } from "@/lib/shipping/remote-area";

export type CalculateShippingFeeInput = {
  product: ProductShippingProfile;
  address?: AddressForShipping | null;
  subtotal: number;
  quantity?: number;
};

function normalizeShippingType(value: string | null | undefined): ShippingType {
  if (value === "free" || value === "conditional_free" || value === "paid") {
    return value;
  }
  return "paid";
}

function resolveIsRemoteArea(address?: AddressForShipping | null): boolean {
  if (!address) {
    return false;
  }

  if (address.isRemoteArea === true) {
    return true;
  }

  return isRemoteAreaPostalCode(address.postalCode);
}

function resolveBaseShippingFee(
  product: ProductShippingProfile,
  subtotal: number,
): { baseShippingFee: number; isFreeShipping: boolean; amountUntilFreeShipping: number } {
  const shippingType = normalizeShippingType(product.shippingType);
  const threshold = product.freeShippingThreshold;
  const baseFee = Math.max(0, Math.round(product.shippingFee));

  if (product.isFreeShipping || shippingType === "free") {
    return { baseShippingFee: 0, isFreeShipping: true, amountUntilFreeShipping: 0 };
  }

  if (shippingType === "conditional_free" && threshold != null && threshold > 0) {
    const safeSubtotal = Math.max(0, Math.round(subtotal));
    if (safeSubtotal >= threshold) {
      return { baseShippingFee: 0, isFreeShipping: true, amountUntilFreeShipping: 0 };
    }

    return {
      baseShippingFee: baseFee,
      isFreeShipping: false,
      amountUntilFreeShipping: Math.max(0, threshold - safeSubtotal),
    };
  }

  return { baseShippingFee: baseFee, isFreeShipping: false, amountUntilFreeShipping: 0 };
}

/**
 * Computes base shipping, Jeju/remote surcharge, and total shipping for an order line.
 */
export function calculateShippingFee(input: CalculateShippingFeeInput): ShippingFeeResult {
  const subtotal = Math.max(0, Math.round(input.subtotal));
  const { baseShippingFee, isFreeShipping, amountUntilFreeShipping } = resolveBaseShippingFee(
    input.product,
    subtotal,
  );

  const isRemote = resolveIsRemoteArea(input.address);
  const remoteExtraFee =
    isRemote && !isFreeShipping ? Math.max(0, Math.round(input.product.remoteAreaExtraFee)) : 0;

  const totalShippingFee = baseShippingFee + remoteExtraFee;

  return {
    baseShippingFee,
    remoteExtraFee,
    totalShippingFee,
    isFreeShipping,
    amountUntilFreeShipping,
    freeShippingThreshold: input.product.freeShippingThreshold,
  };
}
