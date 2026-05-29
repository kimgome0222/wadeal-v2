"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckoutAddressSection } from "@/components/checkout-address-section";
import { CheckoutCompleteButton } from "@/components/checkout-complete-button";
import type { UserAddress } from "@/lib/addresses/types";
import {
  CheckoutPaymentFlowPicker,
  DEFAULT_GROUPBUY_PAYMENT_FLOW,
} from "@/components/checkout-payment-flow-picker";
import { CheckoutPaymentMethodPicker } from "@/components/checkout-payment-method-picker";
import { UserConsentForm } from "@/components/user-consent-form";
import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import type { PaymentMethod } from "@/lib/payments/payment-methods";
import type { PaymentFlow } from "@/lib/payments/payment-flow";
import type { ProductType } from "@/lib/products/product-type";
import { isNormalProduct } from "@/lib/products/product-type";
import type { ProductShippingProfile } from "@/lib/shipping/types";

type CheckoutConsentSectionProps = {
  dealSlug: string;
  productName: string;
  joinedPrice: number;
  subtotalAmount: number;
  currentMembers: number;
  targetMembers: number;
  quantity: number;
  disabled: boolean;
  initialHasConsents: boolean;
  productType: ProductType;
  productShipping: ProductShippingProfile;
  addresses: UserAddress[];
  defaultAddressId: string | null;
  savedCards?: SavedPaymentMethodSummary[];
  paymentHref?: string;
  couponCode?: string | null;
  pointAmount?: number;
  onShippingFeeChange?: (shippingFee: number) => void;
};

export function CheckoutConsentSection({
  dealSlug,
  productName,
  joinedPrice,
  subtotalAmount,
  currentMembers,
  targetMembers,
  quantity,
  disabled,
  initialHasConsents,
  productType,
  productShipping,
  addresses,
  defaultAddressId,
  savedCards = [],
  paymentHref = "/mypage/payment/new",
  couponCode = null,
  pointAmount = 0,
  onShippingFeeChange,
}: CheckoutConsentSectionProps) {
  const router = useRouter();
  const [hasConsents, setHasConsents] = useState(initialHasConsents);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
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

  if (!hasConsents) {
    return (
      <div className="space-y-3">
        <UserConsentForm
          onSaved={() => {
            setHasConsents(true);
            router.refresh();
          }}
          showSubmit
          submitLabel={isNormal ? "동의하고 결제하기" : "동의하고 구매하기"}
        />
      </div>
    );
  }

  const autoPayBlocked =
    isAutoPay &&
    (savedCards.filter((card) => card.status === "active").length === 0 || !selectedCardId);

  const addressBlocked = disabled || !addressId;

  return (
    <div className="space-y-3">
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
        <CheckoutPaymentMethodPicker
          disabled={disabled}
          onChange={setPaymentMethod}
          value={paymentMethod}
        />
      : null}
      <CheckoutCompleteButton
        addressId={addressId}
        couponCode={couponCode}
        currentMembers={currentMembers}
        dealSlug={dealSlug}
        deliveryMemo={deliveryMemo}
        disabled={addressBlocked || paymentMethod == null || autoPayBlocked}
        joinedPrice={joinedPrice}
        paymentFlow={isNormal ? "instant" : paymentFlow}
        paymentMethod={paymentMethod ?? (isAutoPay ? "card" : null)}
        pointAmount={pointAmount}
        productName={productName}
        productType={productType}
        quantity={quantity}
        savedPaymentMethodId={isAutoPay ? selectedCardId : null}
        targetMembers={targetMembers}
      />
    </div>
  );
}
