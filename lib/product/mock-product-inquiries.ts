export type MockInquiryType = "product" | "shipping" | "exchange" | "restock" | "other";

export type MockProductInquiry = {
  id: string;
  type: MockInquiryType;
  typeLabel: string;
  title: string;
  content: string;
  isPublic: boolean;
  status: "pending" | "answered";
  createdAt: string;
  sellerReply?: string;
};

export const INQUIRY_TYPE_OPTIONS: { id: MockInquiryType; label: string }[] = [
  { id: "product", label: "상품" },
  { id: "shipping", label: "배송" },
  { id: "exchange", label: "교환/반품" },
  { id: "restock", label: "재입고" },
  { id: "other", label: "기타" },
];

export const MOCK_PRODUCT_INQUIRIES: MockProductInquiry[] = [
  {
    id: "mock-inq-1",
    type: "product",
    typeLabel: "상품",
    title: "성분/원산지 문의",
    content: "원산지와 알레르기 유발 성분이 궁금합니다.",
    isPublic: true,
    status: "answered",
    createdAt: "2026-05-28",
    sellerReply: "mock 답변 — 국내산 원료 사용, 상세 성분은 상품 상세 이미지 참고 부탁드립니다.",
  },
  {
    id: "mock-inq-2",
    type: "shipping",
    typeLabel: "배송",
    title: "내일 도착 가능한가요?",
    content: "오늘 주문하면 내일 받을 수 있을까요?",
    isPublic: true,
    status: "pending",
    createdAt: "2026-05-27",
  },
  {
    id: "mock-inq-3",
    type: "restock",
    typeLabel: "재입고",
    title: "품절 재입고 일정",
    content: "품절된 옵션 재입고 예정일 알려주세요.",
    isPublic: false,
    status: "pending",
    createdAt: "2026-05-26",
  },
];

export const INQUIRY_POLICY_NOTES = [
  "판매자는 영업일 1~3일 이내 답변을 권장합니다.",
  "욕설·개인정보·광고성 문의는 비공개 처리 또는 삭제될 수 있습니다.",
  "교환/반품은 주문 상태에 따라 고객센터 안내를 따릅니다.",
];
