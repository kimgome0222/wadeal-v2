import type { CellohPayCard, CellohPayOrderResult } from "@/lib/celloh-pay/types";

const CARD_STORAGE_KEY = "celloh-pay-mock-card";
const ORDER_RESULT_KEY = "celloh-pay-order-result";
export const CELLOH_PAY_CHANGED_EVENT = "celloh-pay-changed";

function dispatchChange() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(CELLOH_PAY_CHANGED_EVENT));
}

function readStoredCard(): CellohPayCard | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CARD_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CellohPayCard;
    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      typeof parsed.cardAlias !== "string" ||
      typeof parsed.maskedNumber !== "string"
    ) {
      return null;
    }
    return {
      id: parsed.id,
      cardAlias: parsed.cardAlias,
      maskedNumber: parsed.maskedNumber,
      isDefault: parsed.isDefault !== false,
      provider: "mock",
    };
  } catch {
    return null;
  }
}

export function subscribeCellohPay(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(CELLOH_PAY_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CELLOH_PAY_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getCellohPayCardSnapshot(): CellohPayCard | null {
  return readStoredCard();
}

export function hasCellohPayCard(): boolean {
  return readStoredCard() != null;
}

/** mock 카드 등록 — PG 연동 전 UI 테스트용 */
export function registerMockCellohPayCard(
  card: Pick<CellohPayCard, "cardAlias" | "maskedNumber"> = {
    cardAlias: "신한카드",
    maskedNumber: "**** 1234",
  },
): CellohPayCard {
  if (typeof window === "undefined") {
    throw new Error("registerMockCellohPayCard is client-only");
  }

  const next: CellohPayCard = {
    id: `mock-${Date.now()}`,
    cardAlias: card.cardAlias,
    maskedNumber: card.maskedNumber,
    isDefault: true,
    provider: "mock",
  };

  window.localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(next));
  dispatchChange();
  return next;
}

export function clearMockCellohPayCard() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(CARD_STORAGE_KEY);
  dispatchChange();
}

export function saveCellohPayOrderResult(result: CellohPayOrderResult) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(ORDER_RESULT_KEY, JSON.stringify(result));
}

export function readCellohPayOrderResult(): CellohPayOrderResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(ORDER_RESULT_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CellohPayOrderResult;
  } catch {
    return null;
  }
}

export function clearCellohPayOrderResult() {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.removeItem(ORDER_RESULT_KEY);
}

export function formatCellohPayLabel(card: CellohPayCard): string {
  return `셀로페이 ${card.cardAlias} ${card.maskedNumber}`;
}
