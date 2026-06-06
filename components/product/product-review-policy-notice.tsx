import Link from "next/link";

export function ProductReviewPolicyNotice() {
  return (
    <div className="space-y-2 rounded-2xl border border-[#E8ECEA] bg-[#FAFBFA] px-4 py-3">
      <p className="text-[13px] font-semibold text-[#111111]">
        구매한 고객만 리뷰를 작성할 수 있어요
      </p>
      <ul className="space-y-1 text-[12px] leading-relaxed text-[#666666]">
        <li>· 구매 확정 또는 배송완료 후 작성 가능</li>
        <li>· 구매 후 15일 이내 작성 (기간 만료 시 불가)</li>
        <li>· 사진 리뷰 가능 (placeholder — 업로드 정책은 운영 시 확정)</li>
        <li>· 욕설·비방·개인정보·광고성 리뷰 제한</li>
      </ul>
      <Link
        className="inline-block text-[12px] font-semibold text-[#2E5E4E] underline underline-offset-2"
        href="/policies/review"
      >
        리뷰 정책 전체 보기
      </Link>
    </div>
  );
}
