export type CouponDiscountType = "fixed_amount" | "percentage" | "free_shipping";

export type PointTransactionType = "earn" | "use" | "refund" | "expire" | "adjust";

export type DiscountStatus = "none" | "reserved" | "committed" | "rolled_back";

export type CouponRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string;
  ends_at: string | null;
  usage_limit: number | null;
  per_user_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderDiscountBreakdown = {
  subtotalAmount: number;
  couponDiscountAmount: number;
  pointDiscountAmount: number;
  shippingFee: number;
  finalPaymentAmount: number;
  couponId: string | null;
  couponCode: string | null;
  couponName: string | null;
  couponDiscountType: CouponDiscountType | null;
};

export type CouponValidationError =
  | "coupon_not_found"
  | "coupon_inactive"
  | "coupon_not_started"
  | "coupon_expired"
  | "min_order_not_met"
  | "usage_limit_exceeded"
  | "per_user_limit_exceeded"
  | "coupon_already_reserved"
  | "invalid_subtotal";

export type PointValidationError = "insufficient_points" | "invalid_amount";

export type DiscountPreviewInput = {
  userId: string;
  subtotalAmount: number;
  couponCode?: string | null;
  pointAmount?: number;
  shippingFee?: number;
  orderId?: string | null;
};

export type DiscountPreviewResult =
  | { success: true; breakdown: OrderDiscountBreakdown }
  | {
      success: false;
      error: CouponValidationError | PointValidationError | "preview_failed";
      message?: string;
    };
