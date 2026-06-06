/** UI mock — 실제 카드번호/CVC/비밀번호 저장 금지 */
export type CellohPayCard = {
  id: string;
  cardAlias: string;
  maskedNumber: string;
  isDefault: boolean;
  provider: "mock";
};

export type CellohPayOrderResult = {
  orderNumber: string;
  amount: number;
  paymentLabel: string;
  addressSummary: string;
  estimatedDelivery: string;
  productName: string;
};
