import { getCourierByCode } from "@/lib/shipping/couriers";
import { notifyShippingStarted } from "@/lib/notifications/order-events";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type SellerOrderDetail = {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
  courierCode: string | null;
  courierCompany: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  createdAt: string;
};

const sellerOrderSelect =
  "id, user_id, product_id, product_name, quantity, order_status, payment_status, shipping_status, courier_code, courier_company, tracking_number, shipped_at, created_at";

export async function getSellerOrders(
  sellerUserId: string,
  limit = 50,
): Promise<SellerOrderDetail[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("created_by", sellerUserId);

  const productIds = (products ?? []).map((row) => row.id as string);
  if (productIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(sellerOrderSelect)
    .in("product_id", productIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[seller-orders] getSellerOrders:", error?.message);
    return [];
  }

  return data.map(mapSellerOrderRow);
}

export async function getSellerOrderById(
  sellerUserId: string,
  orderId: string,
): Promise<SellerOrderDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`${sellerOrderSelect}, products!inner(created_by)`)
    .eq("id", orderId)
    .eq("products.created_by", sellerUserId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapSellerOrderRow(data as Record<string, unknown>);
}

function mapSellerOrderRow(row: Record<string, unknown>): SellerOrderDetail {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    productId: row.product_id as string,
    productName: row.product_name as string,
    quantity: (row.quantity as number) ?? 1,
    orderStatus: row.order_status as string,
    paymentStatus: row.payment_status as string,
    shippingStatus: row.shipping_status as string,
    courierCode: (row.courier_code as string | null) ?? null,
    courierCompany: (row.courier_company as string | null) ?? null,
    trackingNumber: (row.tracking_number as string | null) ?? null,
    shippedAt: (row.shipped_at as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

export function canSellerRegisterTracking(order: SellerOrderDetail): boolean {
  if (order.paymentStatus !== "paid") {
    return false;
  }

  return order.shippingStatus === "preparing" || order.shippingStatus === "none";
}

export async function registerSellerTrackingNumber(input: {
  sellerUserId: string;
  orderId: string;
  courierCode: string;
  trackingNumber: string;
}): Promise<{ success: boolean; error?: string }> {
  const courier = getCourierByCode(input.courierCode);
  if (!courier) {
    return { success: false, error: "unsupported_courier" };
  }

  const trackingNumber = input.trackingNumber.trim();
  if (!trackingNumber) {
    return { success: false, error: "invalid_tracking" };
  }

  const order = await getSellerOrderById(input.sellerUserId, input.orderId);
  if (!order) {
    return { success: false, error: "not_found" };
  }

  if (!canSellerRegisterTracking(order)) {
    return { success: false, error: "invalid_status" };
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const shippedAt = new Date().toISOString();
  const { error } = await supabase
    .from("orders")
    .update({
      courier_code: courier.code,
      courier_company: courier.name,
      tracking_company: courier.name,
      tracking_number: trackingNumber,
      shipping_status: "shipped",
      shipped_at: shippedAt,
    })
    .eq("id", input.orderId);

  if (error) {
    console.error("[seller-orders] registerTracking:", error.message);
    return { success: false, error: "save_failed" };
  }

  await notifyShippingStarted({
    userId: order.userId,
    productName: order.productName,
    courierCompany: courier.name,
  });

  return { success: true };
}
