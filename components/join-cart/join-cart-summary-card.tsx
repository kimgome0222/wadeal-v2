import { currency } from "@/lib/deals";

type JoinCartSummaryCardProps = {
  productSubtotal: number;
  couponDiscount: number;
  shippingFee: number;
  totalAmount: number;
};

/** 장바구니 총 결제 금액 카드 */
export function JoinCartSummaryCard({
  productSubtotal,
  couponDiscount,
  shippingFee,
  totalAmount,
}: JoinCartSummaryCardProps) {
  return (
    <section
      aria-label="결제 금액 요약"
      className="rounded-[20px] border border-[#E8ECEA] bg-white p-5"
    >
      <dl className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-[14px]">
          <dt className="text-[#666666]">상품금액</dt>
          <dd className="tabular-nums text-[#111111]">{currency.format(productSubtotal)}원</dd>
        </div>
        <div className="flex items-center justify-between gap-3 text-[14px]">
          <dt className="text-[#666666]">할인금액</dt>
          <dd className="tabular-nums text-[#111111]">0원</dd>
        </div>
        {couponDiscount > 0 ?
          <div className="flex items-center justify-between gap-3 text-[14px]">
            <dt className="text-[#E28A3B]">쿠폰할인</dt>
            <dd className="tabular-nums font-semibold text-[#E28A3B]">
              -{currency.format(couponDiscount)}원
            </dd>
          </div>
        : null}
        <div className="flex items-center justify-between gap-3 text-[14px]">
          <dt className="text-[#666666]">배송비</dt>
          <dd className="tabular-nums text-[#111111]">{currency.format(shippingFee)}원</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#E8ECEA] pt-3">
          <dt className="text-[18px] font-bold text-[#111111]">최종 결제금액</dt>
          <dd className="text-[18px] font-bold tabular-nums text-[#111111]">
            {currency.format(totalAmount)}원
          </dd>
        </div>
      </dl>
    </section>
  );
}
