"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckoutAddressSection } from "@/components/checkout-address-section";
import {
  CellohPaySection,
  type CheckoutPaymentMode,
} from "@/components/celloh-pay/celloh-pay-section";
import { CheckoutPaymentFlowPicker, DEFAULT_GROUPBUY_PAYMENT_FLOW } from "@/components/checkout-payment-flow-picker";
import { CheckoutPaymentMethodPicker } from "@/components/checkout-payment-method-picker";
import { UserConsentForm } from "@/components/user-consent-form";
import { PaymentPolicyNotice } from "@/components/checkout/payment-policy-notice";
import type { UserAddress } from "@/lib/addresses/types";
import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import type { PaymentMethod } from "@/lib/payments/payment-methods";
import type { PaymentFlow } from "@/lib/payments/payment-flow";
import type { ProductType } from "@/lib/products/product-type";
import { isNormalProduct } from "@/lib/products/product-type";
import type { ProductShippingProfile } from "@/lib/shipping/types";

type CheckoutConsentSectionProps = {
  subtotalAmount: number;
  quantity: number;
  disabled: boolean;
  initialHasConsents: boolean;
  productType: ProductType;
  productShipping: ProductShippingProfile;
  addresses: UserAddress[];
  defaultAddressId: string | null;
  savedCards?: SavedPaymentMethodSummary[];
  paymentHref?: string;
  onShippingFeeChange?: (shippingFee: number) => void;
  onCheckoutStateChange?: (state: CheckoutFlowState) => void;
};

export type CheckoutFlowState = {
  addressId: string | null;
  deliveryMemo: string;
  addressSummary: string;
  paymentMethod: PaymentMethod | null;
  paymentMode: CheckoutPaymentMode;
  paymentFlow: PaymentFlow;
  selectedCardId: string | null;
  hasConsents: boolean;
  autoPayBlocked: boolean;
  addressBlocked: boolean;
};

function formatAddressSummary(address: UserAddress | null): string {
  if (!address) {
    return "등록된 배송지";
  }
  const line2 = address.addressLine2?.trim();
  return [address.recipientName, address.addressLine1, line2].filter(Boolean).join(" · ");
}

export function CheckoutConsentSection({
  subtotalAmount,
  quantity,
  disabled,
  initialHasConsents,
  productType,
  productShipping,
  addresses,
  defaultAddressId,
  savedCards = [],
  paymentHref = "/mypage/payment/new",
  onShippingFeeChange,
  onCheckoutStateChange,
}: CheckoutConsentSectionProps) {
  const router = useRouter();
  const [hasConsents, setHasConsents] = useState(initialHasConsents);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMode, setPaymentMode] = useState<CheckoutPaymentMode>("standard");
  const [paymentFlow, setPaymentFlow] = useState<PaymentFlow>(DEFAULT_GROUPBUY_PAYMENT_FLOW);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(defaultAddressId);
  const [deliveryMemo, setDeliveryMemo] = useState("");
  const isNormal = isNormalProduct(productType);
  const isAutoPay = !isNormal && paymentFlow === "post_deadline_auto";

  useEffect(() => {
    const defaultCard =
      savedCards.find((card) => card.isDefault && card.status === "active") ??
      savedCards.find((card) => card.status === "active") ??
      null;
    setSelectedCardId(defaultCard?.id ?? null);
  }, [savedCards]);

  useEffect(() => {
    if (isAutoPay && paymentMethod !== "card") {
      setPaymentMethod("card");
    }
  }, [isAutoPay, paymentMethod]);

  const autoPayBlocked =
    isAutoPay &&
    (savedCards.filter((card) => card.status === "active").length === 0 || !selectedCardId);

  const addressBlocked = disabled || !addressId;
  const selectedAddress =
    addresses.find((address) => address.id === addressId) ??
    addresses.find((address) => address.id === defaultAddressId) ??
    addresses[0] ??
    null;

  useEffect(() => {
    onCheckoutStateChange?.({
      addressId,
      deliveryMemo,
      addressSummary: formatAddressSummary(selectedAddress),
      paymentMethod,
      paymentMode,
      paymentFlow: isNormal ? "instant" : paymentFlow,
      selectedCardId,
      hasConsents,
      autoPayBlocked,
      addressBlocked,
    });
  }, [
    addressBlocked,
    addressId,
    autoPayBlocked,
    deliveryMemo,
    hasConsents,
    isNormal,
    onCheckoutStateChange,
    paymentFlow,
    paymentMethod,
    paymentMode,
    selectedAddress,
    selectedCardId,
  ]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111111]">배송지</h2>
        <CheckoutAddressSection
          addresses={addresses}
          defaultAddressId={defaultAddressId}
          onSelectionChange={(selection) => {
            setAddressId(selection.addressId);
            setDeliveryMemo(selection.deliveryMemo);
            onShippingFeeChange?.(selection.shippingFee);
          }}
          productShipping={productShipping}
          quantity={quantity}
          subtotalAmount={subtotalAmount}
        />
      </section>

      {!isNormal ?
        <CheckoutPaymentFlowPicker
          disabled={disabled}
          onChange={setPaymentFlow}
          onSelectCard={setSelectedCardId}
          paymentHref={paymentHref}
          savedCards={savedCards}
          selectedCardId={selectedCardId}
          value={paymentFlow}
        />
      : null}

      {!isAutoPay ?
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#111111]">결제수단</h2>
          <CheckoutPaymentMethodPicker
            disabled={disabled}
            onChange={(method) => {
              setPaymentMode("standard");
              setPaymentMethod(method);
            }}
            value={paymentMode === "standard" ? paymentMethod : null}
          />
        </section>
      : null}

      {!isAutoPay ?
        <CellohPaySection
          disabled={disabled}
          onSelect={() => {
            setPaymentMode("celloh_pay");
            setPaymentMethod("card");
          }}
          selected={paymentMode === "celloh_pay"}
        />
      : null}

      {!hasConsents ?
        <section className="space-y-3">
          <h2 className="text-[18px] font-bold text-[#111111]">약관 동의</h2>
          <UserConsentForm
            onSaved={() => {
              setHasConsents(true);
              router.refresh();
            }}
            showSubmit
            submitLabel={isNormal ? "동의하고 결제하기" : "동의하고 구매하기"}
            variant="checkout"
          />
        </section>
      : null}

      <PaymentPolicyNotice />

    </div>
  );
}
