"use client";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  function decrement() {
    onChange(Math.max(min, value - 1));
  }

  function increment() {
    onChange(Math.min(max, value + 1));
  }

  return (
    <div className="inline-flex h-11 items-center gap-1 rounded-2xl border border-[#E8ECEA] bg-white px-1">
      <button
        aria-label="수량 줄이기"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-lg font-medium text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled || value <= min}
        onClick={decrement}
        type="button"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-[15px] font-semibold tabular-nums text-[#111111]">
        {value}
      </span>
      <button
        aria-label="수량 늘리기"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-lg font-medium text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled || value >= max}
        onClick={increment}
        type="button"
      >
        +
      </button>
    </div>
  );
}
