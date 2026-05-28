import { shouldUseMockData } from "@/lib/env/runtime";
import { notifyAdminNewSellerApplication } from "@/lib/notifications/admin-events";
import {
  notifySellerApplicationApproved,
  notifySellerApplicationRejected,
} from "@/lib/notifications/seller-events";
import type {
  SellerApplicationInput,
  SellerBankAccountInput,
  SellerProfileInput,
  SellerRecord,
  SellerStatus,
} from "@/lib/sellers/types";
import { isSellerStatus } from "@/lib/sellers/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[sellers] using mock fallback: ${context}`);
  }
}

const mockSellers = new Map<string, SellerRecord>();

function mapSellerRow(row: Record<string, unknown>): SellerRecord {
  const status = row.status as string;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    companyName: row.company_name as string,
    businessNumber: row.business_number as string,
    representativeName: (row.representative_name as string | null) ?? null,
    businessRegistrationUrl: (row.business_registration_url as string | null) ?? null,
    rejectedReason: (row.rejected_reason as string | null) ?? null,
    status: isSellerStatus(status) ? status : "pending_review",
    bankName: (row.bank_name as string | null) ?? null,
    accountNumber: (row.account_number as string | null) ?? null,
    accountHolder: (row.account_holder as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export type { SellerRecord } from "@/lib/sellers/types";
export { getSellerStatusLabel } from "@/lib/sellers/types";

export async function getSellerByUserId(userId: string): Promise<SellerRecord | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getSellerByUserId");
      return mockSellers.get(userId) ?? null;
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return mockSellers.get(userId) ?? null;
  }

  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[sellers] getSellerByUserId:", error.message);
    return mockSellers.get(userId) ?? null;
  }

  if (!data) {
    return null;
  }

  return mapSellerRow(data as Record<string, unknown>);
}

export async function getSellerById(sellerId: string): Promise<SellerRecord | null> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const record of mockSellers.values()) {
        if (record.id === sellerId) {
          return record;
        }
      }
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", sellerId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapSellerRow(data as Record<string, unknown>);
}

export async function createSellerApplication(
  userId: string,
  input: SellerApplicationInput,
): Promise<{ success: boolean; sellerId?: string; error?: "invalid_input" | "already_exists" | "save_failed" }> {
  const companyName = input.companyName.trim();
  const businessNumber = input.businessNumber.trim();
  const representativeName = input.representativeName.trim();
  const businessRegistrationUrl = input.businessRegistrationUrl?.trim() || null;
  const bankName = input.bankName.trim();
  const accountNumber = input.accountNumber.trim();
  const accountHolder = input.accountHolder.trim();

  if (
    !companyName ||
    !businessNumber ||
    !representativeName ||
    !bankName ||
    !accountNumber ||
    !accountHolder
  ) {
    return { success: false, error: "invalid_input" };
  }

  const existing = await getSellerByUserId(userId);
  if (existing && existing.status !== "rejected") {
    return { success: false, error: "already_exists" };
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const id = `mock-seller-${userId}`;
      mockSellers.set(userId, {
        id,
        userId,
        companyName,
        businessNumber,
        representativeName,
        businessRegistrationUrl,
        rejectedReason: null,
        status: "pending_review",
        bankName,
        accountNumber,
        accountHolder,
        createdAt: now,
        updatedAt: now,
      });
      return { success: true, sellerId: id };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  if (existing?.status === "rejected") {
    const { data, error } = await supabase
      .from("sellers")
      .update({
        company_name: companyName,
        business_number: businessNumber,
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        status: "pending_review",
      })
      .eq("user_id", userId)
      .select("id")
      .single();

    if (error) {
      console.error("[sellers] reapply:", error.message);
      return { success: false, error: "save_failed" };
    }

    const sellerId = (data as { id: string }).id;
    await notifyAdminNewSellerApplication({ companyName, sellerId });
    return { success: true, sellerId };
  }

  const { data, error } = await supabase
    .from("sellers")
    .insert({
      user_id: userId,
      company_name: companyName,
      business_number: businessNumber,
      bank_name: bankName,
      account_number: accountNumber,
      account_holder: accountHolder,
      status: "pending_review",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[sellers] createSellerApplication:", error.message);
    return { success: false, error: "save_failed" };
  }

  const sellerId = (data as { id: string }).id;
  await notifyAdminNewSellerApplication({ companyName, sellerId });
  return { success: true, sellerId };
}

export async function getPendingSellersForAdmin(): Promise<SellerRecord[]> {
  return getSellersByStatusForAdmin("pending_review");
}

export async function getSellersByStatusForAdmin(
  status?: SellerStatus,
): Promise<SellerRecord[]> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const all = Array.from(mockSellers.values());
      return status ? all.filter((item) => item.status === status) : all;
    }
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  let query = supabase.from("sellers").select("*").order("created_at", { ascending: false });
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[sellers] getSellersByStatusForAdmin:", error?.message);
    return [];
  }

  return data.map((row) => mapSellerRow(row as Record<string, unknown>));
}

export async function updateSellerStatusAdmin(
  sellerId: string,
  status: SellerStatus,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" }> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const [userId, record] of mockSellers.entries()) {
        if (record.id === sellerId) {
          mockSellers.set(userId, {
            ...record,
            status,
            updatedAt: new Date().toISOString(),
          });
          return { success: true };
        }
      }
      return { success: false, error: "not_found" };
    }
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const seller = await getSellerById(sellerId);
  if (!seller) {
    return { success: false, error: "not_found" };
  }

  const { error: sellerError } = await supabase
    .from("sellers")
    .update({ status })
    .eq("id", sellerId);

  if (sellerError) {
    console.error("[sellers] updateSellerStatusAdmin:", sellerError.message);
    return { success: false, error: "save_failed" };
  }

  if (status === "approved") {
    const { error: userError } = await supabase
      .from("users")
      .update({ role: "seller" })
      .eq("id", seller.userId);

    if (userError) {
      console.error("[sellers] update user role:", userError.message);
    }

    await notifySellerApplicationApproved({
      sellerId: seller.id,
      companyName: seller.companyName,
    });
  } else if (status === "rejected") {
    await notifySellerApplicationRejected({
      sellerId: seller.id,
      companyName: seller.companyName,
      reason: seller.rejectedReason,
    });
  }

  return { success: true };
}

export async function updateSellerBankAccount(
  userId: string,
  input: SellerBankAccountInput,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "save_failed" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data, error } = await supabase
    .from("sellers")
    .update({
      bank_name: input.bankName.trim(),
      account_number: input.accountNumber.replace(/\D/g, ""),
      account_holder: input.accountHolder.trim(),
    })
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[sellers] updateSellerBankAccount:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}
