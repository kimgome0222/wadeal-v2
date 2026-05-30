export type ReferralInviteStatus = "invited" | "signed_up" | "first_purchase" | "reward_pending";

export type MockReferralEntry = {
  id: string;
  friendLabel: string;
  status: ReferralInviteStatus;
  rewardLabel: string;
  updatedAt: string;
};

export const REFERRAL_BENEFIT_COPY = {
  friendSignup: "친구 3,000원 쿠폰",
  inviterFirstPurchase: "초대한 사람 3,000원 쿠폰",
  monthlyLimit: "월 최대 지급 한도: TODO — 운영팀 확정 필요",
} as const;

/** Mock 초대 현황 — 실제 지급/DB 연동 전 UI 검토용 */
export const MOCK_REFERRAL_ENTRIES: MockReferralEntry[] = [
  {
    id: "ref-1",
    friendLabel: "친구 A",
    status: "first_purchase",
    rewardLabel: "3,000원 쿠폰 지급 예정",
    updatedAt: "2026-05-20",
  },
  {
    id: "ref-2",
    friendLabel: "친구 B",
    status: "signed_up",
    rewardLabel: "첫 구매 대기",
    updatedAt: "2026-05-24",
  },
  {
    id: "ref-3",
    friendLabel: "친구 C",
    status: "invited",
    rewardLabel: "가입 대기",
    updatedAt: "2026-05-28",
  },
];

export function getReferralStatusLabel(status: ReferralInviteStatus): string {
  switch (status) {
    case "invited":
      return "초대 완료";
    case "signed_up":
      return "가입 완료";
    case "first_purchase":
      return "첫 구매 완료";
    case "reward_pending":
      return "지급 예정";
    default:
      return status;
  }
}
