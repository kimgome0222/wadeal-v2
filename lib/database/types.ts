import type { CategorySlug } from "@/lib/categories";
import type { DealSectionCategory } from "@/lib/deals";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DealStatus = "draft" | "active" | "closed" | "cancelled";
export type ParticipationStatus = "active" | "cancelled" | "completed";
export type OrderMockStatus = "pending" | "confirmed" | "cancelled";

export type UserRow = {
  id: string;
  kakao_id: string | null;
  email: string | null;
  nickname: string | null;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  legacy_id: number | null;
  name: string;
  category: string;
  category_tags: CategorySlug[];
  image_url: string | null;
  original_price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export type GroupBuyDealRow = {
  id: string;
  product_id: string;
  title: string;
  section: DealSectionCategory;
  current_participants: number;
  target_participants: number;
  group_price: number;
  lowest_price: number;
  badge: string | null;
  starts_at: string | null;
  ends_at: string;
  status: DealStatus;
  created_at: string;
};

export type PriceTierRow = {
  id: string;
  deal_id: string;
  required_participants: number;
  price: number;
  tier_order: number;
};

export type GroupBuyParticipantRow = {
  id: string;
  deal_id: string;
  user_id: string;
  joined_at: string;
  status: ParticipationStatus;
};

export type PriceAlertRow = {
  id: string;
  deal_id: string;
  user_id: string | null;
  target_price: number | null;
  notify_at_lowest_price: boolean;
  notify_before_deadline: boolean;
  created_at: string;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
};

export type PaymentMethodMockRow = {
  id: string;
  user_id: string;
  label: string | null;
  card_last_four: string;
  card_brand: string | null;
  is_default: boolean;
  created_at: string;
};

export type OrderMockRow = {
  id: string;
  user_id: string;
  deal_id: string;
  amount: number;
  status: OrderMockStatus;
  created_at: string;
};

export type DealWithProductRow = GroupBuyDealRow & {
  products: ProductRow;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<UserRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      group_buy_deals: {
        Row: GroupBuyDealRow;
        Insert: Omit<GroupBuyDealRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<GroupBuyDealRow>;
        Relationships: [];
      };
      price_tiers: {
        Row: PriceTierRow;
        Insert: Omit<PriceTierRow, "id"> & { id?: string };
        Update: Partial<PriceTierRow>;
        Relationships: [];
      };
      group_buy_participants: {
        Row: GroupBuyParticipantRow;
        Insert: Omit<GroupBuyParticipantRow, "id" | "joined_at" | "status"> & {
          id?: string;
          joined_at?: string;
          status?: ParticipationStatus;
        };
        Update: Partial<GroupBuyParticipantRow>;
        Relationships: [];
      };
      price_alerts: {
        Row: PriceAlertRow;
        Insert: Omit<
          PriceAlertRow,
          "id" | "created_at" | "notify_at_lowest_price" | "notify_before_deadline"
        > & {
          id?: string;
          created_at?: string;
          notify_at_lowest_price?: boolean;
          notify_before_deadline?: boolean;
        };
        Update: Partial<PriceAlertRow>;
        Relationships: [];
      };
      addresses: {
        Row: AddressRow;
        Insert: Omit<AddressRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<AddressRow>;
        Relationships: [];
      };
      payment_methods_mock: {
        Row: PaymentMethodMockRow;
        Insert: Omit<PaymentMethodMockRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<PaymentMethodMockRow>;
        Relationships: [];
      };
      orders_mock: {
        Row: OrderMockRow;
        Insert: Omit<OrderMockRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OrderMockRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type PriceTier = {
  id: string;
  order: number;
  requiredParticipants: number;
  price: number;
};

export type CreatePriceAlertInput = {
  dealId: string;
  userId?: string;
  targetPrice?: number | null;
  notifyAtLowestPrice?: boolean;
  notifyBeforeDeadline?: boolean;
};

/** Prototype user id until real auth is connected. */
export const PROTOTYPE_USER_ID = "00000000-0000-4000-8000-000000000001";

export type CreateParticipationInput = {
  dealId: string;
  userId: string;
};
