import type { CategorySlug } from "@/lib/categories";
import type { DealSectionCategory } from "@/lib/deals";

export type DealStatus = "draft" | "active" | "closed" | "cancelled";

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

export type SavedDealRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type DealWithProductRow = GroupBuyDealRow & {
  products: ProductRow;
};

export type Database = {
  public: {
    Tables: {
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
      saved_deals: {
        Row: SavedDealRow;
        Insert: Omit<SavedDealRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SavedDealRow>;
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
