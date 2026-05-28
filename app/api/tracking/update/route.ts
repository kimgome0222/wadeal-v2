import { NextResponse } from "next/server";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, courier_code, courier_company, tracking_number")
    .eq("shipping_status", "shipped")
    .not("tracking_number", "is", null);

  if (error) {
    console.error("[tracking/update] query:", error.message);
    return NextResponse.json({ success: false, error: "query_failed" }, { status: 500 });
  }

  const checkedAt = new Date().toISOString();

  for (const order of orders ?? []) {
    /*
      TODO: Integrate external tracking APIs here:
      - SmartTracker
      - SweetTracker
      - 17TRACK
    */

    await supabase
      .from("orders")
      .update({ tracking_last_checked_at: checkedAt })
      .eq("id", order.id as string);
  }

  return NextResponse.json({
    success: true,
    checked: orders?.length ?? 0,
  });
}
