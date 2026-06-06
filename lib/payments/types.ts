import type { PaymentRecordStatus } from "@/lib/payments/payment-status";

export type OrderPaymentInfo = {
  id: string;
  orderId: string;
  status: PaymentRecordStatus;
  statusLabel: string;
  requestedAmount: number;
  confirmedAmount: number | null;
  joinedEstimateAmount: number | null;
  amountDelta: number | null;
  method: string | null;
  paymentFlow: string | null;
  autoChargeAttemptedAt: string | null;
  paymentProvider: string | null;
  paymentKey: string | null;
  approvedAt: string | null;
  approvedAtLabel: string | null;
  failedAt: string | null;
  failedAtLabel: string | null;
  cancelledAt: string | null;
  cancelledAtLabel: string | null;
  createdAt: string;
};
