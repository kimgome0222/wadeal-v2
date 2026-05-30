export type MockProductRequestStatus =
  | "draft"
  | "submitted"
  | "pending"
  | "rejected"
  | "approved";

export type MockOrderStatus =
  | "paid"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancel_requested"
  | "return_requested";

export type MockSettlementStatus = "scheduled" | "confirmed" | "paid" | "held";

export const MOCK_SELLER_DASHBOARD_SUMMARY = {
  todayOrders: 3,
  preparingShipment: 2,
  pendingInquiries: 4,
  newReviews: 2,
  pendingSettlement: 128_400,
  pendingReviewProducts: 1,
  rejectedProducts: 1,
} as const;

export const MOCK_SELLER_QUICK_ACTIONS = [
  { href: "/seller/products/new", label: "상품 등록 요청" },
  { href: "/seller/orders", label: "주문 확인" },
  { href: "/seller/inquiries", label: "문의 답변" },
  { href: "/seller/finance/settlements", label: "정산 내역" },
  { href: "/seller/notices", label: "공지 확인" },
  { href: "/policies/seller", label: "정책 확인" },
] as const;

export type MockSellerOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  buyerMasked: string;
  quantity: number;
  amount: number;
  orderStatus: MockOrderStatus;
  shippingStatus: string;
  trackingNumber: string;
};

export const MOCK_SELLER_ORDERS: MockSellerOrder[] = [
  {
    id: "ord-m1",
    orderNumber: "WD-20260529-001",
    productName: "제주 감귤 3kg",
    buyerMasked: "김*호",
    quantity: 2,
    amount: 29800,
    orderStatus: "paid",
    shippingStatus: "배송준비중",
    trackingNumber: "",
  },
  {
    id: "ord-m2",
    orderNumber: "WD-20260528-014",
    productName: "유기농 샴푸 500ml",
    buyerMasked: "이*진",
    quantity: 1,
    amount: 18900,
    orderStatus: "shipping",
    shippingStatus: "배송중",
    trackingNumber: "123456789012",
  },
  {
    id: "ord-m3",
    orderNumber: "WD-20260527-008",
    productName: "친환경 주방세제",
    buyerMasked: "박*수",
    quantity: 3,
    amount: 35700,
    orderStatus: "delivered",
    shippingStatus: "배송완료",
    trackingNumber: "987654321098",
  },
];

export type MockSellerReview = {
  id: string;
  rating: number;
  content: string;
  productName: string;
  createdAt: string;
  hasReply: boolean;
};

export const MOCK_SELLER_REVIEWS: MockSellerReview[] = [
  {
    id: "rev-m1",
    rating: 5,
    content: "신선하고 포장도 깔끔했어요. 재구매 의사 있습니다.",
    productName: "제주 감귤 3kg",
    createdAt: "2026-05-28",
    hasReply: false,
  },
  {
    id: "rev-m2",
    rating: 4,
    content: "향이 좋아요. 배송은 하루 늦었지만 만족합니다.",
    productName: "유기농 샴푸 500ml",
    createdAt: "2026-05-26",
    hasReply: true,
  },
];

export type MockSellerInquiry = {
  id: string;
  type: "product" | "shipping" | "return";
  title: string;
  content: string;
  productName: string;
  status: "pending" | "answered";
  createdAt: string;
};

export const MOCK_SELLER_INQUIRIES: MockSellerInquiry[] = [
  {
    id: "inq-m1",
    type: "product",
    title: "유통기한 문의",
    content: "유통기한이 언제까지인가요?",
    productName: "제주 감귤 3kg",
    status: "pending",
    createdAt: "2026-05-29",
  },
  {
    id: "inq-m2",
    type: "shipping",
    title: "배송 일정",
    content: "내일 출고 가능한가요?",
    productName: "친환경 주방세제",
    status: "answered",
    createdAt: "2026-05-27",
  },
];

export type MockSettlementRecord = {
  id: string;
  period: string;
  grossAmount: number;
  feeAmount: number;
  refundDeduction: number;
  netAmount: number;
  status: MockSettlementStatus;
  accountMasked: string;
};

export const MOCK_SETTLEMENT_RECORDS: MockSettlementRecord[] = [
  {
    id: "stl-m1",
    period: "2026-05-01 ~ 2026-05-15",
    grossAmount: 420_000,
    feeAmount: 42_000,
    refundDeduction: 12_000,
    netAmount: 366_000,
    status: "scheduled",
    accountMasked: "국민은행 ****-1234",
  },
  {
    id: "stl-m2",
    period: "2026-04-16 ~ 2026-04-30",
    grossAmount: 310_000,
    feeAmount: 31_000,
    refundDeduction: 0,
    netAmount: 279_000,
    status: "paid",
    accountMasked: "국민은행 ****-1234",
  },
];

export type MockProductRequest = {
  id: string;
  productName: string;
  status: MockProductRequestStatus;
  rejectedReason?: string;
  updatedAt: string;
};

export const MOCK_PRODUCT_REQUESTS: MockProductRequest[] = [
  {
    id: "pr-m1",
    productName: "제주 감귤 3kg",
    status: "approved",
    updatedAt: "2026-05-20",
  },
  {
    id: "pr-m2",
    productName: "유기농 샴푸 500ml",
    status: "pending",
    updatedAt: "2026-05-27",
  },
  {
    id: "pr-m3",
    productName: "KC 미등록 전자제품 샘플",
    status: "rejected",
    rejectedReason: "KC 인증 정보 확인 필요 — placeholder",
    updatedAt: "2026-05-25",
  },
];

export function getProductRequestStatusLabel(status: MockProductRequestStatus): string {
  switch (status) {
    case "draft":
      return "작성중";
    case "submitted":
      return "검수요청";
    case "pending":
      return "승인대기";
    case "rejected":
      return "반려";
    case "approved":
      return "승인완료";
    default:
      return status;
  }
}

export function getOrderStatusLabel(status: MockOrderStatus): string {
  switch (status) {
    case "paid":
      return "결제완료";
    case "preparing":
      return "배송준비중";
    case "shipping":
      return "배송중";
    case "delivered":
      return "배송완료";
    case "cancel_requested":
      return "취소요청";
    case "return_requested":
      return "반품요청";
    default:
      return status;
  }
}

export function getSettlementStatusLabel(status: MockSettlementStatus): string {
  switch (status) {
    case "scheduled":
      return "정산예정";
    case "confirmed":
      return "정산확정";
    case "paid":
      return "지급완료";
    case "held":
      return "보류";
    default:
      return status;
  }
}

export function validateBusinessNumber(value: string): boolean {
  return /^\d{3}-\d{2}-\d{5}$/.test(value.trim());
}
