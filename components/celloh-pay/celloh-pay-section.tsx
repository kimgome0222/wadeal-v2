"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

import { useCellohPayCard } from "@/hooks/use-celloh-pay";
import {
  formatCellohPayLabel,
  registerMockCellohPayCard,
} from "@/lib/celloh-pay/celloh-pay-store";

export type CheckoutPaymentMode = "celloh_pay" | "standard";

type CellohPaySectionProps = {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

/** checkout 셀로페이 간편결제 영역 */
export function CellohPaySection({ selected, onSelect, disabled = false }: CellohPaySectionProps) {
  const card = useCellohPayCard();
  const [isRegistering, setIsRegistering] = useState(false);

  function handleRegister(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsRegistering(true);
    registerMockCellohPayCard();
    window.setTimeout(() => setIsRegistering(false), 300);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-[18px] font-bold text-[#111111]">셀로페이 간편결제</h2>
      <button
        aria-pressed={selected}
        className={`flex w-full cursor-pointer flex-col rounded-[20px] border p-4 text-left transition-colors duration-[100ms] active:opacity-90 ${
          selected ?
            "border-[#2E5E4E] bg-[#F5F7F6]"
          : "border-[#E8ECEA] bg-white"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        disabled={disabled}
        onClick={onSelect}
        type="button"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
              selected ?
                "border-[#2E5E4E] bg-[#2E5E4E] text-[10px] font-bold text-white"
              : "border-[#E8ECEA] bg-white"
            }`}
          >
            {selected ? "✓" : null}
          </span>
          <div className="min-w-0 flex-1">
            {card ?
              <>
                <p className="text-[15px] font-bold text-[#111111]">셀로페이</p>
                <p className="mt-1 text-[14px] font-semibold text-[#111111]">
                  {card.cardAlias} {card.maskedNumber}
                </p>
                <p className="mt-1 text-[12px] text-[#666666]">기본 결제수단 · 비밀번호만으로 결제</p>
              </>
            : <>
                <p className="text-[15px] font-bold text-[#111111]">셀로페이 등록</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#666666]">
                  카드를 등록하면 다음부터 비밀번호만으로 결제할 수 있어요.
                </p>
              </>}
          </div>
        </div>

        {card ?
          <span className="mt-3 inline-flex text-[13px] font-semibold text-[#2E5E4E]">
            {formatCellohPayLabel(card)}
          </span>
        : <button
            className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#2E5E4E] text-[14px] font-bold text-white active:opacity-90 disabled:opacity-60"
            disabled={disabled || isRegistering}
            onClick={handleRegister}
            type="button"
          >
            {isRegistering ? "등록 중..." : "카드 등록하기"}
          </button>
        }
      </button>
      <p className="text-[11px] leading-relaxed text-[#999999]">
        실제 카드 등록·결제는 PG(토스페이먼츠 브랜드페이/빌링키) 연동 후 처리됩니다. 카드번호는
        저장하지 않아요.
      </p>
    </section>
  );
}
