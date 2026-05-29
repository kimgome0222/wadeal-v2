import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type SellerProductInquiryFilter = "all" | "no_reply" | "answered";

export type SellerProductInquiryItem = {
  id: string;
  productId: string | null;
  productName: string;
  content: string;
  adminReply: string | null;
  status: string;
  createdAt: string;
  createdAtLabel: string;
};

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function getSellerProductSlugs(sellerUserId: string): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("products")
    .select("slug, name")
    .eq("created_by", sellerUserId);

  return (data ?? []).map((row) => row.slug as string).filter(Boolean);
}

async function getProductNameMap(productSlugs: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productSlugs.length === 0) {
    return map;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return map;
  }

  const { data } = await supabase.from("products").select("slug, name").in("slug", productSlugs);
  for (const row of data ?? []) {
    map.set(row.slug as string, row.name as string);
  }

  return map;
}

function applyFilter(
  items: SellerProductInquiryItem[],
  filter: SellerProductInquiryFilter,
): SellerProductInquiryItem[] {
  if (filter === "no_reply") {
    return items.filter((item) => !item.adminReply);
  }
  if (filter === "answered") {
    return items.filter((item) => Boolean(item.adminReply));
  }
  return items;
}

export async function getSellerProductInquiries(
  sellerUserId: string,
  filter: SellerProductInquiryFilter = "all",
): Promise<SellerProductInquiryItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const productSlugs = await getSellerProductSlugs(sellerUserId);
  if (productSlugs.length === 0) {
    return [];
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .select("id, product_id, title, content, admin_reply, status, created_at")
    .eq("type", "product")
    .in("product_id", productSlugs)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[seller-product-inquiries] list:", error.message);
    }
    return [];
  }

  const nameMap = await getProductNameMap(productSlugs);
  const items = (data ?? []).map((row) => {
    const productId = (row.product_id as string | null) ?? null;
    return {
      id: row.id as string,
      productId,
      productName: (productId && nameMap.get(productId)) || (row.title as string) || "상품 문의",
      content: row.content as string,
      adminReply: (row.admin_reply as string | null) ?? null,
      status: row.status as string,
      createdAt: row.created_at as string,
      createdAtLabel: formatDateLabel(row.created_at as string),
    };
  });

  return applyFilter(items, filter);
}

export async function sellerOwnsProductInquiry(
  sellerUserId: string,
  ticketId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return false;
  }

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .select("product_id, type")
    .eq("id", ticketId)
    .maybeSingle();

  if (error || !ticket || ticket.type !== "product" || !ticket.product_id) {
    return false;
  }

  const productSlugs = await getSellerProductSlugs(sellerUserId);
  return productSlugs.includes(ticket.product_id as string);
}
