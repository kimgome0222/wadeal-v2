import {
  type AdminSupplierDetail,
  type AdminSupplierFormInput,
  type AdminSupplierListItem,
} from "@/lib/admin-suppliers/shared";
import type { SupplierStatus } from "@/lib/settlements/labels";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type {
  AdminSupplierDetail,
  AdminSupplierFormInput,
  AdminSupplierListItem,
} from "@/lib/admin-suppliers/shared";

export {
  formatCommissionRate,
  getSupplierStatusLabel,
} from "@/lib/admin-suppliers/shared";

export type AdminSupplierMutationResult = {
  success: boolean;
  supplierId?: string;
  error?: "invalid_input" | "not_found" | "save_failed";
};

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[suppliers] using mock fallback: ${context}`);
  }
}

function validateFormInput(input: AdminSupplierFormInput): boolean {
  if (!input.name.trim()) {
    return false;
  }

  if (
    !Number.isFinite(input.commissionRate) ||
    input.commissionRate < 0 ||
    input.commissionRate > 100
  ) {
    return false;
  }

  return true;
}

function toListItem(row: {
  id: string;
  name: string;
  business_number: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  status: SupplierStatus;
  commission_rate: number;
  created_at: string;
  product_count?: number;
}): AdminSupplierListItem {
  return {
    id: row.id,
    name: row.name,
    businessNumber: row.business_number,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    status: row.status,
    commissionRate: Number(row.commission_rate),
    productCount: row.product_count ?? 0,
    createdAt: row.created_at,
  };
}

const mockSuppliers = new Map<string, AdminSupplierDetail>();

function seedMockSuppliers() {
  if (mockSuppliers.size > 0) {
    return;
  }

  const now = new Date().toISOString();
  mockSuppliers.set("mock-supplier-1", {
    id: "mock-supplier-1",
    name: "celloh 직영",
    businessNumber: "123-45-67890",
    contactName: "김담당",
    phone: "010-1234-5678",
    email: "supplier@wadeal.kr",
    bankName: "국민은행",
    bankAccount: "123456-01-123456",
    bankHolder: "주식회사 celloh",
    status: "active",
    commissionRate: 10,
    productCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

function getMockSuppliers(): AdminSupplierListItem[] {
  seedMockSuppliers();
  return Array.from(mockSuppliers.values()).map((item) => ({
    id: item.id,
    name: item.name,
    businessNumber: item.businessNumber,
    contactName: item.contactName,
    phone: item.phone,
    email: item.email,
    status: item.status,
    commissionRate: item.commissionRate,
    productCount: item.productCount,
    createdAt: item.createdAt,
  }));
}

function getMockSupplierById(id: string): AdminSupplierDetail | null {
  seedMockSuppliers();
  return mockSuppliers.get(id) ?? null;
}

function saveMockSupplier(
  input: AdminSupplierFormInput,
  existing?: AdminSupplierDetail,
): AdminSupplierMutationResult {
  seedMockSuppliers();

  const now = new Date().toISOString();
  const id = existing?.id ?? `mock-supplier-${Date.now()}`;

  mockSuppliers.set(id, {
    id,
    name: input.name.trim(),
    businessNumber: input.businessNumber.trim() || null,
    contactName: input.contactName.trim() || null,
    phone: input.phone.trim() || null,
    email: input.email.trim() || null,
    bankName: input.bankName.trim() || null,
    bankAccount: input.bankAccount.trim() || null,
    bankHolder: input.bankHolder.trim() || null,
    status: input.status,
    commissionRate: input.commissionRate,
    productCount: existing?.productCount ?? 0,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });

  return { success: true, supplierId: id };
}

export async function getAdminSuppliers(): Promise<AdminSupplierListItem[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("getAdminSuppliers");
    return shouldUseMockData() ? getMockSuppliers() : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? getMockSuppliers() : [];
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name, business_number, contact_name, phone, email, status, commission_rate, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[suppliers] getAdminSuppliers:", error?.message);
    return shouldUseMockData() ? getMockSuppliers() : [];
  }

  const supplierIds = data.map((row) => row.id as string);
  const productCounts = new Map<string, number>();

  if (supplierIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("supplier_id")
      .in("supplier_id", supplierIds);

    for (const row of products ?? []) {
      const supplierId = row.supplier_id as string | null;
      if (!supplierId) {
        continue;
      }

      productCounts.set(supplierId, (productCounts.get(supplierId) ?? 0) + 1);
    }
  }

  return (data as Array<{
    id: string;
    name: string;
    business_number: string | null;
    contact_name: string | null;
    phone: string | null;
    email: string | null;
    status: SupplierStatus;
    commission_rate: number;
    created_at: string;
  }>).map((row) =>
    toListItem({
      ...row,
      product_count: productCounts.get(row.id) ?? 0,
    }),
  );
}

export async function getAdminSupplierById(id: string): Promise<AdminSupplierDetail | null> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? getMockSupplierById(id) : null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? getMockSupplierById(id) : null;
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("[suppliers] getAdminSupplierById:", error?.message);
    return shouldUseMockData() ? getMockSupplierById(id) : null;
  }

  const row = data as {
    id: string;
    name: string;
    business_number: string | null;
    contact_name: string | null;
    phone: string | null;
    email: string | null;
    bank_name: string | null;
    bank_account: string | null;
    bank_holder: string | null;
    status: SupplierStatus;
    commission_rate: number;
    created_at: string;
    updated_at: string;
  };

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("supplier_id", id);

  return {
    ...toListItem({ ...row, product_count: count ?? 0 }),
    bankName: row.bank_name,
    bankAccount: row.bank_account,
    bankHolder: row.bank_holder,
    updatedAt: row.updated_at,
  };
}

export async function createAdminSupplier(
  input: AdminSupplierFormInput,
): Promise<AdminSupplierMutationResult> {
  if (!validateFormInput(input)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return shouldUseMockData()
      ? saveMockSupplier(input)
      : { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      name: input.name.trim(),
      business_number: input.businessNumber.trim() || null,
      contact_name: input.contactName.trim() || null,
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      bank_name: input.bankName.trim() || null,
      bank_account: input.bankAccount.trim() || null,
      bank_holder: input.bankHolder.trim() || null,
      status: input.status,
      commission_rate: input.commissionRate,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[suppliers] createAdminSupplier:", error?.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, supplierId: (data as { id: string }).id };
}

export async function updateAdminSupplier(
  supplierId: string,
  input: AdminSupplierFormInput,
): Promise<AdminSupplierMutationResult> {
  if (!validateFormInput(input)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { success: false, error: "save_failed" };
    }

    const existing = getMockSupplierById(supplierId);
    if (!existing) {
      return { success: false, error: "not_found" };
    }

    return saveMockSupplier(input, existing);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("suppliers")
    .update({
      name: input.name.trim(),
      business_number: input.businessNumber.trim() || null,
      contact_name: input.contactName.trim() || null,
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      bank_name: input.bankName.trim() || null,
      bank_account: input.bankAccount.trim() || null,
      bank_holder: input.bankHolder.trim() || null,
      status: input.status,
      commission_rate: input.commissionRate,
    })
    .eq("id", supplierId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[suppliers] updateAdminSupplier:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true, supplierId };
}

export async function updateAdminSupplierStatus(
  supplierId: string,
  status: SupplierStatus,
): Promise<AdminSupplierMutationResult> {
  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { success: false, error: "save_failed" };
    }

    const existing = getMockSupplierById(supplierId);
    if (!existing) {
      return { success: false, error: "not_found" };
    }

    mockSuppliers.set(supplierId, {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, supplierId };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("suppliers")
    .update({ status })
    .eq("id", supplierId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[suppliers] updateAdminSupplierStatus:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true, supplierId };
}

export function parseAdminSupplierForm(raw: {
  name: string;
  businessNumber: string;
  contactName: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  status: string;
  commissionRate: string;
}): AdminSupplierFormInput {
  return {
    name: raw.name,
    businessNumber: raw.businessNumber,
    contactName: raw.contactName,
    phone: raw.phone,
    email: raw.email,
    bankName: raw.bankName,
    bankAccount: raw.bankAccount,
    bankHolder: raw.bankHolder,
    status: raw.status as SupplierStatus,
    commissionRate: Number(raw.commissionRate),
  };
}

export async function getActiveSuppliersForSelect(): Promise<
  Array<{ id: string; name: string; commissionRate: number }>
> {
  if (!isSupabaseConfigured()) {
    seedMockSuppliers();
    return Array.from(mockSuppliers.values())
      .filter((item) => item.status === "active")
      .map((item) => ({
        id: item.id,
        name: item.name,
        commissionRate: item.commissionRate,
      }));
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name, commission_rate")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("[suppliers] getActiveSuppliersForSelect:", error?.message);
    return [];
  }

  return (data as Array<{ id: string; name: string; commission_rate: number }>).map((row) => ({
    id: row.id,
    name: row.name,
    commissionRate: Number(row.commission_rate),
  }));
}
