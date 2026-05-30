import { MypageProfileCardGuest } from "@/components/mypage/mypage-profile-card-guest";
import { MypageSocialLoginBlock } from "@/components/mypage/mypage-social-login-block";

type MypageCelloGuestProps = {
  loginHref?: string;
};

/** 비로그인 마이셀로 — 로그인 유도 + 소셜 로그인 (최근 활동/주문/본 상품 미노출) */
export function MypageCelloGuest({
  loginHref = "/login?next=%2Fmypage",
}: MypageCelloGuestProps) {
  return (
    <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-2">
      <MypageProfileCardGuest loginHref={loginHref} />
      <MypageSocialLoginBlock loginHref={loginHref} redirect="/mypage" />
    </div>
  );
}
