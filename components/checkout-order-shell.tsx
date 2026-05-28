"use client";

import { useCallback, useMemo, useState } from "react";

import { CheckoutConsentSection } from "@/components/checkout-consent-section";
import { CheckoutDiscountSection } from "@/components/checkout-discount-section";
import { CheckoutOrdererSection } from "@/components/checkout-orderer-section";
import { CheckoutShippingSummary } from "@/components/checkout-shipping-summary";
import type { UserAddress } from "@/lib/addresses/types";
import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import type { UserProfile } from "@/lib/profile/types";
import type { SavedPaymentData } from "@/lib/mock-storage";
import type { OrderDiscountBreakdown } from "@/lib/discounts/types";
import { currency } from "@/lib/deals";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import { calculateShippingFee } from "@/lib/shipping/calculate-shipping-fee";
import type { ProductShippingProfile } from "@/lib/shipping/types";
import type { ProductType } from "@/lib/products/product-type";
import { ui } from "@/lib/ui";

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
  allTiersAchieved,
  lowestPrice,
  applicablePrice,
  participants,
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
}: CheckoutOrderShellProps) {
  const [breakdown, setBreakdown] = useState<OrderDiscountBreakdown | null>(null);
  const [shippingFee, setShippingFee] = useState(0);

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

  const handleBreakdownChange = useCallback((next: OrderDiscountBreakdown | null) => {
    setBreakdown(next);
  }, []);

  const productOnlyTotal = breakdown ?
    Math.max(
      0,
      breakdown.finalPaymentAmount - breakdown.shippingFee,
    )
  : subtotalAmount;
  const finalTotal = breakdown?.finalPaymentAmount ?? subtotalAmount + effectiveShippingFee;
  const couponCode = breakdown?.couponCode ?? null;
  const pointAmount = breakdown?.pointDiscountAmount ?? 0;

  return (
    <>
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className={ui.sectionTitle}>{isNormal ? "결제 금액" : "가격 안내"}</h2>
        <dl className="mt-3 space-y-3 text-xs font-bold text-wadeal-muted">
          <div className="flex items-start justify-between gap-3">
            <dt>{isNormal ? "판매가" : "현재 예상 단가"}</dt>
            <dd className="text-right">
              <span className="block text-lg font-black text-wadeal-red">
                {currency.format(unitPrice)}원
              </span>
              {!isNormal ?
                <span className="mt-0.5 block text-[10px] font-bold text-wadeal-muted">
                  현재 {participants}개 기준
                </span>
              : null}
            </dd>
          </div>
          {!isNormal && !allTiersAchieved && lowestPrice < applicablePrice ?
            <div className="flex justify-between gap-3 border-t border-wadeal-line pt-3">
              <dt>최저 달성 가능가</dt>
              <dd className="font-black text-wadeal-ink">
                {currency.format(lowestPrice)}원
              </dd>
            </div>
          : null}
          {isNormal ?
            <div className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-[11px] leading-relaxed">
              선택한 결제 수단으로{" "}
              <span className="font-black text-wadeal-ink">즉시 결제</span>가 진행돼요. 가상계좌
              선택 시 입금 확인 후 배송 준비가 시작돼요.
            </div>
          : <div className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-[11px] leading-relaxed">
              <span className="font-black text-wadeal-ink">최종 확정 금액</span>은 공동구매
              마감 시점의 누적 참여 수량으로 결정돼요. 마감 전까지 참여가 늘면{" "}
              <span className="text-wadeal-red">더 낮은 가격</span>이 적용될 수 있어요.
            </div>
          }
        </dl>
      </article>

      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className={ui.sectionTitle}>배송비 안내</h2>
        <CheckoutShippingSummary
          finalPaymentAmount={subtotalAmount + effectiveShippingFee}
          product={productShipping}
          shipping={shippingPreview}
          showFreeShippingHint
          subtotalAmount={subtotalAmount}
        />
        <p className="mt-2 text-[10px] font-bold text-wadeal-muted">
          배송비는 서버에서 주소·상품 정보로 다시 계산해요.
        </p>
      </article>

      <CheckoutOrdererSection
        missingOrdererInfo={missingOrdererInfo}
        profile={ordererProfile}
        profileHref={profileHref}
      />

      <CheckoutDiscountSection
        disabled={missingAddress || missingOrdererInfo}
        onBreakdownChange={handleBreakdownChange}
        shippingFee={effectiveShippingFee}
        subtotalAmount={subtotalAmount}
      />

      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-extrabold text-wadeal-muted">
            {isNormal ? "결제 총액" : "결제 예정 총액"}
          </span>
          <span className="text-xl font-black text-wadeal-ink">
            {currency.format(finalTotal)}원
          </span>
        </div>
        {breakdown && (breakdown.couponDiscountAmount > 0 || breakdown.pointDiscountAmount > 0) ?
          <p className="mt-1 text-[10px] font-bold text-wadeal-muted">
            상품 {currency.format(productOnlyTotal)}원 + 배송{" "}
            {currency.format(breakdown.shippingFee)}원 (할인·배송비 서버 재검증)
          </p>
        : (
          <p className="mt-1 text-[10px] font-bold text-wadeal-muted">
            상품 {currency.format(subtotalAmount)}원 + 배송{" "}
            {currency.format(effectiveShippingFee)}원
          </p>
        )}
        <p className="mt-3 text-xs font-bold leading-relaxed text-wadeal-muted">
          {isNormal ?
            getVirtualAccountDepositNotice()
          : <>
              참여 시점 예상가 기준이며, 공동구매 마감 후 확정된 최종 금액으로 결제가
              진행돼요. 실제 PG 결제는 마감·가격 확정 이후에 이뤄집니다.
            </>
          }
        </p>
      </article>

      <div className={ui.stickyFooter}>
        <CheckoutConsentSection
          addresses={addresses}
          couponCode={couponCode}
          currentMembers={currentMembers}
          dealSlug={dealSlug}
          defaultAddressId={defaultAddressId}
          disabled={missingAddress || missingOrdererInfo}
          initialHasConsents={initialHasConsents}
          joinedPrice={unitPrice}
          onShippingFeeChange={setShippingFee}
          paymentHref={paymentHref}
          pointAmount={pointAmount}
          productName={productName}
          productShipping={productShipping}
          productType={productType}
          quantity={quantity}
          savedCards={savedCards}
          subtotalAmount={subtotalAmount}
          targetMembers={targetMembers}
        />
      </div>
    </>
  );
}
