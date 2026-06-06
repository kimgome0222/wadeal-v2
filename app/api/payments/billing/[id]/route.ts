import { NextResponse } from "next/server";

import { deactivateSavedPaymentMethodAction } from "@/app/actions/saved-payment-methods";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
  }

  const result = await deactivateSavedPaymentMethodAction(id);
  if (!result.success) {
    return NextResponse.json(result, { status: result.error === "login_required" ? 401 : 400 });
  }

  return NextResponse.json(result);
}
