import { NextResponse } from "next/server";

import { issueBillingKeyAction } from "@/app/actions/saved-payment-methods";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    authKey?: string;
    cardCompany?: string;
    cardLast4?: string;
  };

  if (!body.authKey?.trim()) {
    return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
  }

  const result = await issueBillingKeyAction({
    authKey: body.authKey,
    cardCompany: body.cardCompany,
    cardLast4: body.cardLast4,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
