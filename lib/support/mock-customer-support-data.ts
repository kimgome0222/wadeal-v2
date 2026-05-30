export type FaqCategoryId =
  | "order"
  | "shipping"
  | "refund"
  | "coupon"
  | "referral"
  | "member"
  | "seller";

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export type NoticeCategory = "배송" | "쿠폰" | "이벤트" | "정책" | "시스템";

export type SupportNotice = {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  important: boolean;
  content: string;
};

export type MockTicketStatus = "received" | "in_progress" | "answered";

export type MockSupportTicket = {
  id: string;
  ticketNumber: string;
  type: string;
  title: string;
  status: MockTicketStatus;
  createdAt: string;
  body: string;
  reply?: string;
  repliedAt?: string;
};

export type ReportTargetType = "product" | "review" | "seller" | "comment";

export const FAQ_CATEGORIES: { id: FaqCategoryId; label: string; href: string }[] = [
  { id: "order", label: "주문/결제", href: "/support/payment" },
  { id: "shipping", label: "배송", href: "/support/shipping" },
  { id: "refund", label: "취소/환불", href: "/support/refund" },
  { id: "coupon", label: "쿠폰/포인트", href: "/support/coupons" },
  { id: "referral", label: "친구추천", href: "/support/referral" },
  { id: "member", label: "회원/로그인", href: "/support/faq?category=member" },
  { id: "seller", label: "판매자/상품", href: "/support/faq?category=seller" },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "order-1",
    category: "order",
    question: "주문내역은 어디서 확인하나요?",
    answer:
      "마이페이지 > 주문·배송내역에서 확인할 수 있습니다. 로그인 후 주문번호, 상품명, 배송 상태를 한눈에 볼 수 있어요.",
  },
  {
    id: "order-2",
    category: "order",
    question: "결제수단을 변경할 수 있나요?",
    answer:
      "결제 완료 후에는 결제수단 변경이 어렵습니다. 주문 취소 후 재주문하시거나, 1:1 문의로 도움을 요청해 주세요.",
  },
  {
    id: "order-3",
    category: "order",
    question: "결제 실패 시 어떻게 하나요?",
    answer:
      "카드 한도, 인증 오류, 네트워크 문제 등을 확인해 주세요. 문제가 지속되면 다른 결제수단으로 재시도하거나 고객센터에 문의해 주세요.",
  },
  {
    id: "ship-1",
    category: "shipping",
    question: "배송지는 언제까지 변경할 수 있나요?",
    answer:
      "결제 완료 후 '배송 준비중' 상태 전까지 마이페이지 주문 상세에서 변경할 수 있습니다. 배송 시작 후에는 변경이 제한됩니다.",
  },
  {
    id: "ship-2",
    category: "shipping",
    question: "무료배송 기준은 무엇인가요?",
    answer:
      "상품별 무료배송 여부와 최소 주문 금액은 상품 상세 페이지에 표시됩니다. 장바구니에서 배송비 안내를 확인할 수 있어요.",
  },
  {
    id: "ship-3",
    category: "shipping",
    question: "배송조회는 어디서 하나요?",
    answer:
      "마이페이지 > 주문·배송내역 > 주문 상세에서 운송장 번호와 배송 추적 링크를 확인할 수 있습니다.",
  },
  {
    id: "refund-1",
    category: "refund",
    question: "주문 취소는 언제까지 가능한가요?",
    answer:
      "판매자가 배송 준비를 시작하기 전까지 취소할 수 있습니다. 배송 시작 후에는 반품/교환 절차로 안내됩니다.",
  },
  {
    id: "refund-2",
    category: "refund",
    question: "환불은 얼마나 걸리나요?",
    answer:
      "취소 승인 후 카드사/결제사 정책에 따라 영업일 3~7일 내 환불됩니다. 간편결제는 결제 수단별로 시일이 다를 수 있어요.",
  },
  {
    id: "refund-3",
    category: "refund",
    question: "상품 불량이면 어떻게 하나요?",
    answer:
      "수령 후 7일 이내 1:1 문의 또는 주문 상세에서 교환/반품을 접수해 주세요. 사진 첨부 시 처리가 빨라집니다.",
  },
  {
    id: "coupon-1",
    category: "coupon",
    question: "쿠폰은 자동 적용되나요?",
    answer:
      "사용 가능한 쿠폰은 주문서에서 자동으로 안내됩니다. 조건에 맞는 쿠폰을 직접 선택해 적용할 수 있어요.",
  },
  {
    id: "coupon-2",
    category: "coupon",
    question: "쿠폰 사용 후 환불하면 어떻게 되나요?",
    answer:
      "전체 취소 시 쿠폰은 복원될 수 있으나, 유효기간이 지난 경우 재사용이 불가할 수 있습니다. 부분 취소 시 쿠폰 정책에 따라 달라집니다.",
  },
  {
    id: "coupon-3",
    category: "coupon",
    question: "포인트는 언제 적립되나요?",
    answer:
      "배송 완료 후 구매 확정 시점에 적립됩니다. 이벤트 포인트는 각 이벤트 안내에 따릅니다.",
  },
  {
    id: "referral-1",
    category: "referral",
    question: "지인초대 혜택은 언제 지급되나요?",
    answer:
      "초대받은 친구가 가입 후 첫 구매를 완료하면, 영업일 3~5일 내 혜택이 지급됩니다. 자세한 조건은 친구추천 안내를 확인해 주세요.",
  },
  {
    id: "referral-2",
    category: "referral",
    question: "같은 사람이 여러 번 가입하면 어떻게 되나요?",
    answer:
      "동일인 중복 가입, 탈퇴 후 재가입 등 부정 이용은 혜택 지급 대상에서 제외될 수 있습니다.",
  },
  {
    id: "member-1",
    category: "member",
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 화면 > 비밀번호 찾기에서 가입 이메일로 재설정 링크를 받을 수 있습니다.",
  },
  {
    id: "seller-1",
    category: "seller",
    question: "판매자에게 직접 문의할 수 있나요?",
    answer:
      "상품 상세 페이지의 판매자 문의 또는 1:1 문의에서 판매자/상품 관련 문의를 남길 수 있습니다.",
  },
];

export const FAQ_TOP10 = FAQ_ITEMS.slice(0, 10);

export const SUPPORT_NOTICES: SupportNotice[] = [
  {
    id: "notice-1",
    title: "연휴 기간 배송 지연 안내",
    category: "배송",
    date: "2026-05-20",
    important: true,
    content:
      "5월 연휴 기간 택배 물량 증가로 일부 지역 배송이 1~2일 지연될 수 있습니다. 양해 부탁드립니다.",
  },
  {
    id: "notice-2",
    title: "쿠폰 정책 변경 안내",
    category: "쿠폰",
    date: "2026-05-15",
    important: false,
    content:
      "6월 1일부터 일부 카테고리 쿠폰 중복 사용 규정이 변경됩니다. 마이페이지 > 쿠폰에서 상세 조건을 확인해 주세요.",
  },
  {
    id: "notice-3",
    title: "친구추천 이벤트 안내",
    category: "이벤트",
    date: "2026-05-10",
    important: false,
    content:
      "친구 초대 시 양쪽 모두 혜택을 받는 이벤트가 진행 중입니다. 마이페이지 > 친구초대에서 초대 링크를 확인하세요.",
  },
  {
    id: "notice-4",
    title: "개인정보처리방침 개정 안내",
    category: "정책",
    date: "2026-05-01",
    important: true,
    content:
      "2026년 5월 15일부터 개정된 개인정보처리방침이 적용됩니다. 정책 페이지에서 변경 내용을 확인할 수 있습니다.",
  },
  {
    id: "notice-5",
    title: "시스템 점검 안내 (5/28 02:00–04:00)",
    category: "시스템",
    date: "2026-04-28",
    important: false,
    content:
      "서비스 안정화를 위한 점검이 예정되어 있습니다. 점검 시간에는 일부 기능 이용이 제한될 수 있습니다.",
  },
];

export const MOCK_SUPPORT_TICKETS: MockSupportTicket[] = [
  {
    id: "mock-ticket-1",
    ticketNumber: "CS-20260529-001",
    type: "배송",
    title: "배송 일정 문의",
    status: "answered",
    createdAt: "2026-05-28",
    body: "주문한 상품이 아직 출고되지 않았습니다. 배송 예정일을 알려주세요.",
    reply: "안녕하세요. 확인 결과 내일 출고 예정이며, 출고 후 운송장 번호를 안내드리겠습니다.",
    repliedAt: "2026-05-28",
  },
  {
    id: "mock-ticket-2",
    ticketNumber: "CS-20260527-014",
    type: "환불",
    title: "부분 취소 요청",
    status: "in_progress",
    createdAt: "2026-05-27",
    body: "세트 상품 중 1개만 취소하고 싶습니다.",
  },
  {
    id: "mock-ticket-3",
    ticketNumber: "CS-20260525-008",
    type: "쿠폰",
    title: "쿠폰 적용 오류",
    status: "received",
    createdAt: "2026-05-25",
    body: "장바구니에서 쿠폰이 적용되지 않습니다.",
  },
];

export const INQUIRY_TYPE_OPTIONS = [
  "주문/결제",
  "배송",
  "취소/환불",
  "쿠폰/포인트",
  "친구추천",
  "회원/계정",
  "판매자/상품",
  "기타",
] as const;

export const REPORT_TARGET_OPTIONS: { id: ReportTargetType; label: string }[] = [
  { id: "product", label: "상품 신고" },
  { id: "review", label: "리뷰 신고" },
  { id: "seller", label: "판매자 신고" },
  { id: "comment", label: "문의/댓글 신고" },
];

export const REPORT_REASON_OPTIONS = [
  "허위/과장 광고",
  "부적절한 상품",
  "욕설/비방",
  "개인정보 노출",
  "리뷰 조작 의심",
  "기타",
] as const;

export function getFaqCategoryLabel(id: FaqCategoryId): string {
  return FAQ_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getTicketStatusLabel(status: MockTicketStatus): string {
  switch (status) {
    case "received":
      return "접수";
    case "in_progress":
      return "확인중";
    case "answered":
      return "답변완료";
  }
}

export function generateMockTicketNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `CS-${y}${m}${d}-${seq}`;
}

export function getNoticeById(id: string): SupportNotice | undefined {
  return SUPPORT_NOTICES.find((n) => n.id === id);
}

export function getMockTicketById(id: string): MockSupportTicket | undefined {
  return MOCK_SUPPORT_TICKETS.find((t) => t.id === id);
}
