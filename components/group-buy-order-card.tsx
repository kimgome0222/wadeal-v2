import { currency } from "@/lib/deals";

export type GroupBuyOrderCardItem = {
  id: string;
  productName: string;
  participationPrice: number;
  joinedPrice: number;
  finalPrice: number | null;
  quantity: number;
  targetParticipants: number;
  currentParticipants: number;
  displayStatus: string;
  status: string;
};

type GroupBuyOrderCardProps = {
  order: GroupBuyOrderCardItem;
};

function statusTone(displayStatus: string) {
  if (displayStatus === "배송완료" || displayStatus === "결제완료") {
    return "text-green-600";
  }

  if (displayStatus === "취소/환불") {
    return "text-gray-500";
  }

  return "text-wadeal-red";
}

export function GroupBuyOrderCard({ order }: GroupBuyOrderCardProps) {
  const joinedLineTotal = order.joinedPrice * order.quantity;
  const priceLabel =
    order.finalPrice != null && order.finalPrice !== joinedLineTotal ?
      "확정 결제금액"
    : "참여 예상 결제금액";

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-wadeal-ink">{order.productName}</p>
        <span className={`shrink-0 text-xs font-black ${statusTone(order.displayStatus)}`}>
          {order.displayStatus}
        </span>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
        <div className="flex justify-between gap-3">
          <dt>{priceLabel}</dt>
          <dd className="font-black text-wadeal-ink">
            {currency.format(order.participationPrice)}원
          </dd>
        </div>
        {order.finalPrice == null ?
          <div className="flex justify-between gap-3">
            <dt>참여 시점 예상 단가</dt>
            <dd className="font-black text-wadeal-ink">
              {currency.format(order.joinedPrice)}원
            </dd>
          </div>
        : null}
        <div className="flex justify-between gap-3">
          <dt>수량</dt>
          <dd className="font-black text-wadeal-ink">{order.quantity}개</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>참여 수량</dt>
          <dd className="font-black text-wadeal-ink">
            {order.currentParticipants}/{order.targetParticipants}개
          </dd>
        </div>
      </dl>
    </article>
  );
}
