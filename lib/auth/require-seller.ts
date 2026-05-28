import { requireApprovedSeller as requireApprovedSellerAccess } from "@/lib/auth/access";
import type { SellerRecord } from "@/lib/data/sellers";

export async function requireSeller(): Promise<SellerRecord> {
  const context = await requireApprovedSellerAccess();

  if (!context.seller) {
    throw new Error("Seller record is required.");
  }

  return context.seller;
}

export { requireApprovedSellerAccess as requireApprovedSeller };
