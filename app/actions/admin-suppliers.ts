"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  createAdminSupplier,
  parseAdminSupplierForm,
  updateAdminSupplier,
  updateAdminSupplierStatus,
  type AdminSupplierFormInput,
} from "@/lib/data/suppliers";
import type { SupplierStatus } from "@/lib/settlements/labels";

type AdminActionResult = {
  success: boolean;
  supplierId?: string;
  error?:
    | "login_required"
    | "forbidden"
    | "invalid_input"
    | "not_found"
    | "save_failed";
};

async function ensureAdmin(): Promise<
  { ok: true } | { ok: false; error: AdminActionResult["error"] }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, error: "login_required" };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true };
}

function revalidateAdminSupplierPaths(supplierId?: string) {
  revalidatePath("/admin/suppliers");

  if (supplierId) {
    revalidatePath(`/admin/suppliers/${supplierId}/edit`);
  }
}

export async function createAdminSupplierAction(
  raw: Parameters<typeof parseAdminSupplierForm>[0],
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const input = parseAdminSupplierForm(raw);
  const result = await createAdminSupplier(input);

  if (result.success) {
    revalidateAdminSupplierPaths(result.supplierId);
  }

  return result;
}

export async function updateAdminSupplierAction(
  supplierId: string,
  raw: Parameters<typeof parseAdminSupplierForm>[0],
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const input = parseAdminSupplierForm(raw);
  const result = await updateAdminSupplier(supplierId, input);

  if (result.success) {
    revalidateAdminSupplierPaths(supplierId);
  }

  return result;
}

export async function updateAdminSupplierStatusAction(
  supplierId: string,
  status: SupplierStatus,
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const result = await updateAdminSupplierStatus(supplierId, status);

  if (result.success) {
    revalidateAdminSupplierPaths(supplierId);
  }

  return result;
}

export type { AdminSupplierFormInput };
