import type { ProductQuestionItem } from "@/lib/data/product-questions";

type InquiryQuestionCardProps = {
  question: ProductQuestionItem;
};

function resolveStatus(question: ProductQuestionItem) {
  if (question.adminReply) {
    return { label: "답변완료", tone: "text-[#2E5E4E]" };
  }
  return { label: "답변대기", tone: "text-[#999999]" };
}

export function InquiryQuestionCard({ question }: InquiryQuestionCardProps) {
  const status = resolveStatus(question);
  const title =
    question.content.split("\n")[0]?.trim().slice(0, 40) || "상품 문의";

  return (
    <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-[#111111]">{title}</h3>
        <span className={`shrink-0 text-[12px] font-semibold ${status.tone}`}>
          {status.label}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#666666]">
        {question.content}
      </p>
      <p className="mt-3 text-[12px] text-[#999999]">{question.createdAtLabel}</p>

      {question.adminReply ?
        <div className="mt-3 rounded-2xl bg-[#F5F7F6] p-3">
          <p className="text-[12px] font-semibold text-[#666666]">판매자 답변</p>
          <p className="mt-1 text-[14px] leading-relaxed text-[#111111]">
            {question.adminReply}
          </p>
        </div>
      : null}
    </article>
  );
}
