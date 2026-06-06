"use client";

import { useCallback, useMemo, useState } from "react";

import { CheckoutPaymentFooter } from "@/components/celloh-pay/checkout-payment-footer";
import {
  CheckoutConsentSection,
  type CheckoutFlowState,
} from "@/components/checkout-consent-section";
import { CheckoutDiscountSection } from "@/components/checkout-discount-section";
import { CheckoutOrdererSection } from "@/components/checkout-orderer-section";
import { CheckoutShippingSummary } from "@/components/checkout-shipping-summary";
import { TierCouponBanner } from "@/components/coupon/tier-coupon-banner";
import { TierCouponFillRail } from "@/components/coupon/tier-coupon-fill-rail";
import type { UserAddress } from "@/lib/addresses/types";
import { getTierCouponDiscount } from "@/lib/coupon/tier-coupon";
import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import type { UserProfile } from "@/lib/profile/types";
import type { SavedPaymentData } from "@/lib/mock-storage";
import type { OrderDiscountBreakdown } from "@/lib/discounts/types";
import { currency } from "@/lib/deals";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import { calculateShippingFee } from "@/lib/shipping/calculate-shipping-fee";
import type { ProductShippingProfile } from "@/lib/shipping/types";
import type { ProductType } from "@/lib/products/product-type";
import type { Deal } from "@/lib/deals";

type CheckoutOrderShellProps = {
  dealSlug: string;
  productName: string;
  unitPrice: number;
  subtotalAmount: number;
  quantity: number;
  currentMembers: number;
  targetMembers: number;
  productType: ProductType;
  isNormal: boolean;
  allTiersAchieved: boolean;
  lowestPrice: number;
  applicablePrice: number;
  participants: number;
  missingAddress: boolean;
  initialHasConsents: boolean;
  addresses: UserAddress[];
  defaultAddressId: string | null;
  productShipping: ProductShippingProfile;
  savedCards: SavedPaymentMethodSummary[];
  paymentHref: string;
  payment: SavedPaymentData | null;
  profileHref: string;
  ordererProfile: UserProfile | null;
  missingOrdererInfo: boolean;
  missingPhoneVerification?: boolean;
  phoneVerificationRequired?: boolean;
  catalog?: Deal[];
};

export function CheckoutOrderShell({
  dealSlug,
  productName,
  unitPrice,
  subtotalAmount,
  quantity,
  currentMembers,
  targetMembers,
  productType,
  isNormal,
  missingAddress,
  initialHasConsents,
  addresses,
  defaultAddressId,
  productShipping,
  savedCards,
  paymentHref,
  profileHref,
  ordererProfile,
  missingOrdererInfo,
  missingPhoneVerification = false,
  phoneVerificationRequired = true,
  catalog = [],
}: CheckoutOrderShellProps) {
  const [breakdown, setBreakdown] = useState<OrderDiscountBreakdown | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [flowState, setFlowState] = useState<CheckoutFlowState | null>(null);

  const defaultAddress = useMemo(
    () =>
      addresses.find((address) => address.id === defaultAddressId) ??
      addresses.find((address) => address.isDefault) ??
      addresses[0] ??
      null,
    [addresses, defaultAddressId],
  );

  const shippingPreview = useMemo(() => {
    if (!defaultAddress) {
      return calculateShippingFee({
        product: productShipping,
        subtotal: subtotalAmount,
        quantity,
        address: null,
      });
    }

    return calculateShippingFee({
      product: productShipping,
      subtotal: subtotalAmount,
      quantity,
      address: {
        postalCode: defaultAddress.postalCode,
        isRemoteArea: defaultAddress.isRemoteArea,
      },
    });
  }, [defaultAddress, productShipping, quantity, subtotalAmount]);

  const effectiveShippingFee = shippingFee > 0 ? shippingFee : shippingPreview.totalShippingFee;
  const tierCouponDiscount = getTierCouponDiscount(subtotalAmount);

  const handleBreakdownChange = useCallback((next: OrderDiscountBreakdown | null) => {
    setBreakdown(next);
  }, []);

  const handleCheckoutStateChange = useCallback((state: CheckoutFlowState) => {
    setFlowState(state);
  }, []);

  const productOnlyTotal = breakdown ?
    Math.max(0, breakdown.finalPaymentAmount - breakdown.shippingFee)
  : subtotalAmount;
  const baseFinalTotal = breakdown?.finalPaymentAmount ?? subtotalAmount + effectiveShippingFee;
  const finalTotal = Math.max(0, baseFinalTotal - tierCouponDiscount);
  const couponCode = breakdown?.couponCode ?? null;
  const pointAmount = breakdown?.pointDiscountAmount ?? 0;

  const footerDisabled =
    missingAddress ||
    missingOrdererInfo ||
    !flowState?.hasConsents ||
    Boolean(flowState?.addressBlocked) ||
    Boolean(flowState?.autoPayBlocked) ||
    (flowState?.paymentMode === "standard" && flowState.paymentMethod == null);

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111111]">배송비</h2>
        <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
          <CheckoutShippingSummary
            finalPaymentAmount={subtotalAmount + effectiveShippingFee}
            product={productShipping}
            shipping={shippingPreview}
            showFreeShippingHint
            subtotalAmount={subtotalAmount}
          />
        </article>
      </section>

      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111111]">주문자 정보</h2>
        <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
          <CheckoutOrdererSection
            missingOrdererInfo={missingOrdererInfo}
            missingPhoneVerification={missingPhoneVerification}
            phoneVerificationRequired={phoneVerificationRequired}
            profile={ordererProfile}
            profileHref={profileHref}
          />
        </article>
      </section>

      <TierCouponBanner className="mx-0" subtotal={subtotalAmount} />

      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111111]">쿠폰 · 셀로캐시</h2>
        <CheckoutDiscountSection
          disabled={missingAddress || missingOrdererInfo}
          onBreakdownChange={handleBreakdownChange}
          shippingFee={effectiveShippingFee}
          subtotalAmount={subtotalAmount}
        />
      </section>

      {catalog.length > 0 ?
        <TierCouponFillRail
          catalog={catalog}
          excludeSlugs={[dealSlug]}
          subtotal={subtotalAmount}
        />
      : null}

      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111111]">최종 결제금액</h2>
        <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] text-[#666666]">
              {isNormal ? "결제예정금액" : "결제 예정 총액"}
            </span>
            <span className="text-[22px] font-bold tabular-nums text-[#111111]">
              {currency.format(finalTotal)}원
            </span>
          </div>
          {tierCouponDiscount > 0 ?
            <p className="mt-2 text-[12px] font-semibold text-[#E28A3B]">
              자동 쿠폰 -{currency.format(tierCouponDiscount)}원 적용
            </p>
          : null}
          {breakdown && (breakdown.couponDiscountAmount > 0 || breakdown.pointDiscountAmount > 0) ?
            <p className="mt-2 text-[12px] text-[#666666]">
              상품 {currency.format(productOnlyTotal)}원 + 배송{" "}
              {currency.format(breakdown.shippingFee)}원
            </p>
          : (
            <p className="mt-2 text-[12px] text-[#666666]">
              상품 {currency.format(subtotalAmount)}원 + 배송{" "}
              {currency.format(effectiveShippingFee)}원
            </p>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-[#666666]">
            {isNormal ?
              getVirtualAccountDepositNotice()
            : <>구매 시점 예상가 기준이며, 판매 종료 후 확정된 최종 금액으로 결제가 진행돼요.</>}
          </p>
        </article>
      </section>

      <section className="space-y-4 border-t border-[#E8ECEA] pt-8 pb-[calc(140px+env(safe-area-inset-bottom))]">
        <CheckoutConsentSection
          addresses={addresses}
          defaultAddressId={defaultAddressId}
          disabled={missingAddress || missingOrdererInfo}
          initialHasConsents={initialHasConsents}
          onCheckoutStateChange={handleCheckoutStateChange}
          onShippingFeeChange={setShippingFee}
          paymentHref={paymentHref}
          productShipping={productShipping}
          productType={productType}
          quantity={quantity}
          savedCards={savedCards}
          subtotalAmount={subtotalAmount}
        />
      </section>

      {flowState?.hasConsents ?
        <CheckoutPaymentFooter
          addressId={flowState.addressId}
          addressSummary={flowState.addressSummary}
          couponCode={couponCode}
          currentMembers={currentMembers}
          dealSlug={dealSlug}
          deliveryMemo={flowState.deliveryMemo}
          disabled={footerDisabled}
          finalTotal={finalTotal}
          joinedPrice={unitPrice}
          paymentFlow={flowState.paymentFlow}
          paymentMethod={flowState.paymentMethod}
          paymentMode={flowState.paymentMode}
          pointAmount={pointAmount}
          productName={productName}
          productType={productType}
          quantity={quantity}
          savedPaymentMethodId={flowState.selectedCardId}
          targetMembers={targetMembers}
        />
      : null}
    </>
  );
}
