import type { Deal } from "@/lib/deals";
import { currency, getDealRemaining } from "@/lib/deals";
import type { CreatePriceAlertInput } from "@/lib/database/types";

export type AlertOptionKey =
  | "price_drop"
  | "lowest_price"
  | "almost_full"
  | "deadline";

export type AlertOption = {
  key: AlertOptionKey;
  label: string;
};

export function buildAlertOptions(deal: Deal): AlertOption[] {
  const remaining = getDealRemaining(deal);
  return [
    { key: "price_drop", label: "현재가보다 내려가면 알림" },
    {
      key: "lowest_price",
      label: `최저가 ${currency.format(deal.lowestPrice)}원 달성 시 알림`,
    },
    {
      key: "almost_full",
      label: `최저가까지 ${remaining}명 남으면 알림`,
    },
    { key: "deadline", label: "마감 1시간 전 알림" },
  ];
}

export function mapAlertOptionToInput(
  dealId: string,
  option: AlertOption,
  deal: Deal,
): CreatePriceAlertInput {
  const midPrice = Math.round((deal.groupPrice + deal.lowestPrice) / 2);

  switch (option.key) {
    case "price_drop":
      return {
        dealId,
        targetPrice: midPrice,
        notifyAtLowestPrice: false,
        notifyBeforeDeadline: false,
      };
    case "lowest_price":
      return {
        dealId,
        targetPrice: deal.lowestPrice,
        notifyAtLowestPrice: true,
        notifyBeforeDeadline: false,
      };
    case "almost_full":
      return {
        dealId,
        targetPrice: deal.lowestPrice,
        notifyAtLowestPrice: true,
        notifyBeforeDeadline: false,
      };
    case "deadline":
      return {
        dealId,
        notifyAtLowestPrice: false,
        notifyBeforeDeadline: true,
      };
  }
}
