import type { AddressFormInput, UserAddress } from "@/lib/addresses/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  inferRegionFromPostalCode,
  isRemoteAreaPostalCode,
} from "@/lib/shipping/remote-area";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ADDRESS_SELECT =
  "id, user_id, recipient_name, phone, postal_code, address_line1, address_line2, region, is_remote_area, delivery_memo, is_default, created_at, updated_at";

const mockAddresses = new Map<string, UserAddress[]>();

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[addresses] using mock fallback: ${context}`);
  }
}

function mapRow(row: Record<string, unknown>): UserAddress {
  const line1 = String(row.address_line1 ?? row.address_line ?? "");
  const line2Raw = row.address_line2;
  let addressLine2: string | null =
    line2Raw != null && String(line2Raw).trim() !== "" ? String(line2Raw) : null;

  if (!addressLine2 && row.address_line) {
    const legacy = String(row.address_line);
    const splitIndex = legacy.indexOf(" | ");
    if (splitIndex >= 0) {
      addressLine2 = legacy.slice(splitIndex + 3).trim() || null;
    }
  }

  return {
    id: row.id as string,
    userId: row.user_id as string,
    recipientName: String(row.recipient_name ?? ""),
    phone: String(row.phone ?? ""),
    postalCode: String(row.postal_code ?? ""),
    addressLine1: line1,
    addressLine2,
    region: (row.region as string | null) ?? null,
    isRemoteArea: Boolean(row.is_remote_area),
    deliveryMemo: (row.delivery_memo as string | null) ?? null,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string) ?? (row.created_at as string),
  };
}

function buildRemoteFields(postalCode: string, region?: string | null) {
  const normalizedPostal = postalCode.replace(/\D/g, "").slice(0, 5);
  const isRemoteArea = isRemoteAreaPostalCode(normalizedPostal);
  const resolvedRegion = region?.trim() || inferRegionFromPostalCode(normalizedPostal);
  return {
    postal_code: normalizedPostal || null,
    is_remote_area: isRemoteArea,
    region: resolvedRegion,
  };
}

function validateAddressInput(input: AddressFormInput): string | null {
  if (!input.recipientName.trim()) {
    return "recipient_name_required";
  }
  if (!input.phone.trim()) {
    return "phone_required";
  }
  const postal = input.postalCode.replace(/\D/g, "");
  if (postal.length < 5) {
    return "postal_code_invalid";
  }
  if (!input.addressLine1.trim()) {
    return "address_line1_required";
  }
  return null;
}

function getMockStore(userId: string): UserAddress[] {
  if (!mockAddresses.has(userId)) {
    mockAddresses.set(userId, []);
  }
  return mockAddresses.get(userId)!;
}

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getUserAddresses");
      return [...getMockStore(userId)].sort(
        (a, b) => Number(b.isDefault) - Number(a.isDefault),
      );
    }
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("addresses")
    .select(ADDRESS_SELECT)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[addresses] getUserAddresses:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function getDefaultAddress(userId: string): Promise<UserAddress | null> {
  const addresses = await getUserAddresses(userId);
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

export async function getAddressById(
  addressId: string,
  userId: string,
): Promise<UserAddress | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return getMockStore(userId).find((address) => address.id === addressId) ?? null;
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("addresses")
    .select(ADDRESS_SELECT)
    .eq("id", addressId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[addresses] getAddressById:", error.message);
    return null;
  }

  return data ? mapRow(data as Record<string, unknown>) : null;
}

export async function validateAddressOwnership(
  addressId: string,
  userId: string,
): Promise<boolean> {
  const address = await getAddressById(addressId, userId);
  return address != null;
}

export async function userHasAnyAddress(userId: string): Promise<boolean> {
  const addresses = await getUserAddresses(userId);
  return addresses.length > 0;
}

async function unsetDefaultAddresses(userId: string, supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  if (!supabase) {
    return;
  }

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);
}

export async function createAddress(
  userId: string,
  input: AddressFormInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const validationError = validateAddressInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const remote = buildRemoteFields(input.postalCode, input.region);
  const existing = await getUserAddresses(userId);
  const shouldBeDefault = input.isDefault === true || existing.length === 0;

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const id = `mock-address-${Date.now()}`;
      const store = getMockStore(userId);
      if (shouldBeDefault) {
        store.forEach((address) => {
          address.isDefault = false;
        });
      }
      store.push({
        id,
        userId,
        recipientName: input.recipientName.trim(),
        phone: input.phone.trim(),
        postalCode: remote.postal_code ?? "",
        addressLine1: input.addressLine1.trim(),
        addressLine2: input.addressLine2?.trim() || null,
        region: remote.region,
        isRemoteArea: remote.is_remote_area,
        deliveryMemo: input.deliveryMemo?.trim() || null,
        isDefault: shouldBeDefault,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true, id };
    }
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  if (shouldBeDefault) {
    await unsetDefaultAddresses(userId, supabase);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      label: null,
      recipient_name: input.recipientName.trim(),
      phone: input.phone.trim(),
      postal_code: remote.postal_code,
      address_line1: input.addressLine1.trim(),
      address_line2: input.addressLine2?.trim() || null,
      address_line: [input.addressLine1.trim(), input.addressLine2?.trim()]
        .filter(Boolean)
        .join(" | "),
      region: remote.region,
      is_remote_area: remote.is_remote_area,
      delivery_memo: input.deliveryMemo?.trim() || null,
      is_default: shouldBeDefault,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[addresses] createAddress:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: AddressFormInput,
): Promise<{ success: boolean; error?: string }> {
  const validationError = validateAddressInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const owned = await validateAddressOwnership(addressId, userId);
  if (!owned) {
    return { success: false, error: "not_found" };
  }

  const remote = buildRemoteFields(input.postalCode, input.region);

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const store = getMockStore(userId);
      const index = store.findIndex((address) => address.id === addressId);
      if (index < 0) {
        return { success: false, error: "not_found" };
      }
      if (input.isDefault) {
        store.forEach((address) => {
          address.isDefault = false;
        });
      }
      store[index] = {
        ...store[index],
        recipientName: input.recipientName.trim(),
        phone: input.phone.trim(),
        postalCode: remote.postal_code ?? "",
        addressLine1: input.addressLine1.trim(),
        addressLine2: input.addressLine2?.trim() || null,
        region: remote.region,
        isRemoteArea: remote.is_remote_area,
        deliveryMemo: input.deliveryMemo?.trim() || null,
        isDefault: input.isDefault ?? store[index].isDefault,
        updatedAt: new Date().toISOString(),
      };
      return { success: true };
    }
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  if (input.isDefault) {
    await unsetDefaultAddresses(userId, supabase);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      recipient_name: input.recipientName.trim(),
      phone: input.phone.trim(),
      postal_code: remote.postal_code,
      address_line1: input.addressLine1.trim(),
      address_line2: input.addressLine2?.trim() || null,
      address_line: [input.addressLine1.trim(), input.addressLine2?.trim()]
        .filter(Boolean)
        .join(" | "),
      region: remote.region,
      is_remote_area: remote.is_remote_area,
      delivery_memo: input.deliveryMemo?.trim() || null,
      is_default: input.isDefault ?? undefined,
    })
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    console.error("[addresses] updateAddress:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<{ success: boolean; error?: string }> {
  const target = await getAddressById(addressId, userId);
  if (!target) {
    return { success: false, error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const store = getMockStore(userId);
      const next = store.filter((address) => address.id !== addressId);
      mockAddresses.set(userId, next);
      if (target.isDefault && next.length > 0) {
        next[0].isDefault = true;
      }
      return { success: true };
    }
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    console.error("[addresses] deleteAddress:", error.message);
    return { success: false, error: error.message };
  }

  if (target.isDefault) {
    const { data: remaining } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (remaining) {
      await setDefaultAddress((remaining as { id: string }).id, userId);
    }
  }

  return { success: true };
}

export async function setDefaultAddress(
  addressId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const owned = await validateAddressOwnership(addressId, userId);
  if (!owned) {
    return { success: false, error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const store = getMockStore(userId);
      store.forEach((address) => {
        address.isDefault = address.id === addressId;
      });
      return { success: true };
    }
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  await unsetDefaultAddresses(userId, supabase);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    console.error("[addresses] setDefaultAddress:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export type OrderShippingSnapshot = {
  addressId: string | null;
  recipientName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
  deliveryMemo: string | null;
  region: string | null;
  isRemoteArea: boolean;
};

export async function resolveOrderShippingSnapshot(
  userId: string,
  addressId: string,
  deliveryMemo: string,
): Promise<{ success: true; snapshot: OrderShippingSnapshot } | { success: false; error: string }> {
  const address = await getAddressById(addressId, userId);
  if (!address) {
    return { success: false, error: "address_not_found" };
  }

  const memo = deliveryMemo.trim() || address.deliveryMemo;

  return {
    success: true,
    snapshot: {
      addressId: address.id,
      recipientName: address.recipientName,
      phone: address.phone,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      deliveryMemo: memo,
      region: address.region,
      isRemoteArea: address.isRemoteArea,
    },
  };
}
