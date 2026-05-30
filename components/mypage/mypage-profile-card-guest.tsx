import Link from "next/link";

import { SettingsIcon } from "@/components/icons";

type MypageProfileCardGuestProps = {
  loginHref: string;
};

export function MypageProfileCardGuest({ loginHref }: MypageProfileCardGuestProps) {
  return (
    <section className="px-6">
      <div className="relative rounded-[24px] bg-[#F5F7F6] p-5">
        <Link
          aria-label="로그인 후 설정"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#666666] active:bg-white/60"
          href={loginHref}
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>

        <h1 className="pr-10 text-[22px] font-bold text-[#111111]">로그인이 필요해요</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
          로그인 후 주문, 찜, 혜택을 한 번에 확인해보세요.
        </p>

        <div className="mt-4 flex gap-5 text-[14px]">
          <Link className="font-medium text-[#111111]" href={loginHref}>
            포인트 <span className="font-bold text-[#2E5E4E]">—</span>
          </Link>
          <Link className="font-medium text-[#111111]" href={loginHref}>
            쿠폰 <span className="font-bold text-[#2E5E4E]">—</span>
          </Link>
        </div>

        <Link
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-[#2E5E4E] text-[14px] font-semibold text-white active:opacity-90"
          href={loginHref}
        >
          로그인
        </Link>
      </div>
    </section>
  );
}
