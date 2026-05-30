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
  const gradeLabel = memberGrade.toUpperCase();

  return (
    <section className="px-6">
      <div className="relative rounded-[24px] bg-[#F5F7F6] p-5">
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

        <h1 className="pr-10 text-[22px] font-bold text-[#111111]">{displayName}</h1>
        <p className="mt-1 text-[13px] font-medium text-[#666666]">등급: {gradeLabel}</p>

        <div className="mt-4 flex gap-5 text-[14px]">
          <Link className="font-medium text-[#111111]" href="/mypage/points">
            포인트{" "}
            <span className="font-bold text-[#2E5E4E]">
              {celloCash.toLocaleString("ko-KR")}P
            </span>
          </Link>
          <Link className="font-medium text-[#111111]" href="/mypage/benefits">
            쿠폰{" "}
            <span className="font-bold text-[#2E5E4E]">{couponCount}장</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
