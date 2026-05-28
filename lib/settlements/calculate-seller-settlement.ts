import { DEFAULT_COMMISSION_RATE } from "@/lib/settlements/labels";
import type {
  SellerSettlementRecordItem,
  SettlementRecordItemType,
} from "@/lib/settlements/seller-settlement-types";

export type SellerSettlementCalculationInput = {
  grossSalesAmount: number;
  platformFeeRate?: number;
  adDeductionAmount: number;
  otherDeductionAmount?: number;
  salesLabel?: string;
};

export type SellerSettlementCalculationResult = {
  grossSalesAmount: number;
  platformFeeAmount: number;
  adDeductionAmount: number;
  otherDeductionAmount: number;
  netPayoutAmount: number;
  items: SellerSettlementRecordItem[];
};

function buildItem(
  id: string,
  itemType: SettlementRecordItemType,
  label: string,
  amount: number,
  sortOrder: number,
): SellerSettlementRecordItem {
  return { id, itemType, label, amount, sortOrder };
}

/** 판매 총액 - (플랫폼 수수료 + 광고비 + 기타) = 최종 입금액 */
export function calculateSellerSettlementAmounts(
  input: SellerSettlementCalculationInput,
): SellerSettlementCalculationResult {
  const grossSalesAmount = Math.max(0, Math.round(input.grossSalesAmount));
  const platformFeeRate = input.platformFeeRate ?? DEFAULT_COMMISSION_RATE;
  const platformFeeAmount = Math.round(grossSalesAmount * (platformFeeRate / 100));
  const adDeductionAmount = Math.max(0, Math.round(input.adDeductionAmount));
  const otherDeductionAmount = Math.max(0, Math.round(input.otherDeductionAmount ?? 0));
  const netPayoutAmount = Math.max(
    0,
    grossSalesAmount - platformFeeAmount - adDeductionAmount - otherDeductionAmount,
  );

  const items: SellerSettlementRecordItem[] = [
    buildItem("sales", "sales", input.salesLabel ?? "판매 총액", grossSalesAmount, 1),
    buildItem(
      "platform_fee",
      "platform_fee",
      `플랫폼 수수료 (${platformFeeRate}%)`,
      -platformFeeAmount,
      2,
    ),
  ];

  if (adDeductionAmount > 0) {
    items.push(buildItem("ad_fee", "ad_fee", "광고비 차감", -adDeductionAmount, 3));
  }

  if (otherDeductionAmount > 0) {
    items.push(buildItem("other", "other", "기타 비용 차감", -otherDeductionAmount, 4));
  }

  items.push(buildItem("net", "other", "최종 입금 예정액", netPayoutAmount, 99));

  return {
    grossSalesAmount,
    platformFeeAmount,
    adDeductionAmount,
    otherDeductionAmount,
    netPayoutAmount,
    items,
  };
}
