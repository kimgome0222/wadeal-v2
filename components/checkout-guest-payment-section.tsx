"use client";

import { useState } from "react";

import { CheckoutPaymentMethodPicker } from "@/components/checkout-payment-method-picker";
import type { PaymentMethod } from "@/lib/payments/payment-methods";

export function CheckoutGuestPaymentSection() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>("card");

  return <CheckoutPaymentMethodPicker onChange={setPaymentMethod} value={paymentMethod} />;
}
