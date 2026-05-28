import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import type { CreatePriceAlertInput } from "@/lib/database/types";

export type AlertOptionKey = "drop_5" | "drop_10" | "custom";

export type AlertOption = {
  key: AlertOptionKey;
  label: string;
  targetPrice: number | null;
};

function roundPrice(value: number): number {
  return Math.max(Math.round(value), 0);
}

export function getDropTargetPrice(deal: Deal, percent: 5 | 10): number {
  const multiplier = percent === 5 ? 0.95 : 0.9;
  return roundPrice(deal.groupPrice * multiplier);
}

export function buildAlertOptions(deal: Deal): AlertOption[] {
  const drop5 = getDropTargetPrice(deal, 5);
  const drop10 = getDropTargetPrice(deal, 10);

  return [
    {
      key: "drop_5",
      label: `현재가보다 5% 하락 (${currency.format(drop5)}원)`,
      targetPrice: drop5,
    },
    {
      key: "drop_10",
      label: `현재가보다 10% 하락 (${currency.format(drop10)}원)`,
      targetPrice: drop10,
    },
    {
      key: "custom",
      label: "목표 가격 직접 입력",
      targetPrice: null,
    },
  ];
}

export function parseCustomTargetPrice(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return roundPrice(parsed);
}

export function resolveAlertTargetPrice(
  option: AlertOption,
  customTargetPrice: string,
): number | null {
  if (option.key === "custom") {
    return parseCustomTargetPrice(customTargetPrice);
  }

  return option.targetPrice;
}

export function mapAlertOptionToInput(
  dealId: string,
  option: AlertOption,
  customTargetPrice?: number | null,
): CreatePriceAlertInput {
  if (option.key === "custom") {
    return {
      dealId,
      targetPrice: customTargetPrice ?? null,
      notifyAtLowestPrice: false,
      notifyBeforeDeadline: false,
    };
  }

  return {
    dealId,
    targetPrice: option.targetPrice,
    notifyAtLowestPrice: false,
    notifyBeforeDeadline: false,
  };
}

export function formatPriceAlertCondition(alert: {
  target_price: number | null;
  notify_at_lowest_price: boolean;
  notify_before_deadline: boolean;
}): string {
  if (alert.notify_before_deadline) {
    return "마감 1시간 전";
  }

  if (alert.notify_at_lowest_price && alert.target_price != null) {
    return `최저가 ${currency.format(alert.target_price)}원 달성 시`;
  }

  if (alert.target_price != null) {
    return `${currency.format(alert.target_price)}원 이하`;
  }

  return "가격 알림";
}
