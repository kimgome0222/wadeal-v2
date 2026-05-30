import Link from "next/link";

type MypageProfileCardProps = {
  displayName: string;
  memberGrade: string;
  celloCash: number;
  couponCount: number;
};

export function MypageProfileCard({
  displayName,
  memberGrade,
  celloCash,
  couponCount,
}: MypageProfileCardProps) {
  return (
    <section className="px-6">
      <div className="relative flex h-[140px] flex-col justify-between rounded-[20px] bg-[#F5F7F6] p-5">
        <Link
          aria-label="설정"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#666666] active:bg-white/60"
          href="/mypage/settings"
        >
          <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.36.41.89.65 1.51.65H21a2 2 0 1 1 0 4h-.09c-.62 0-1.15.24-1.51.65Z" strokeLinecap="round" />
          </svg>
        </Link>

        <div>
          <p className="text-[14px] text-[#666666]">안녕하세요</p>
          <h1 className="mt-0.5 text-[22px] font-bold text-[#111111]">{displayName}</h1>
          <p className="mt-1 text-[13px] text-[#666666]">{memberGrade || "일반회원"}</p>
        </div>

        <div className="flex gap-4 text-[13px]">
          <Link className="font-medium text-[#111111]" href="/mypage/benefits">
            셀로캐시 <span className="font-bold">{celloCash.toLocaleString("ko-KR")}원</span>
          </Link>
          <Link className="font-medium text-[#111111]" href="/mypage/benefits">
            쿠폰 <span className="font-bold">{couponCount}장</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
