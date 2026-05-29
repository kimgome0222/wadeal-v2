import type { CategorySlug } from "@/lib/categories";
import type { DealSectionCategory } from "@/lib/deals";

export type DealStatus = "draft" | "active" | "closed" | "cancelled";

export type SupplierStatus = "active" | "paused" | "terminated";
export type SettlementStatus = "pending" | "confirmed" | "paid" | "cancelled";

export type SupplierRow = {
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

export type SettlementRow = {
  id: string;
  supplier_id: string;
  deal_id: string;
  product_id: string;
  total_sales_amount: number;
  commission_rate: number;
  commission_amount: number;
  settlement_amount: number;
  status: SettlementStatus;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductApprovalStatus = "draft" | "pending_review" | "approved" | "rejected";

export type ProductRow = {
  id: string;
  slug: string;
  legacy_id: number | null;
  name: string;
  category: string;
  category_id: string | null;
  category_tags: CategorySlug[];
  brand_name: string | null;
  keywords: string[];
  image_url: string | null;
  detail_image_urls: string[];
  original_price: number;
  sale_price: number | null;
  short_description: string | null;
  stock_quantity: number | null;
  sold_quantity: number;
  min_order_quantity: number;
  max_order_quantity: number;
  per_user_limit: number | null;
  is_sold_out: boolean;
  sold_out_at: string | null;
  status: string;
  description: string | null;
  is_active: boolean;
  supplier_id: string | null;
  created_by: string | null;
  approval_status: ProductApprovalStatus;
  rejected_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  product_type: string;
  shipping_fee: number;
  free_shipping_threshold: number | null;
  shipping_type: string;
  is_free_shipping: boolean;
  remote_area_extra_fee: number;
  created_at: string;
};

export type GroupBuyDealRow = {
  id: string;
  product_id: string;
  title: string;
  section: DealSectionCategory;
  current_participants: number;
  target_participants: number;
  target_quantity: number | null;
  current_quantity: number;
  max_quantity: number | null;
  group_price: number;
  lowest_price: number;
  price_tiers?: unknown;
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

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type SearchLogRow = {
  id: string;
  user_id: string | null;
  query: string;
  result_count: number;
  created_at: string;
};

export type RecentViewRow = {
  id: string;
  user_id: string;
  product_id: string;
  viewed_at: string;
};

export type JoinCartRow = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  estimated_unit_price: number;
  created_at: string;
  updated_at: string;
};

export type ProfileUsernameRow = {
  user_id: string;
  username: string;
  created_at: string;
};

export type FeaturedSearchTermRow = {
  id: string;
  query: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SellerProductRequestRow = {
  id: string;
  seller_id: string;
  requested_by: string;
  product_name: string;
  category_id: string | null;
  description: string | null;
  image_urls: string[];
  original_price: number | null;
  group_price: number | null;
  target_participants: number | null;
  ends_at: string | null;
  status: string;
  rejected_reason: string | null;
  approved_product_id: string | null;
  approved_deal_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
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
      recent_views: {
        Row: RecentViewRow;
        Insert: Omit<RecentViewRow, "id" | "viewed_at"> & {
          id?: string;
          viewed_at?: string;
        };
        Update: Partial<RecentViewRow>;
        Relationships: [];
      };
      join_cart: {
        Row: JoinCartRow;
        Insert: Omit<JoinCartRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<JoinCartRow>;
        Relationships: [];
      };
      profile_usernames: {
        Row: ProfileUsernameRow;
        Insert: Omit<ProfileUsernameRow, "created_at"> & {
          created_at?: string;
        };
        Update: Partial<ProfileUsernameRow>;
        Relationships: [];
      };
      featured_search_terms: {
        Row: FeaturedSearchTermRow;
        Insert: Omit<FeaturedSearchTermRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<FeaturedSearchTermRow>;
        Relationships: [];
      };
      seller_product_requests: {
        Row: SellerProductRequestRow;
        Insert: Omit<
          SellerProductRequestRow,
          "id" | "created_at" | "updated_at" | "reviewed_at" | "reviewed_by" | "approved_product_id" | "approved_deal_id" | "rejected_reason"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          rejected_reason?: string | null;
        };
        Update: Partial<SellerProductRequestRow>;
        Relationships: [];
      };
      suppliers: {
        Row: SupplierRow;
        Insert: Omit<SupplierRow, "id" | "created_at" | "updated_at" | "status" | "commission_rate"> & {
          id?: string;
          status?: SupplierStatus;
          commission_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SupplierRow>;
        Relationships: [];
      };
      settlements: {
        Row: SettlementRow;
        Insert: Omit<
          SettlementRow,
          "id" | "created_at" | "updated_at" | "status" | "settled_at" | "total_sales_amount" | "commission_rate" | "commission_amount" | "settlement_amount"
        > & {
          id?: string;
          total_sales_amount?: number;
          commission_rate?: number;
          commission_amount?: number;
          settlement_amount?: number;
          status?: SettlementStatus;
          settled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SettlementRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      search_logs: {
        Row: SearchLogRow;
        Insert: Omit<SearchLogRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SearchLogRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_popular_search_terms: {
        Args: { limit_count?: number };
        Returns: { query: string; search_count: number }[];
      };
    };
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
