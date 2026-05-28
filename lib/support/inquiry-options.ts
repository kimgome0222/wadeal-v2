import type { SupportTicketType } from "@/lib/support/ticket-rules";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";

export const INQUIRY_RECENT_ORDER_DAYS = 15;

export type InquiryChannel = "app" | "kakao" | "email";

export type InquirySubcategory = {
  id: string;
  label: string;
  description?: string;
  ticketType: SupportTicketType;
  requiresOrder?: boolean;
};

export type InquiryCategoryGroup = {
  id: string;
  label: string;
  subcategories: InquirySubcategory[];
};

/** 쿠팡·오늘의집형 문의 유형 그룹 */
export const INQUIRY_CATEGORY_GROUPS: InquiryCategoryGroup[] = [
  {
    id: "order-product",
    label: "주문·상품",
    subcategories: [
      {
        id: "product-info",
        label: "상품 정보/옵션 문의",
        ticketType: "product",
        requiresOrder: true,
      },
      {
        id: "order-status",
        label: "주문 내역/상태 확인",
        ticketType: "order",
        requiresOrder: true,
      },
      {
        id: "payment-issue",
        label: "결제/영수증/카드 문의",
        ticketType: "payment",
        requiresOrder: true,
      },
      {
        id: "order-cancel",
        label: "주문 취소 요청",
        ticketType: "cancel",
        requiresOrder: true,
      },
    ],
  },
  {
    id: "delivery",
    label: "배송",
    subcategories: [
      {
        id: "shipping-delay",
        label: "배송 지연/출고 문의",
        ticketType: "shipping",
        requiresOrder: true,
      },
      {
        id: "shipping-address",
        label: "배송지 변경/오배송",
        ticketType: "shipping",
        requiresOrder: true,
      },
    ],
  },
  {
    id: "refund-exchange",
    label: "환불·교환·반품",
    subcategories: [
      {
        id: "refund-request",
        label: "환불 요청",
        ticketType: "refund",
        requiresOrder: true,
      },
      {
        id: "exchange-request",
        label: "교환/반품 요청",
        ticketType: "exchange",
        requiresOrder: true,
      },
    ],
  },
  {
    id: "account-service",
    label: "회원·서비스",
    subcategories: [
      {
        id: "account-login",
        label: "로그인/회원정보",
        ticketType: "account",
      },
      {
        id: "groupbuy",
        label: "공동구매/참여 문의",
        ticketType: "other",
      },
      {
        id: "etc",
        label: "기타 문의",
        ticketType: "other",
      },
    ],
  },
];

export const ORDER_LINKED_INQUIRY_TYPES: SupportTicketType[] = [
  "product",
  "order",
  "payment",
  "shipping",
  "refund",
  "exchange",
  "cancel",
];

export function isOrderLinkedInquiryType(type: SupportTicketType): boolean {
  return ORDER_LINKED_INQUIRY_TYPES.includes(type);
}

export function filterOrdersForInquiry(
  orders: UserOrderRecord[],
  days = INQUIRY_RECENT_ORDER_DAYS,
): UserOrderRecord[] {
  const cutoffMs = Date.now() - days * 24 * 60 * 60 * 1000;

  return orders.filter((order) => {
    const created = new Date(order.createdAt).getTime();
    return Number.isFinite(created) && created >= cutoffMs;
  });
}

export function findInquirySubcategory(
  subId: string | null | undefined,
): InquirySubcategory | undefined {
  if (!subId) {
    return undefined;
  }

  for (const group of INQUIRY_CATEGORY_GROUPS) {
    const found = group.subcategories.find((item) => item.id === subId);
    if (found) {
      return found;
    }
  }

  return undefined;
}

export function buildInquiryNewHref(input: {
  subId?: string;
  channel?: InquiryChannel;
  orderId?: string;
}): string {
  const params = new URLSearchParams();
  if (input.subId) {
    params.set("sub", input.subId);
  }
  if (input.channel && input.channel !== "app") {
    params.set("channel", input.channel);
  }
  if (input.orderId) {
    params.set("orderId", input.orderId);
  }

  const query = params.toString();
  return query ? `/support/new?${query}` : "/support/new";
}
