import { getSellerByUserId } from "@/lib/data/sellers";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type ProductSellerContext = {
  sellerId: string;
  sellerUserId: string;
  productName: string;
  productUuid: string | null;
};

export async function resolveProductSellerContext(
  productRef: string,
): Promise<ProductSellerContext | null> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return null;
  }

  const trimmed = productRef.trim();
  if (!trimmed) {
    return null;
  }

  const { data } = await supabase
    .from("products")
    .select("id, name, created_by")
    .or(`id.eq.${trimmed},slug.eq.${trimmed}`)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const sellerUserId = (data as { created_by: string | null }).created_by;
  if (!sellerUserId) {
    return null;
  }

  const seller = await getSellerByUserId(sellerUserId);
  if (!seller) {
    return null;
  }

  return {
    sellerId: seller.id,
    sellerUserId,
    productName: (data as { name: string }).name,
    productUuid: (data as { id: string }).id,
  };
}
