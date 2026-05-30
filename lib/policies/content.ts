export type PolicySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PolicyDocument = {
  slug: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  legalNotice: string;
  sections: PolicySection[];
};

const LEGAL_NOTICE =
  "본 문서는 celloh 스토리 커머스 서비스 운영을 위한 초안입니다. 정식 오픈 전 법무·개인정보 보호 검토가 필요합니다.";
const LAST_UPDATED = "2026-05-29 (운영 초안)";

export const TERMS_POLICY: PolicyDocument = {
  slug: "terms",
  title: "이용약관",
  subtitle: "celloh 서비스 이용에 관한 기본 약관",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "제1조 (목적)",
      paragraphs: [
        "본 약관은 celloh(이하 \"회사\")이 제공하는 판매자 중심 전자상거래 서비스(이하 \"서비스\")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.",
      ],
    },
    {
      title: "제2조 (정의)",
      paragraphs: ["본 약관에서 사용하는 용어의 정의는 다음과 같습니다."],
      bullets: [
        "\"이용자\"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.",
        "\"셀러 상품\"란 다수의 이용자가 동일 상품을 구매하여 누적 구매 수량에 따라 할인 가격이 적용되는 celloh의 거래 방식을 말합니다.",
        "\"구매 예약\"이란 이용자가 진행 중인 상품에 수량을 예약하고, 판매 종료 후 확정된 가격에 따라 결제·배송 절차를 진행하는 행위를 말합니다.",
        "\"최종 확정 금액\"이란 판매 종료 시점의 누적 구매 수량을 기준으로 적용되는 단가에 주문 수량을 곱한 금액을 말합니다.",
      ],
    },
    {
      title: "제3조 (약관의 효력 및 변경)",
      paragraphs: [
        "본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
        "회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경 사유를 사전 공지합니다.",
      ],
    },
    {
      title: "제4조 (서비스의 제공)",
      paragraphs: [
        "회사는 셀러 상품 정보 제공, 구매 예약, 판매 종료 후 가격 확정, 결제 및 배송 연계, 고객센터 등의 서비스를 제공합니다.",
        "상품 구매 시점에는 예상 단가가 안내되며, 실제 청구 금액은 판매 종료 후 확정된 최종 단가를 기준으로 합니다.",
      ],
    },
    {
      title: "제5조 (이용자의 의무)",
      paragraphs: ["이용자는 다음 행위를 하여서는 안 됩니다."],
      bullets: [
        "타인의 정보를 도용하거나 허위 정보를 등록하는 행위",
        "상품 구매를 악용하여 시스템을 교란하거나 부정한 이득을 취하는 행위",
        "회사 및 제3자의 지식재산권을 침해하는 행위",
        "기타 관련 법령 및 본 약관을 위반하는 행위",
      ],
    },
    {
      title: "제6조 (책임의 제한)",
      paragraphs: [
        "회사는 천재지변, 시스템 장애, 통신 두절 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.",
        "판매 목표 미달성, 공급사 사정 등으로 거래가 취소되는 경우 별도의 취소·환불 정책에 따릅니다.",
      ],
    },
    {
      title: "제7조 (분쟁 해결)",
      paragraphs: [
        "서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 성실히 협의하여 해결합니다.",
        "협의가 이루어지지 않을 경우, 관련 법령 및 소비자 분쟁 해결 기준에 따릅니다.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: PolicyDocument = {
  slug: "privacy",
  title: "개인정보처리방침",
  subtitle: "celloh 개인정보 수집·이용 및 보호에 관한 사항",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 수집하는 개인정보 항목",
      paragraphs: ["회사는 서비스 제공을 위해 다음 정보를 수집할 수 있습니다."],
      bullets: [
        "회원가입·로그인: 이메일, 이름/닉네임, 소셜 로그인 식별값",
        "주문·배송: 수령인 이름, 연락처, 배송지 주소",
        "결제: 결제수단 식별정보, 승인번호 등 PG사 제공 정보 (카드번호·CVC·결제비밀번호는 celloh가 저장하지 않음)",
        "고객문의: 문의 내용, 첨부파일",
        "서비스 이용: 접속 로그, 쿠키, 기기정보, 상품 구매·조회 기록",
      ],
    },
    {
      title: "2. 개인정보의 수집·이용 목적",
      paragraphs: ["수집한 개인정보는 다음 목적에 이용됩니다."],
      bullets: [
        "회원 식별, 로그인 및 계정 관리",
        "상품 주문 처리, 결제 및 배송",
        "고객센터 응대, 분쟁 처리, 공지사항 전달",
        "서비스 개선, 부정 이용 방지, 법령상 의무 이행",
        "마케팅 정보 수신에 동의한 경우 이벤트·혜택 안내",
      ],
    },
    {
      title: "3. 개인정보의 보유 및 이용 기간",
      paragraphs: [
        "회원 탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.",
        "전자상거래 등에서의 소비자 보호에 관한 법률 등 관련 법령에 따른 보존 기간을 준수합니다.",
      ],
    },
    {
      title: "4. 개인정보의 제3자 제공",
      paragraphs: [
        "회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.",
        "다만, 배송·결제·고객지원 등 서비스 제공을 위해 필요한 범위에서 업무 위탁 또는 법령에 따른 제공이 이루어질 수 있습니다.",
      ],
    },
    {
      title: "5. 개인정보 처리 위탁",
      paragraphs: ["서비스 운영을 위해 다음 업무를 위탁할 수 있습니다. (실제 업체명은 계약 확정 후 공지)"],
      bullets: [
        "결제대행: PG사 (예: Toss Payments 등 — TODO: 계약 후 확정)",
        "배송: 택배사·물류 파트너 (TODO: 확정)",
        "알림/메일/SMS: 카카오 알림톡, 이메일 발송 서비스 (TODO: 확정)",
        "클라우드/호스팅: Supabase, Vercel 등 (TODO: 확정)",
      ],
    },
    {
      title: "6. 이용자의 권리",
      paragraphs: [
        "이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청할 수 있습니다.",
        "마케팅 수신 동의는 별도로 철회할 수 있으며, 철회 이후에는 광고성 정보가 발송되지 않습니다.",
      ],
    },
    {
      title: "7. 개인정보 파기 절차",
      paragraphs: [
        "보유 기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다.",
        "전자적 파일은 복구 불가능한 방법으로 삭제하고, 출력물은 분쇄 또는 소각합니다.",
      ],
    },
    {
      title: "8. 만 14세 미만 아동",
      paragraphs: [
        "celloh는 만 14세 미만 아동의 회원가입을 제한합니다. 자세한 내용은 청소년 보호 정책(/policies/youth)을 참고해 주세요.",
      ],
    },
    {
      title: "9. 쿠키 및 행태정보",
      paragraphs: [
        "서비스 이용 편의를 위해 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.",
        "행태정보 수집·이용이 필요한 경우 별도 동의를 받고, 거부 방법을 안내합니다. (TODO: 상세 기준 법무 검토)",
      ],
    },
    {
      title: "10. 고지 및 변경",
      paragraphs: [
        "본 방침 변경 시 적용일자 및 변경 사유를 서비스 내 공지합니다.",
        "중요한 변경은 회원에게 이메일 또는 앱 알림으로 안내할 수 있습니다.",
      ],
    },
    {
      title: "11. 개인정보 보호책임자",
      paragraphs: [
        "개인정보 관련 문의는 고객센터(/support)를 통해 접수할 수 있습니다.",
        "담당자: TODO — 개인정보 보호책임자 성명/연락처 (운영 확정 후 게시)",
        "이메일: TODO — privacy@celloh.example (운영 확정 후 게시)",
      ],
    },
  ],
};

export const REFUND_POLICY: PolicyDocument = {
  slug: "refund",
  title: "취소/환불/교환 정책",
  subtitle: "상품 구매 후 취소, 환불, 교환에 관한 안내",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 주문 취소",
      paragraphs: [
        "배송 준비 전까지는 주문 취소가 가능합니다. (상품·판매자 정책에 따름)",
        "배송 준비중·배송중·배송완료 상태별로 취소·반품 가능 여부가 달라집니다.",
      ],
    },
    {
      title: "2. 단순변심 교환/반품",
      paragraphs: [
        "단순 변심에 의한 교환·반품은 상품별 정책 및 일괄 주문 특성에 따라 제한될 수 있습니다.",
        "왕복 배송비는 이용자 부담일 수 있습니다.",
      ],
    },
    {
      title: "3. 상품 하자·오배송",
      paragraphs: [
        "상품 불량, 오배송, 품절 등 회사 또는 판매자 귀책 사유인 경우 교환 또는 전액 환불이 가능합니다.",
        "배송비는 회사 또는 판매자가 부담합니다.",
      ],
    },
    {
      title: "4. 반품 제한 상품",
      paragraphs: ["다음 상품은 반품·교환이 제한될 수 있습니다. (TODO: 카테고리별 확정)"],
      bullets: [
        "신선·냉장·냉동 식품",
        "개봉·사용 후 가치가 현저히 감소한 상품",
        "주문 제작·맞춤 상품",
      ],
    },
    {
      title: "5. 환불 처리 기간",
      paragraphs: [
        "환불 승인 후 결제 수단에 따라 영업일 기준 3~7일 이내 환불이 완료될 수 있습니다. (TODO: PG사별 확정)",
        "쿠폰·포인트 사용 주문의 환불 시, 사용 혜택 회수 또는 차감 후 환불될 수 있습니다.",
      ],
    },
    {
      title: "6. 환불 접수",
      paragraphs: [
        "환불 요청은 고객센터(/support) 또는 마이페이지 주문 내역에서 접수할 수 있습니다.",
      ],
    },
  ],
};

export const GROUPBUY_POLICY: PolicyDocument = {
  slug: "commerce",
  title: "전자상거래 안내",
  subtitle: "celloh 주문·가격·거래기록 운영 원칙",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 판매자 정보 표시",
      paragraphs: [
        "상품 상세 및 주문 화면에 판매자명, 상품명, 가격, 배송비, 할인·쿠폰, 총 결제금액이 표시됩니다.",
        "사업자 정보(상호, 대표, 사업자등록번호 등)는 푸터 및 상품 상세에 표시됩니다. (TODO: 운영 확정 후 게시)",
      ],
    },
    {
      title: "2. 주문 전 확인 사항",
      paragraphs: [
        "주문 전 상품명, 수량, 가격, 배송지, 환불·배송 정책을 확인해 주세요.",
        "주문 완료 후 주문번호·결제금액·배송지가 안내됩니다.",
      ],
    },
    {
      title: "3. 거래기록 보존",
      paragraphs: [
        "주문·결제·배송 기록은 관련 법령에 따라 일정 기간 보관됩니다. (TODO: 보존 기간 법무 확정)",
      ],
    },
    {
      title: "4. 셀러 상품 진행 방식",
      paragraphs: [
        "일부 상품은 누적 구매 수량에 따라 최종 단가가 결정될 수 있습니다.",
        "구매 시점 예상가와 최종 확정가가 다를 수 있음을 확인·동의합니다.",
      ],
    },
    {
      title: "5. 고객 안내",
      paragraphs: [
        "주문·배송·결제 상태는 앱 알림 또는 카카오 알림(동의 시)으로 안내됩니다.",
        "문의는 고객센터(/support)를 이용해 주세요.",
      ],
    },
  ],
};

export const FINANCE_POLICY: PolicyDocument = {
  slug: "payment",
  title: "결제 정책",
  subtitle: "celloh 결제·PG·셀로페이 mock 안내 (초안)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 결제 처리 원칙",
      paragraphs: [
        "celloh는 실제 카드번호, CVC, 결제비밀번호를 저장하지 않습니다.",
        "결제 승인·취소·환불은 PG사(결제대행사)를 통해 처리됩니다.",
        "실제 오픈 시 Toss Payments 등 PG 결제위젯·브랜드페이·빌링키 검토가 필요합니다.",
      ],
    },
    {
      title: "2. 결제수단",
      paragraphs: ["현재 UI에서 선택 가능한 결제수단 (일부 mock):"],
      bullets: [
        "신용/체크카드",
        "카카오페이",
        "토스페이",
        "무통장입금 (가상계좌)",
        "셀로페이 — mock UI (실제 승인 없음)",
      ],
    },
    {
      title: "3. 결제 실패·취소",
      paragraphs: [
        "결제 실패 시 주문은 완료되지 않으며, 다시 시도하거나 결제수단을 변경할 수 있습니다.",
        "결제 취소·환불은 환불/교환 정책 및 PG사 처리 기준에 따릅니다.",
      ],
    },
    {
      title: "4. 셀로페이 mock",
      paragraphs: [
        "셀로페이·간편결제·결제비밀번호 화면은 현재 mock UI이며, 실제 결제 승인 API를 호출하지 않습니다.",
        "결제비밀번호는 저장하지 않습니다.",
      ],
    },
  ],
};

export const PAYMENT_POLICY = FINANCE_POLICY;

export const SHIPPING_POLICY: PolicyDocument = {
  slug: "shipping",
  title: "배송 정책",
  subtitle: "celloh 배송비·배송조회·배송지 변경 안내 (초안)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 기본 배송비",
      paragraphs: [
        "상품별·판매자별 배송비가 다를 수 있으며, 상품 상세 및 주문 화면에 표시됩니다.",
        "기본 배송비: TODO — 카테고리별 확정",
      ],
    },
    {
      title: "2. 무료배송",
      paragraphs: [
        "일정 금액 이상 구매 시 무료배송이 적용될 수 있습니다. 기준은 상품·장바구니 화면에 안내됩니다.",
      ],
    },
    {
      title: "3. 묶음·분리 배송",
      paragraphs: [
        "판매자·상품 특성에 따라 묶음배송 또는 분리배송될 수 있습니다.",
      ],
    },
    {
      title: "4. 도서산간 추가배송비",
      paragraphs: ["제주·도서산간 등 추가 배송비가 발생할 수 있습니다. (TODO: 금액 확정)"],
    },
    {
      title: "5. 배송조회·배송지 변경",
      paragraphs: [
        "배송 시작 후 마이페이지 주문 내역에서 배송조회가 가능합니다.",
        "배송지 변경은 배송 준비 전까지 가능합니다. (상품별 상이)",
      ],
    },
    {
      title: "6. 수령인 부재·주소 오류",
      paragraphs: [
        "부재 시 택배사 재배송 정책에 따릅니다. 장기 미수령 시 반송·추가 비용이 발생할 수 있습니다.",
        "주소 오류로 인한 재배송 비용은 이용자 부담일 수 있습니다.",
      ],
    },
  ],
};

export const REFERRAL_POLICY: PolicyDocument = {
  slug: "referral",
  title: "친구추천·지인초대 정책",
  subtitle: "celloh 초대 혜택 및 부정 이용 방지 (초안 · mock)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 혜택 개요 (초안)",
      paragraphs: ["아래 혜택은 운영 초안이며, 실제 지급 전 법무·프로모션 검토가 필요합니다."],
      bullets: [
        "친구 가입 완료: 친구 3,000원 쿠폰",
        "친구 첫 구매 완료: 초대한 사람 3,000원 쿠폰",
        "월 최대 지급 한도: TODO — 운영 확정",
      ],
    },
    {
      title: "2. 부정 이용 방지",
      paragraphs: ["다음 경우 혜택 지급이 제한되거나 회수될 수 있습니다."],
      bullets: [
        "자가추천, 동일 기기·동일 결제수단 중복 가입",
        "허위 가입, 대량 생성 계정",
        "주문 취소·환불 시 지급 예정 쿠폰 회수",
      ],
    },
    {
      title: "3. mock 범위",
      paragraphs: [
        "현재 초대 현황·쿠폰 지급은 mock/local UI이며, 실제 coupons/referrals DB 연동 전입니다.",
      ],
    },
  ],
};

export const SELLER_POLICY: PolicyDocument = {
  slug: "seller",
  title: "판매자 운영 정책",
  subtitle: "celloh 입점·상품·정산·CS 기준 (초안)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 입점·상품 등록",
      paragraphs: [
        "판매자는 입점 심사 및 사업자 정보 확인 후 상품을 등록할 수 있습니다.",
        "금지상품(법령 위반, 미인증, 허위광고 등) 등록을 금지합니다.",
      ],
    },
    {
      title: "2. 상품 검수",
      paragraphs: [
        "등록 상품은 관리자 검수 후 노출될 수 있습니다.",
        "과장·허위 광고, 리뷰 조작, 가격 허위 표시를 금지합니다.",
      ],
    },
    {
      title: "3. 배송·CS",
      paragraphs: [
        "판매자는 주문 접수 후 약정 기간 내 배송·CS를 책임집니다.",
        "정산 주기: TODO — 운영 확정 (예: 월 1~2회)",
      ],
    },
    {
      title: "4. 패널티",
      paragraphs: [
        "정책 위반 시 경고, 상품 노출 제한, 판매 중지 등 패널티가 적용될 수 있습니다. (TODO: 기준 확정)",
      ],
    },
  ],
};

export const YOUTH_POLICY: PolicyDocument = {
  slug: "youth",
  title: "청소년 보호 정책",
  subtitle: "만 14세 미만 이용 제한 및 보호 조치 (초안)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 이용 연령",
      paragraphs: [
        "celloh는 만 14세 미만 아동의 회원가입을 제한합니다.",
        "회원가입 시 만 14세 이상 확인에 동의해야 합니다.",
      ],
    },
    {
      title: "2. 유해 정보",
      paragraphs: [
        "청소년 유해 상품·콘텐츠 노출을 제한하기 위한 조치를 시행합니다. (TODO: 상세 기준)",
      ],
    },
    {
      title: "3. 문의",
      paragraphs: ["청소년 보호 관련 문의는 고객센터(/support)로 접수해 주세요."],
    },
  ],
};

export const MEMBERSHIP_POLICY: PolicyDocument = {
  slug: "membership",
  title: "셀로 멤버십 안내",
  subtitle: "멤버십 혜택·구독 mock (초안)",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 멤버십 상태",
      paragraphs: [
        "셀로 멤버십은 준비 중이며, 현재 화면은 mock 혜택 안내입니다.",
        "실제 정기결제·자동결제는 PG 계약 및 법무 검토 후 제공 예정입니다.",
      ],
    },
    {
      title: "2. 예정 혜택 (초안)",
      paragraphs: ["아래 혜택은 mock 안내이며, 실제 제공 전 변경될 수 있습니다."],
      bullets: [
        "무료배송 쿠폰",
        "멤버십 전용 특가",
        "선공개 상품",
        "생일 쿠폰",
        "리뷰 적립 혜택",
        "월 구독 가격: TODO — 운영 확정",
      ],
    },
  ],
};

export const MARKETING_POLICY: PolicyDocument = {
  slug: "marketing",
  title: "마케팅 정보 수신 동의",
  subtitle: "celloh 이벤트·혜택·상품 안내 수신에 관한 사항",
  lastUpdated: LAST_UPDATED,
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 수집·이용 목적",
      paragraphs: [
        "회사는 이용자가 동의한 경우, 신규 셀러 상품·할인·이벤트·서비스 안내 등 마케팅 정보를 제공할 수 있습니다.",
      ],
    },
    {
      title: "2. 수신 채널",
      paragraphs: ["마케팅 정보는 다음 채널로 발송될 수 있습니다."],
      bullets: [
        "앱 푸시 알림",
        "카카오 알림톡·친구톡(동의 시)",
        "SMS·이메일(동의 시)",
      ],
    },
    {
      title: "3. 필수 vs 선택 알림",
      paragraphs: ["다음 알림은 서비스 이용에 필수적일 수 있습니다."],
      bullets: [
        "주문·결제·배송 상태 (필수)",
        "혜택·이벤트·프로모션 (선택 — 마케팅 동의)",
      ],
    },
    {
      title: "4. 야간 알림",
      paragraphs: [
        "광고성 정보는 야간(21시~08시) 발송을 제한합니다. (TODO: 상세 기준 법무 검토)",
      ],
    },
    {
      title: "5. 동의 철회",
      paragraphs: [
        "마케팅 수신 동의는 마이페이지 설정에서 언제든지 철회할 수 있습니다.",
        "철회 이후에는 광고성 정보가 발송되지 않으며, 필수 서비스 안내(주문·배송·환불 등)는 계속 발송될 수 있습니다.",
      ],
    },
    {
      title: "6. 보유 기간",
      paragraphs: [
        "마케팅 수신 동의 및 철회 기록은 관련 법령에 따라 일정 기간 보관될 수 있습니다.",
      ],
    },
  ],
};

export const ALL_POLICIES = [
  TERMS_POLICY,
  PRIVACY_POLICY,
  FINANCE_POLICY,
  REFUND_POLICY,
  GROUPBUY_POLICY,
  MARKETING_POLICY,
] as const;

export function policyToMarkdown(doc: PolicyDocument): string {
  const lines = [
    `# ${doc.title}`,
    "",
    doc.subtitle,
    "",
    `> ${doc.legalNotice}`,
    "",
  ];

  for (const section of doc.sections) {
    lines.push(`## ${section.title}`, "");
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph, "");
    }
    if (section.bullets?.length) {
      for (const bullet of section.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}
