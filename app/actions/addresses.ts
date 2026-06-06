"use server";

import { revalidatePath } from "next/cache";

import type { AddressFormInput } from "@/lib/addresses/types";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/lib/data/addresses";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function ensureProfile() {
  const user = await getServerAuthUser();
  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await syncAuthUserToPublicProfile(user, supabase);
  }

  return user;
}

export async function createAddressAction(input: AddressFormInput) {
  const user = await ensureProfile();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await createAddress(user.id, input);
  if (result.success) {
    revalidatePath("/mypage/addresses");
    revalidatePath("/mypage/address");
    revalidatePath("/checkout/[id]", "page");
  }

  return result;
}

export async function updateAddressAction(addressId: string, input: AddressFormInput) {
  const user = await ensureProfile();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await updateAddress(user.id, addressId, input);
  if (result.success) {
    revalidatePath("/mypage/addresses");
    revalidatePath(`/mypage/addresses/${addressId}/edit`);
    revalidatePath("/checkout/[id]", "page");
  }

  return result;
}

export async function deleteAddressAction(addressId: string) {
  const user = await ensureProfile();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await deleteAddress(user.id, addressId);
  if (result.success) {
    revalidatePath("/mypage/addresses");
    revalidatePath("/checkout/[id]", "page");
  }

  return result;
}

export async function setDefaultAddressAction(addressId: string) {
  const user = await ensureProfile();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await setDefaultAddress(addressId, user.id);
  if (result.success) {
    revalidatePath("/mypage/addresses");
    revalidatePath("/checkout/[id]", "page");
  }

  return result;
}
