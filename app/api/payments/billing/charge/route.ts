import { NextResponse } from "next/server";

import { processAutoChargeForOrder } from "@/lib/payments/auto-charge";

function isAuthorizedInternalRequest(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${cronSecret}`;
}

export async function POST(request: Request) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { orderId?: string };
  if (!body.orderId?.trim()) {
    return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
  }

  const result = await processAutoChargeForOrder(body.orderId);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}
