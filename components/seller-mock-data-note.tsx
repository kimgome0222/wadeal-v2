type SellerMockDataNoteProps = {
  className?: string;
};

/** mock/부분 연동 필드가 포함된 판매자 신뢰 UI 안내 (DB 연동 전). */
export function SellerMockDataNote({ className = "" }: SellerMockDataNoteProps) {
  return (
    <p
      className={`rounded-lg bg-wadeal-surface px-3 py-2 text-[10px] font-semibold leading-relaxed text-wadeal-muted ${className}`}
    >
      일부 판매자 지표는 예시 데이터입니다. 실제 연동 시 평점·리뷰·누적 판매·재구매율·응답률·인증
      정보가 반영됩니다.
    </p>
  );
}
