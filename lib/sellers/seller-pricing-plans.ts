/** 판매자 요금제 mock — 구독 결제 미구현. docs/CELLOH_SELLER_PRICING_PLAN.md */

export type SellerPricingPlanId = "starter" | "growth" | "premium";

export type SellerPricingPlan = {
  id: SellerPricingPlanId;
  name: string;
  tagline: string;
  priceLabel: string;
  features: string[];
  status: "active" | "coming_soon";
};

export const SELLER_PRICING_PLANS: SellerPricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "입점·기본 판매",
    priceLabel: "무료 (초안)",
    features: [
      "기본 상품 등록·검수",
      "기본 판매자 프로필",
      "기본 정산 주기",
    ],
    status: "active",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "기획전·노출 확대",
    priceLabel: "운영 협의 (초안)",
    features: [
      "기획전 신청",
      "프로필·추천 노출 후보",
      "쿠폰 캠페인 공동 참여",
    ],
    status: "coming_soon",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "브랜드·단독 파트너",
    priceLabel: "별도 계약 (초안)",
    features: [
      "메인 배너·Only Celloh 후보",
      "라이브커머스 슬롯 후보",
      "전용 운영 리포트 (준비 중)",
    ],
    status: "coming_soon",
  },
];
