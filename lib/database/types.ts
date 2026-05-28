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

export type UserRole = "user" | "seller" | "admin";

export type AccountStatus = "active" | "withdrawal_requested" | "withdrawn" | "suspended";

export type UserRow = {
  id: string;
  kakao_id: string | null;
  email: string | null;
  nickname: string | null;
  role: UserRole;
  referral_code: string | null;
  phone: string | null;
  phone_verified_at: string | null;
  real_name: string | null;
  birth_date: string | null;
  gender: string | null;
  marketing_agreed_at: string | null;
  withdrawal_requested_at: string | null;
  account_status: AccountStatus;
  ci_hash: string | null;
  di_hash: string | null;
  created_at: string;
};

export type NotificationSettingsRow = {
  id: string;
  user_id: string;
  groupbuy_deadline: boolean;
  tier_achievement: boolean;
  order_shipping: boolean;
  marketing: boolean;
  channels: Json;
  created_at: string;
  updated_at: string;
};

export type ShareChannel = "kakao" | "copy_link" | "web_share";

export type ShareLogRow = {
  id: string;
  user_id: string | null;
  product_id: string;
  deal_id: string | null;
  channel: ShareChannel;
  referral_code: string | null;
  created_at: string;
};

export type ReferralVisitRow = {
  id: string;
  referral_code: string;
  product_id: string;
  deal_id: string | null;
  visitor_user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type SupportTicketRow = {
  id: string;
  user_id: string;
  order_id: string | null;
  product_id: string | null;
  deal_id: string | null;
  type: string;
  title: string;
  content: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type UserConsentRow = {
  id: string;
  user_id: string;
  terms_agreed_at: string | null;
  privacy_agreed_at: string | null;
  groupbuy_agreed_at: string | null;
  marketing_agreed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GroupBuyParticipantRow = {
  id: string;
  deal_id: string;
  user_id: string;
  joined_at: string;
  status: ParticipationStatus;
};

export type KakaoNotifyStatus = "pending" | "sent" | "failed" | "skipped";

export type AlertRow = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  current_price: number;
  target_price: number;
  created_at: string;
  updated_at: string;
};

export type PriceAlertRow = {
  id: string;
  deal_id: string;
  user_id: string | null;
  target_price: number | null;
  notify_at_lowest_price: boolean;
  notify_before_deadline: boolean;
  kakao_notify_status: KakaoNotifyStatus;
  created_at: string;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  address_line1: string;
  address_line2: string | null;
  postal_code: string | null;
  region: string | null;
  is_remote_area: boolean;
  delivery_memo: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
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

export type SavedPaymentMethodStatus = "active" | "inactive" | "expired" | "revoked";

export type SavedPaymentMethodRow = {
  id: string;
  user_id: string;
  provider: string;
  method: string;
  billing_key: string;
  card_company: string | null;
  card_last4: string;
  is_default: boolean;
  status: SavedPaymentMethodStatus;
  created_at: string;
  updated_at: string;
};

export type WebhookLogRow = {
  id: string;
  provider: string;
  event_type: string;
  event_id: string | null;
  payment_key: string | null;
  order_id: string | null;
  raw_payload: Json;
  processed_at: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type ErrorLogRow = {
  id: string;
  level: string;
  source: string;
  message: string;
  stack: string | null;
  user_id: string | null;
  order_id: string | null;
  payment_id: string | null;
  deal_id: string | null;
  product_id: string | null;
  metadata: Json | null;
  resolved_at: string | null;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  order_id: string;
  user_id: string;
  deal_id: string | null;
  product_id: string;
  payment_provider: string | null;
  payment_key: string | null;
  amount: number;
  requested_amount: number;
  confirmed_amount: number | null;
  status: string;
  method: string | null;
  payment_flow: string | null;
  auto_charge_attempted_at: string | null;
  approved_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
  raw_response: Json | null;
  created_at: string;
  updated_at: string;
};

export type OrderMockRow = {
  id: string;
  user_id: string;
  deal_id: string;
  amount: number;
  status: OrderMockStatus;
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  deal_id: string | null;
  joined_price: number;
  final_price: number | null;
  current_members: number;
  target_members: number;
  status: string;
  created_at: string;
  order_number: string | null;
  quantity: number;
  payment_amount: number | null;
  order_status: string;
  payment_status: string;
  shipping_status: string;
  courier_company: string | null;
  courier_code: string | null;
  tracking_company: string | null;
  tracking_number: string | null;
  tracking_last_checked_at: string | null;
  admin_memo: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  confirmed_at: string | null;
  cancel_reason: string | null;
  refund_reason: string | null;
  refund_requested_at: string | null;
  payment_method: string | null;
  product_type: string | null;
  payment_flow: string | null;
  saved_payment_method_id: string | null;
  address_id: string | null;
  shipping_recipient_name: string | null;
  shipping_phone: string | null;
  shipping_postal_code: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_delivery_memo: string | null;
  shipping_region: string | null;
  shipping_is_remote_area: boolean | null;
  shipping_fee: number | null;
  remote_area_extra_fee: number | null;
  coupon_id: string | null;
  coupon_code: string | null;
  subtotal_amount: number | null;
  coupon_discount_amount: number | null;
  point_discount_amount: number | null;
  point_amount_reserved: number | null;
  final_payment_amount: number | null;
  discount_status: string | null;
  orderer_name: string | null;
  orderer_phone: string | null;
  orderer_verification_status: string | null;
};

export type ReviewModerationStatus = "visible" | "hidden" | "reported" | "deleted";

export type ReviewRow = {
  id: string;
  user_id: string;
  order_id: string | null;
  deal_id: string | null;
  product_id: string;
  product_name: string;
  rating: number;
  content: string;
  images: string[];
  is_verified_purchase: boolean;
  status: ReviewModerationStatus;
  created_at: string;
  updated_at: string;
};

export type ReviewReportStatus = "pending" | "resolved";

export type ReviewReportRow = {
  id: string;
  review_id: string;
  user_id: string;
  reason: string;
  status: ReviewReportStatus;
  resolved_at: string | null;
  created_at: string;
};

export type ReviewLikeRow = {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
};

export type NotificationRoleTarget = "user" | "seller" | "admin";

export type NotificationRow = {
  id: string;
  user_id: string | null;
  seller_id: string | null;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  channel: string;
  target_role: NotificationRoleTarget;
  read_at: string | null;
  created_at: string;
};

export type SupplierStatus = "active" | "paused" | "terminated";
export type SellerStatus = "pending_review" | "approved" | "rejected" | "suspended";
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

export type SellerRow = {
  id: string;
  user_id: string;
  company_name: string;
  business_number: string;
  status: SellerStatus;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  created_at: string;
  updated_at: string;
};

export type SellerSettlementRecordStatus =
  | "pending_seller_confirm"
  | "seller_confirmed"
  | "confirmed"
  | "paid"
  | "cancelled";

export type SellerBillingStatus = "pending" | "pending_deduction" | "paid" | "overdue" | "cancelled";

export type SellerSettlementRecordRow = {
  id: string;
  seller_id: string;
  period_start: string;
  period_end: string;
  gross_sales_amount: number;
  platform_fee_amount: number;
  ad_deduction_amount: number;
  other_deduction_amount: number;
  net_payout_amount: number;
  status: SellerSettlementRecordStatus;
  seller_confirmed_at: string | null;
  confirmed_at: string | null;
  paid_at: string | null;
  deposit_confirmed_at: string | null;
  receipt_reference: string | null;
  created_at: string;
  updated_at: string;
};

export type SettlementRecordItemRow = {
  id: string;
  settlement_record_id: string;
  item_type: string;
  label: string;
  amount: number;
  reference_id: string | null;
  sort_order: number;
  created_at: string;
};

export type SellerBillingRow = {
  id: string;
  seller_id: string;
  billing_type: string;
  amount: number;
  status: SellerBillingStatus;
  payment_mode: string;
  description: string | null;
  due_date: string | null;
  paid_at: string | null;
  settlement_record_id: string | null;
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

export type BusinessSettingsRow = {
  id: number;
  business_name: string | null;
  representative_name: string | null;
  business_number: string | null;
  mail_order_sales_number: string | null;
  business_address: string | null;
  customer_service_phone: string | null;
  customer_service_email: string | null;
  customer_service_hours: string | null;
  hosting_provider: string | null;
  privacy_manager_name: string | null;
  privacy_manager_email: string | null;
  bank_account_info: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = import("@/lib/types").Database & {
  public: {
    Tables: import("@/lib/types").Database["public"]["Tables"] & {
      users: {
        Row: UserRow;
        Insert: Omit<
          UserRow,
          | "id"
          | "created_at"
          | "phone"
          | "phone_verified_at"
          | "real_name"
          | "birth_date"
          | "gender"
          | "marketing_agreed_at"
          | "withdrawal_requested_at"
          | "account_status"
          | "ci_hash"
          | "di_hash"
        > & {
          id?: string;
          created_at?: string;
          phone?: string | null;
          phone_verified_at?: string | null;
          real_name?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          marketing_agreed_at?: string | null;
          withdrawal_requested_at?: string | null;
          account_status?: AccountStatus;
          ci_hash?: string | null;
          di_hash?: string | null;
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
          | "id"
          | "created_at"
          | "notify_at_lowest_price"
          | "notify_before_deadline"
          | "kakao_notify_status"
        > & {
          id?: string;
          created_at?: string;
          notify_at_lowest_price?: boolean;
          notify_before_deadline?: boolean;
          kakao_notify_status?: KakaoNotifyStatus;
        };
        Update: Partial<PriceAlertRow>;
        Relationships: [];
      };
      alerts: {
        Row: AlertRow;
        Insert: Omit<AlertRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<AlertRow>;
        Relationships: [];
      };
      addresses: {
        Row: AddressRow;
        Insert: Omit<AddressRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
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
      saved_payment_methods: {
        Row: SavedPaymentMethodRow;
        Insert: Omit<SavedPaymentMethodRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SavedPaymentMethodRow>;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: {
          id?: string;
          order_id: string;
          user_id: string;
          deal_id?: string | null;
          product_id: string;
          payment_provider?: string | null;
          payment_key?: string | null;
          amount?: number;
          requested_amount: number;
          confirmed_amount?: number | null;
          status?: string;
          method?: string | null;
          approved_at?: string | null;
          failed_at?: string | null;
          cancelled_at?: string | null;
          raw_response?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
      webhook_logs: {
        Row: WebhookLogRow;
        Insert: {
          id?: string;
          provider?: string;
          event_type: string;
          event_id?: string | null;
          payment_key?: string | null;
          order_id?: string | null;
          raw_payload: Json;
          processed_at?: string | null;
          status?: string;
          error_message?: string | null;
          created_at?: string;
        };
        Update: Partial<WebhookLogRow>;
        Relationships: [];
      };
      error_logs: {
        Row: ErrorLogRow;
        Insert: {
          id?: string;
          level: string;
          source: string;
          message: string;
          stack?: string | null;
          user_id?: string | null;
          order_id?: string | null;
          payment_id?: string | null;
          deal_id?: string | null;
          product_id?: string | null;
          metadata?: Json | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<ErrorLogRow>;
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
      orders: {
        Row: OrderRow;
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          deal_id?: string | null;
          joined_price?: number | null;
          final_price?: number | null;
          current_members?: number | null;
          target_members?: number | null;
          status?: string | null;
          created_at?: string | null;
          order_number?: string | null;
          quantity?: number;
          payment_amount?: number | null;
          order_status?: string;
          payment_status?: string;
          shipping_status?: string;
          payment_method?: string | null;
          product_type?: string | null;
          payment_flow?: string | null;
          saved_payment_method_id?: string | null;
          paid_at?: string | null;
          address_id?: string | null;
          shipping_recipient_name?: string | null;
          shipping_phone?: string | null;
          shipping_postal_code?: string | null;
          shipping_address_line1?: string | null;
          shipping_address_line2?: string | null;
          shipping_delivery_memo?: string | null;
          shipping_region?: string | null;
          shipping_is_remote_area?: boolean | null;
          shipping_fee?: number | null;
          remote_area_extra_fee?: number | null;
          coupon_id?: string | null;
          coupon_code?: string | null;
          subtotal_amount?: number | null;
          coupon_discount_amount?: number | null;
          point_discount_amount?: number | null;
          point_amount_reserved?: number | null;
          final_payment_amount?: number | null;
          discount_status?: string | null;
          orderer_name?: string | null;
          orderer_phone?: string | null;
          orderer_verification_status?: string | null;
          courier_company?: string | null;
          tracking_number?: string | null;
          admin_memo?: string | null;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_name: string;
          rating: number;
          content: string;
          created_at?: string;
        };
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      review_reports: {
        Row: ReviewReportRow;
        Insert: {
          id?: string;
          review_id: string;
          user_id: string;
          reason: string;
          status?: ReviewReportStatus;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<ReviewReportRow>;
        Relationships: [];
      };
      review_likes: {
        Row: ReviewLikeRow;
        Insert: {
          id?: string;
          review_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<ReviewLikeRow>;
        Relationships: [];
      };
      share_logs: {
        Row: ShareLogRow;
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id: string;
          deal_id?: string | null;
          channel: ShareChannel;
          referral_code?: string | null;
          created_at?: string;
        };
        Update: Partial<ShareLogRow>;
        Relationships: [];
      };
      referral_visits: {
        Row: ReferralVisitRow;
        Insert: {
          id?: string;
          referral_code: string;
          product_id: string;
          deal_id?: string | null;
          visitor_user_id?: string | null;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Partial<ReferralVisitRow>;
        Relationships: [];
      };
      support_tickets: {
        Row: SupportTicketRow;
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          product_id?: string | null;
          deal_id?: string | null;
          type: string;
          title: string;
          content: string;
          status?: string;
          admin_reply?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<SupportTicketRow>;
        Relationships: [];
      };
      user_consents: {
        Row: UserConsentRow;
        Insert: {
          id?: string;
          user_id: string;
          terms_agreed_at?: string | null;
          privacy_agreed_at?: string | null;
          groupbuy_agreed_at?: string | null;
          marketing_agreed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserConsentRow>;
        Relationships: [];
      };
      notification_settings: {
        Row: NotificationSettingsRow;
        Insert: {
          id?: string;
          user_id: string;
          groupbuy_deadline?: boolean;
          tier_achievement?: boolean;
          order_shipping?: boolean;
          marketing?: boolean;
          channels?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NotificationSettingsRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: {
          id?: string;
          user_id?: string | null;
          seller_id?: string | null;
          type: string;
          title: string;
          message: string;
          link_url?: string | null;
          channel?: string;
          target_role?: NotificationRoleTarget;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<NotificationRow>;
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
          | "id"
          | "created_at"
          | "updated_at"
          | "status"
          | "settled_at"
          | "total_sales_amount"
          | "commission_rate"
          | "commission_amount"
          | "settlement_amount"
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
      settlement_records: {
        Row: SellerSettlementRecordRow;
        Insert: Omit<SellerSettlementRecordRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SellerSettlementRecordRow>;
        Relationships: [];
      };
      settlement_record_items: {
        Row: SettlementRecordItemRow;
        Insert: Omit<SettlementRecordItemRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SettlementRecordItemRow>;
        Relationships: [];
      };
      seller_billings: {
        Row: SellerBillingRow;
        Insert: Omit<SellerBillingRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SellerBillingRow>;
        Relationships: [];
      };
      sellers: {
        Row: SellerRow;
        Insert: Omit<SellerRow, "id" | "created_at" | "updated_at" | "status"> & {
          id?: string;
          status?: SellerStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SellerRow>;
        Relationships: [];
      };
      business_settings: {
        Row: BusinessSettingsRow;
        Insert: Omit<BusinessSettingsRow, "created_at" | "updated_at"> & {
          id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<BusinessSettingsRow>;
        Relationships: [];
      };
    };
    Functions: {
      create_pending_payment_for_order: {
        Args: { p_order_id: string; p_method?: string | null };
        Returns: string;
      };
      update_payment_status: {
        Args: {
          p_payment_id: string;
          p_status: string;
          p_confirmed_amount?: number | null;
          p_payment_provider?: string | null;
          p_payment_key?: string | null;
          p_method?: string | null;
          p_raw_response?: Json | null;
        };
        Returns: boolean;
      };
      prepare_payment_after_finalize: {
        Args: { p_order_id: string; p_final_amount: number };
        Returns: boolean;
      };
      sync_order_payment_status: {
        Args: { p_order_id: string };
        Returns: string | null;
      };
      register_saved_payment_method: {
        Args: {
          p_billing_key: string;
          p_card_company?: string | null;
          p_card_last4: string;
          p_provider?: string | null;
          p_method?: string | null;
          p_set_default?: boolean | null;
        };
        Returns: string;
      };
      get_saved_payment_billing_key: {
        Args: { p_method_id: string };
        Returns: {
          billing_key: string;
          provider: string;
          method: string;
          user_id: string;
        }[];
      };
      deactivate_saved_payment_method: {
        Args: { p_method_id: string };
        Returns: boolean;
      };
      set_default_saved_payment_method: {
        Args: { p_method_id: string };
        Returns: boolean;
      };
      create_notification: {
        Args: {
          p_user_id: string;
          p_type: string;
          p_title: string;
          p_message: string;
          p_link_url?: string | null;
          p_channel?: string | null;
        };
        Returns: string;
      };
      mark_notification_read: {
        Args: { p_notification_id: string };
        Returns: boolean;
      };
      notify_deal_participants: {
        Args: {
          p_deal_id: string;
          p_type: string;
          p_title: string;
          p_message: string;
          p_link_url?: string | null;
          p_channel?: string | null;
        };
        Returns: number;
      };
      mark_phone_verified_for_user: {
        Args: Record<string, never>;
        Returns: void;
      };
      request_account_withdrawal: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_user_coupon_usages: {
        Args: { p_user_id?: string | null };
        Returns: {
          id: string;
          coupon_code: string;
          coupon_name: string;
          discount_amount: number;
          used_at: string;
        }[];
      };
      apply_coupon: {
        Args: {
          p_user_id: string;
          p_coupon_code: string;
          p_subtotal_amount: number;
          p_order_id?: string | null;
        };
        Returns: {
          coupon_id: string;
          coupon_code: string;
          coupon_name: string;
          discount_type: string;
          discount_amount: number;
          shipping_fee: number;
        }[];
      };
      reserve_points: {
        Args: { p_user_id: string; p_amount: number; p_order_id: string };
        Returns: boolean;
      };
      commit_discounts: {
        Args: { p_order_id: string };
        Returns: boolean;
      };
      rollback_discounts: {
        Args: { p_order_id: string };
        Returns: boolean;
      };
      admin_upsert_coupon: {
        Args: {
          p_id: string | null;
          p_code: string;
          p_name: string;
          p_description: string | null;
          p_discount_type: string;
          p_discount_value: number;
          p_min_order_amount: number;
          p_max_discount_amount: number | null;
          p_starts_at: string;
          p_ends_at: string | null;
          p_usage_limit: number | null;
          p_per_user_limit: number;
          p_is_active: boolean;
        };
        Returns: string;
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

export type CreateUserAlertInput = {
  productSlug: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
};

/** Prototype user id until real auth is connected. */
export const PROTOTYPE_USER_ID = "00000000-0000-4000-8000-000000000001";

export type CreateParticipationInput = {
  dealId: string;
  userId: string;
};

export type CreateOrderInput = {
  productSlug: string;
  productName: string;
  joinedPrice: number;
  currentMembers: number;
  targetMembers: number;
  quantity?: number;
  dealId?: string;
  paymentMethod?: string;
  paymentFlow?: import("@/lib/payments/payment-flow").PaymentFlow;
  savedPaymentMethodId?: string;
  productType?: string;
  addressId?: string;
  deliveryMemo?: string;
  ordererName?: string;
  ordererPhone?: string;
  ordererVerificationStatus?: string;
  couponCode?: string;
  pointAmount?: number;
};

export type CreateReviewInput = {
  productId: string;
  productName: string;
  rating: number;
  content: string;
  images?: string[];
};

export type UpdateReviewInput = {
  reviewId: string;
  productId: string;
  rating: number;
  content: string;
  images?: string[];
};

export type DeleteReviewInput = {
  reviewId: string;
  productId: string;
};

export type CreateReviewReportInput = {
  reviewId: string;
  reason: string;
};

export type { CategorySlug, DealSectionCategory };
