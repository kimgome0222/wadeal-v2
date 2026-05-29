export type PolicySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PolicyDocument = {
  slug: string;
  title: string;
  subtitle: string;
  legalNotice: string;
  sections: PolicySection[];
};

const LEGAL_NOTICE =
  "본 문서는 celloh 공동구매 서비스 운영을 위한 초안입니다. 실제 서비스 적용 전 반드시 법률 검토를 받아 주세요.";

export const TERMS_POLICY: PolicyDocument = {
  slug: "terms",
  title: "이용약관",
  subtitle: "celloh 서비스 이용에 관한 기본 약관",
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "제1조 (목적)",
      paragraphs: [
        "본 약관은 celloh(이하 \"회사\")이 제공하는 공동구매 전자상거래 서비스(이하 \"서비스\")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.",
      ],
    },
    {
      title: "제2조 (정의)",
      paragraphs: ["본 약관에서 사용하는 용어의 정의는 다음과 같습니다."],
      bullets: [
        "\"이용자\"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.",
        "\"공동구매\"란 다수의 이용자가 동일 상품에 참여하여 누적 참여 수량에 따라 할인 가격이 적용되는 celloh의 핵심 거래 방식을 말합니다.",
        "\"참여\"란 이용자가 공동구매 진행 중인 상품에 수량을 예약하고, 마감 후 확정된 가격에 따라 결제·배송 절차를 진행하는 행위를 말합니다.",
        "\"최종 확정 금액\"이란 공동구매 마감 시점의 누적 참여 수량을 기준으로 적용되는 단가에 주문 수량을 곱한 금액을 말합니다.",
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
        "회사는 공동구매 상품 정보 제공, 참여 예약, 마감 후 가격 확정, 결제 및 배송 연계, 고객센터 등의 서비스를 제공합니다.",
        "공동구매 참여 시점에는 예상 단가가 안내되며, 실제 청구 금액은 공동구매 마감 후 확정된 최종 단가를 기준으로 합니다.",
      ],
    },
    {
      title: "제5조 (이용자의 의무)",
      paragraphs: ["이용자는 다음 행위를 하여서는 안 됩니다."],
      bullets: [
        "타인의 정보를 도용하거나 허위 정보를 등록하는 행위",
        "공동구매 참여를 악용하여 시스템을 교란하거나 부정한 이득을 취하는 행위",
        "회사 및 제3자의 지식재산권을 침해하는 행위",
        "기타 관련 법령 및 본 약관을 위반하는 행위",
      ],
    },
    {
      title: "제6조 (책임의 제한)",
      paragraphs: [
        "회사는 천재지변, 시스템 장애, 통신 두절 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.",
        "공동구매 목표 미달성, 공급사 사정 등으로 거래가 취소되는 경우 별도의 취소·환불 정책에 따릅니다.",
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
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 수집하는 개인정보 항목",
      paragraphs: ["회사는 서비스 제공을 위해 다음 정보를 수집할 수 있습니다."],
      bullets: [
        "회원가입 및 로그인: 소셜 로그인 식별자, 이메일, 닉네임",
        "주문·배송: 수령인 이름, 연락처, 배송지 주소",
        "결제: 결제수단 정보(카드사, 마스킹된 카드번호 등)",
        "서비스 이용: 공동구매 참여 내역, 알림 설정, 문의 내역, 접속 로그",
      ],
    },
    {
      title: "2. 개인정보의 수집·이용 목적",
      paragraphs: ["수집한 개인정보는 다음 목적에 이용됩니다."],
      bullets: [
        "회원 식별, 로그인 및 계정 관리",
        "공동구매 참여 처리, 가격 확정 안내, 결제 및 배송",
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
      title: "5. 이용자의 권리",
      paragraphs: [
        "이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청할 수 있습니다.",
        "마케팅 수신 동의는 별도로 철회할 수 있으며, 철회 이후에는 광고성 정보가 발송되지 않습니다.",
      ],
    },
    {
      title: "6. 개인정보 보호책임자",
      paragraphs: [
        "개인정보 관련 문의는 고객센터(/support)를 통해 접수할 수 있습니다.",
        "담당 부서 및 연락처는 서비스 공식 공지를 통해 안내됩니다.",
      ],
    },
  ],
};

export const REFUND_POLICY: PolicyDocument = {
  slug: "refund-policy",
  title: "취소/환불/교환 정책",
  subtitle: "공동구매 참여 후 취소, 환불, 교환에 관한 안내",
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 공동구매 참여 취소",
      paragraphs: [
        "공동구매 마감 전까지는 참여(예약) 취소가 가능합니다.",
        "마감 후 가격이 확정되고 결제가 진행된 경우, 아래 환불·교환 기준에 따릅니다.",
      ],
    },
    {
      title: "2. 공동구매 미성사",
      paragraphs: [
        "목표 참여 수량 미달 등으로 공동구매가 성사되지 않은 경우, 참여 예약은 자동 취소되며 결제가 진행되지 않습니다.",
        "이미 결제가 진행된 특수한 경우에는 전액 환불 처리됩니다.",
      ],
    },
    {
      title: "3. 환불",
      paragraphs: ["다음의 경우 환불이 가능합니다."],
      bullets: [
        "배송 전 취소 요청이 접수된 경우(상품·공급사 정책에 따름)",
        "상품 하자, 오배송, 품절 등 회사 또는 공급사 귀책 사유",
        "전자상거래법 등 관련 법령상 청약 철회가 가능한 경우",
      ],
    },
    {
      title: "4. 교환",
      paragraphs: [
        "단순 변심에 의한 교환은 상품별 정책 및 공동구매 특성(일괄 발주 등)에 따라 제한될 수 있습니다.",
        "상품 불량 또는 오배송의 경우, 동일 상품 교환 또는 환불 중 선택할 수 있습니다.",
      ],
    },
    {
      title: "5. 환불 절차 및 기간",
      paragraphs: [
        "환불 요청은 고객센터(/support) 또는 마이페이지 주문 내역에서 접수할 수 있습니다.",
        "환불 승인 후 결제 수단에 따라 영업일 기준 3~7일 이내 환불이 완료될 수 있습니다.",
        "공동구매 마감 후 확정된 최종 금액 기준으로 환불 금액이 산정됩니다.",
      ],
    },
    {
      title: "6. 배송비",
      paragraphs: [
        "단순 변심에 의한 반품·교환 시 왕복 배송비는 이용자 부담일 수 있습니다.",
        "회사 또는 공급사 귀책 사유인 경우 배송비는 회사 또는 공급사가 부담합니다.",
      ],
    },
  ],
};

export const GROUPBUY_POLICY: PolicyDocument = {
  slug: "commerce-policy",
  title: "공동구매 운영 정책",
  subtitle: "celloh 공동구매 가격 확정 및 운영 방식",
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 공동구매 진행 방식",
      paragraphs: [
        "celloh 공동구매는 일정 기간 동안 다수의 이용자가 동일 상품에 참여하고, 마감 시점의 누적 참여 수량에 따라 최종 단가가 결정되는 방식입니다.",
        "참여 시점에는 현재 누적 참여 수량 기준의 예상 단가가 안내됩니다.",
      ],
    },
    {
      title: "2. 가격 확정 방식",
      paragraphs: [
        "최종 확정 금액은 공동구매 마감 시점의 누적 참여 수량에 해당하는 가격 구간(티어) 단가 × 주문 수량으로 계산됩니다.",
        "마감 전 참여가 증가하여 더 낮은 티어가 달성되면, 최종 확정 단가는 더 낮아질 수 있습니다.",
        "마감 후에는 확정된 단가로 결제가 진행되며, 참여 시점 예상가와 최종 확정가가 다를 수 있음을 이용자가 확인·동의합니다.",
      ],
    },
    {
      title: "3. 결제 시점",
      paragraphs: [
        "참여(예약) 단계에서는 결제가 즉시 이루어지지 않을 수 있습니다.",
        "공동구매 마감 및 가격 확정 후, 등록된 결제수단으로 최종 확정 금액이 청구됩니다.",
        "결제 실패 시 별도 안내가 제공되며, 기한 내 결제가 완료되지 않으면 참여가 취소될 수 있습니다.",
      ],
    },
    {
      title: "4. 배송",
      paragraphs: [
        "배송은 공동구매 마감, 가격 확정, 결제 완료 후 공급사 일정에 따라 순차 발송됩니다.",
        "상품별 예상 배송일은 상품 상세 페이지에 안내됩니다.",
      ],
    },
    {
      title: "5. 참여 제한",
      paragraphs: [
        "동일 공동구매에 중복 참여가 제한될 수 있습니다.",
        "부정 참여, 허위 정보 등록, 시스템 악용이 확인될 경우 참여가 취소될 수 있습니다.",
      ],
    },
    {
      title: "6. 고객 안내",
      paragraphs: [
        "가격 티어 변경, 마감 임박, 결제 예정 등 주요 안내는 앱 알림 또는 카카오 알림(동의 시)으로 제공될 수 있습니다.",
        "문의 사항은 고객센터(/support)를 이용해 주세요.",
      ],
    },
  ],
};

export const FINANCE_POLICY: PolicyDocument = {
  slug: "finance-terms",
  title: "전자금융거래 이용약관",
  subtitle: "celloh 결제·정산·환불 관련 전자금융거래 약관 (초안)",
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "제1조 (목적)",
      paragraphs: [
        "본 약관은 celloh 서비스에서 제공하는 전자지급결제대행, 결제대금 예치, 환불 등 전자금융거래와 관련하여 회사와 이용자 간 권리·의무를 규정합니다.",
      ],
    },
    {
      title: "제2조 (결제 수단)",
      paragraphs: [
        "이용자는 회사가 제공하는 Toss Payments 등 PG를 통해 신용카드, 계좌이체, 가상계좌, 간편결제 등으로 결제할 수 있습니다.",
        "무통장입금 등 별도 안내가 있는 결제수단은 회사가 정한 기한 내 입금해야 합니다.",
      ],
    },
    {
      title: "제3조 (환불)",
      paragraphs: [
        "환불은 관련 법령, 이용약관, 환불정책에 따라 처리됩니다.",
        "공동구매 마감 전·후, 제작·주문제작 상품 등은 별도 정책이 적용될 수 있습니다.",
      ],
    },
  ],
};

export const MARKETING_POLICY: PolicyDocument = {
  slug: "marketing-terms",
  title: "마케팅 정보 수신 동의",
  subtitle: "celloh 이벤트·혜택·공동구매 안내 수신에 관한 사항",
  legalNotice: LEGAL_NOTICE,
  sections: [
    {
      title: "1. 수집·이용 목적",
      paragraphs: [
        "회사는 이용자가 동의한 경우, 신규 공동구매·할인·이벤트·서비스 안내 등 마케팅 정보를 제공할 수 있습니다.",
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
      title: "3. 동의 철회",
      paragraphs: [
        "마케팅 수신 동의는 마이페이지 설정에서 언제든지 철회할 수 있습니다.",
        "철회 이후에는 광고성 정보가 발송되지 않으며, 필수 서비스 안내(주문·배송·환불 등)는 계속 발송될 수 있습니다.",
      ],
    },
    {
      title: "4. 보유 기간",
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
