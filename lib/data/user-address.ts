import type { SavedAddressData } from "@/lib/mock-storage";
import { DEFAULT_ADDRESS } from "@/lib/mock-storage";
import {
  createAddress,
  getDefaultAddress,
  userHasAnyAddress,
} from "@/lib/data/addresses";
import { shouldUseMockData } from "@/lib/env/runtime";

function toSavedAddressData(address: {
  recipientName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
}): SavedAddressData {
  return {
    name: address.recipientName,
    phone: address.phone,
    addressLine: address.addressLine1,
    addressDetail: address.addressLine2 ?? "",
  };
}

export async function getDefaultAddressForUser(userId: string): Promise<SavedAddressData> {
  const address = await getDefaultAddress(userId);
  if (!address) {
    return shouldUseMockData() ? DEFAULT_ADDRESS : DEFAULT_ADDRESS;
  }
  return toSavedAddressData(address);
}

export async function saveDefaultAddressForUser(
  userId: string,
  input: SavedAddressData,
): Promise<{ success: boolean }> {
  const result = await createAddress(userId, {
    recipientName: input.name,
    phone: input.phone,
    postalCode: "00000",
    addressLine1: input.addressLine,
    addressLine2: input.addressDetail,
    isDefault: true,
  });
  return { success: result.success };
}

export async function hasDefaultAddressForUser(userId: string): Promise<boolean> {
  return userHasAnyAddress(userId);
}
