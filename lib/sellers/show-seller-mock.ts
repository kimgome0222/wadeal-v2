import { shouldUseMockData } from "@/lib/env/runtime";

/** 판매자센터 mock UI 표시 여부 (dev / mock data 환경) */
export function showSellerCenterMock(): boolean {
  return shouldUseMockData();
}
