import { shouldUseMockData } from "@/lib/env/runtime";

/** 고객센터 mock UI 표시 여부 (dev / mock data 환경) */
export function showCustomerSupportMock(): boolean {
  return shouldUseMockData();
}
