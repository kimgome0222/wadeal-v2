export type SafeShoppingSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const SAFE_SHOPPING_DISCLAIMER =
  "본 안내는 운영 초안이며, 법률 자문·정식 약관 확정 전 참고용입니다. 100% 안전·보증 표현은 사용하지 않습니다.";

export const SAFE_SHOPPING_SECTIONS: SafeShoppingSection[] = [
  {
    title: "주문 전 확인할 것",
    paragraphs: ["구매 전 아래 항목을 확인하면 더 안심하고 쇼핑할 수 있어요."],
    bullets: [
      "판매자 소개·스토리·대표 상품",
      "상품명, 가격, 원산지·인증 정보",
      "배송·교환·환불 정책",
      "리뷰·문의 응답",
    ],
  },
  {
    title: "판매자 정보 확인",
    paragraphs: [
      "celloh는 입점 시 사업자·기본 정보 확인과 상품 검수 절차를 운영해요. (mock · 실제 API 미연동)",
    ],
    bullets: [
      "판매자 프로필의 입점 정보 확인·검수 안내 참고",
      "과장·허위 표현이 보이면 신고해 주세요",
    ],
  },
  {
    title: "결제는 celloh 결제창에서만",
    paragraphs: [
      "판매자가 카카오톡·계좌이체 등 celloh 밖 결제를 유도하면 응답하지 마세요.",
      "정상 결제는 celloh 주문·결제 화면에서만 진행됩니다.",
    ],
  },
  {
    title: "외부 송금·개인정보 주의",
    bullets: [
      "미등록 계좌 송금 요청 거절",
      "불필요한 개인정보(주민번호 등) 요구 거절",
      "의심 거래는 고객센터·신고 이용",
    ],
  },
  {
    title: "의심 상품·판매자 신고",
    paragraphs: ["허위 상품정보, 금지품목, 리뷰 조작 등은 신고해 주세요."],
    bullets: ["/reports 에서 접수 (mock · 운영팀 검토)"],
  },
  {
    title: "고객센터 문의",
    paragraphs: [
      "배송·환불·쿠폰·결제 문제는 고객센터 FAQ 또는 1:1 문의를 이용해 주세요.",
    ],
  },
];

export const SAFE_SHOPPING_POLICY_LINKS = [
  { label: "전자상거래 안내", href: "/policies/commerce" },
  { label: "결제 정책", href: "/policies/payment" },
  { label: "환불/교환", href: "/policies/refund" },
  { label: "배송 정책", href: "/policies/shipping" },
  { label: "판매자 정책", href: "/policies/seller" },
] as const;
