"use client";

import { useEffect, useRef, useState } from "react";

type CellohPayPasswordSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
};

const PASSWORD_LENGTH = 6;

/** 셀로페이 6자리 결제 비밀번호 bottom sheet — mock, 평문 저장 금지 */
export function CellohPayPasswordSheet({
  open,
  onClose,
  onConfirm,
  isProcessing = false,
}: CellohPayPasswordSheetProps) {
  const [digits, setDigits] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setDigits("");
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const isComplete = digits.length === PASSWORD_LENGTH;

  function handleChange(value: string) {
    const next = value.replace(/\D/g, "").slice(0, PASSWORD_LENGTH);
    setDigits(next);
  }

  function handleConfirm() {
    if (!isComplete || isProcessing) {
      return;
    }
    onConfirm();
  }

  return (
    <>
      <button
        aria-label="닫기"
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby="celloh-pay-password-title"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-[101] mx-auto max-h-[45vh] max-w-[430px] overflow-y-auto rounded-t-[20px] bg-white px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        role="dialog"
      >
        <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E8ECEA]" />

        <h2 className="text-[18px] font-bold text-[#111111]" id="celloh-pay-password-title">
          결제 비밀번호 입력
        </h2>
        <p className="mt-1 text-[13px] text-[#666666]">셀로페이로 빠르게 결제합니다.</p>

        <div className="mt-6 flex justify-center gap-2.5">
          {Array.from({ length: PASSWORD_LENGTH }).map((_, index) => (
            <span
              aria-hidden
              className={`h-3 w-3 rounded-full transition-colors duration-[80ms] ${
                index < digits.length ? "bg-[#2E5E4E]" : "bg-[#E8ECEA]"
              }`}
              key={index}
            />
          ))}
        </div>

        <input
          aria-label="6자리 결제 비밀번호"
          autoComplete="one-time-code"
          className="sr-only"
          inputMode="numeric"
          maxLength={PASSWORD_LENGTH}
          onChange={(event) => handleChange(event.target.value)}
          ref={inputRef}
          type="password"
          value={digits}
        />

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((key) => {
            if (key === null) {
              return <span aria-hidden className="h-12" key="empty" />;
            }

            if (key === "del") {
              return (
                <button
                  className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#F5F7F6] text-[14px] font-semibold text-[#666666] active:bg-[#E8ECEA]"
                  disabled={isProcessing}
                  key="del"
                  onClick={() => setDigits((prev) => prev.slice(0, -1))}
                  type="button"
                >
                  삭제
                </button>
              );
            }

            return (
              <button
                className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#F5F7F6] text-[18px] font-bold text-[#111111] active:bg-[#E8ECEA]"
                disabled={isProcessing || digits.length >= PASSWORD_LENGTH}
                key={key}
                onClick={() => handleChange(digits + String(key))}
                type="button"
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-[#E8ECEA] text-[15px] font-semibold text-[#666666] active:bg-[#FAFBFA]"
            disabled={isProcessing}
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          <button
            className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl text-[15px] font-bold text-white transition-colors duration-[100ms] ${
              isComplete && !isProcessing ?
                "bg-[#2E5E4E] active:opacity-90"
              : "cursor-not-allowed bg-[#E8ECEA] text-[#999999]"
            }`}
            disabled={!isComplete || isProcessing}
            onClick={handleConfirm}
            type="button"
          >
            {isProcessing ? "결제 중..." : "확인"}
          </button>
        </div>
      </div>
    </>
  );
}
