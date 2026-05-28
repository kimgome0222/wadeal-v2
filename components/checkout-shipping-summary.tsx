import { currency } from "@/lib/deals";
import type { ShippingFeeResult } from "@/lib/shipping/types";
import type { ProductShippingProfile } from "@/lib/shipping/types";

type CheckoutShippingSummaryProps = {
  subtotalAmount: number;
  shipping: ShippingFeeResult;
  product: ProductShippingProfile;
  finalPaymentAmount: number;
  showFreeShippingHint?: boolean;
};

function shippingTypeLabel(product: ProductShippingProfile): string | null {
  if (product.isFreeShipping || product.shippingType === "free") {
    return "무료배송";
  }

  if (product.shippingType === "conditional_free" && product.freeShippingThreshold != null) {
    return `${currency.format(product.freeShippingThreshold)}원 이상 무료배송`;
  }

  return null;
}

export function CheckoutShippingSummary({
  subtotalAmount,
  shipping,
  product,
  finalPaymentAmount,
  showFreeShippingHint = true,
}: CheckoutShippingSummaryProps) {
  const conditionLabel = shippingTypeLabel(product);

  return (
    <dl className="mt-3 space-y-2 text-xs font-bold text-wadeal-muted">
      <div className="flex justify-between gap-3">
        <dt>상품 금액</dt>
        <dd className="font-black text-wadeal-ink">{currency.format(subtotalAmount)}원</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt>기본 배송비</dt>
        <dd className="font-black text-wadeal-ink">
          {shipping.isFreeShipping ? "무료" : `${currency.format(shipping.baseShippingFee)}원`}
        </dd>
      </div>
      {conditionLabel ?
        <p className="text-[10px] font-bold text-wadeal-muted">{conditionLabel}</p>
      : null}
      {showFreeShippingHint &&
      shipping.amountUntilFreeShipping > 0 &&
      product.shippingType === "conditional_free" ?
        <p className="rounded-lg bg-wadeal-surface px-3 py-2 text-[10px] font-bold leading-relaxed text-wadeal-red">
          {currency.format(shipping.amountUntilFreeShipping)}원 더 담으면 무료배송
        </p>
      : null}
      {shipping.remoteExtraFee > 0 ?
        <div className="flex justify-between gap-3">
          <dt>제주·도서산간 추가</dt>
          <dd className="font-black text-wadeal-ink">
            {currency.format(shipping.remoteExtraFee)}원
          </dd>
        </div>
      : null}
      <div className="flex justify-between gap-3 border-t border-wadeal-line pt-2">
        <dt>배송비 합계</dt>
        <dd className="font-black text-wadeal-ink">
          {shipping.totalShippingFee === 0 ?
            "무료"
          : `${currency.format(shipping.totalShippingFee)}원`}
        </dd>
      </div>
      <div className="flex justify-between gap-3 border-t border-wadeal-line pt-2">
        <dt>결제 예정 총액</dt>
        <dd className="text-base font-black text-wadeal-ink">
          {currency.format(finalPaymentAmount)}원
        </dd>
      </div>
    </dl>
  );
}
