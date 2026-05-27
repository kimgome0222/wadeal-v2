import type { CategorySlug } from "@/lib/categories";
import type { DealSectionCategory } from "@/lib/deals";

/** App-facing user (maps to `users` when auth is wired). */
export type User = {
  id: string;
  kakaoId: string | null;
  email: string | null;
  nickname: string | null;
  createdAt: string;
};

/** Catalog product (`products`). */
export type Product = {
  id: string;
  slug: string;
  legacyId: number | null;
  name: string;
  category: string;
  categoryTags: CategorySlug[];
  imageUrl: string | null;
  originalPrice: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

/** Active group-buy listing (`group_buy_deals`). */
export type GroupBuyDeal = {
  id: string;
  productId: string;
  title: string;
  section: DealSectionCategory;
  currentParticipants: number;
  targetParticipants: number;
  groupPrice: number;
  lowestPrice: number;
  badge: string | null;
  startsAt: string | null;
  endsAt: string;
  status: "draft" | "active" | "closed" | "cancelled";
  createdAt: string;
};

/** Tiered pricing step (`price_tiers`). */
export type PriceTier = {
  id: string;
  dealId: string;
  requiredParticipants: number;
  price: number;
  tierOrder: number;
};

/** Participation row (`group_buy_participants`). */
export type GroupBuyParticipant = {
  id: string;
  dealId: string;
  userId: string;
  joinedAt: string;
  status: "active" | "cancelled" | "completed";
};

/** Price alert subscription (`price_alerts`). */
export type PriceAlert = {
  id: string;
  userId: string | null;
  dealId: string;
  targetPrice: number | null;
  notifyAtLowestPrice: boolean;
  notifyBeforeDeadline: boolean;
  createdAt: string;
};

/** Saved delivery address (`addresses`). */
export type Address = {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string;
  phone: string;
  addressLine: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
};

/** Prototype payment method (`payment_methods_mock`). */
export type PaymentMethodMock = {
  id: string;
  userId: string;
  label: string | null;
  cardLastFour: string;
  cardBrand: string | null;
  isDefault: boolean;
  createdAt: string;
};

/** Prototype order record (`orders_mock`). */
export type OrderMock = {
  id: string;
  userId: string;
  dealId: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};
