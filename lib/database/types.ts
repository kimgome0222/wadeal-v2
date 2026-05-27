import type { CategorySlug } from "@/lib/categories";
import type { DealSectionCategory } from "@/lib/deals";

export type {
  Database as CatalogDatabase,
  DealStatus,
  DealWithProductRow,
  GroupBuyDealRow,
  PriceTier,
  PriceTierRow,
  ProductRow,
  SavedDealRow,
} from "@/lib/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ParticipationStatus = "active" | "cancelled" | "completed";
export type OrderMockStatus = "pending" | "confirmed" | "cancelled";

export type UserRow = {
  id: string;
  kakao_id: string | null;
  email: string | null;
  nickname: string | null;
  created_at: string;
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

export type Database = import("@/lib/types").Database & {
  public: {
    Tables: import("@/lib/types").Database["public"]["Tables"] & {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<UserRow>;
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
  };
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

export type { CategorySlug, DealSectionCategory };
