/** 결제 mock 안내 — checkout/결제 화면 공통 */
export function PaymentPolicyNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[#E8ECEA] bg-[#FAFBFA] px-4 py-3 text-[12px] leading-relaxed text-[#666666] ${className}`.trim()}
    >
      <p className="font-semibold text-[#111111]">결제 안내 (mock)</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        <li>celloh는 카드번호·CVC·결제비밀번호를 저장하지 않아요.</li>
        <li>결제 승인은 PG사를 통해 처리됩니다. (실제 API 호출 없음)</li>
        <li>셀로페이·간편결제는 mock UI이며, 오픈 시 Toss Payments 등 PG 검토가 필요해요.</li>
      </ul>
      <a className="mt-2 inline-block font-semibold text-[#2E5E4E]" href="/policies/payment">
        결제 정책 보기 →
      </a>
    </div>
  );
}
