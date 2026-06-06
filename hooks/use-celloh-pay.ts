"use client";

import { useSyncExternalStore } from "react";

import {
  getCellohPayCardSnapshot,
  subscribeCellohPay,
} from "@/lib/celloh-pay/celloh-pay-store";

export function useCellohPayCard() {
  return useSyncExternalStore(subscribeCellohPay, getCellohPayCardSnapshot, () => null);
}
