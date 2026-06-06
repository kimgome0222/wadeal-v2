/**
 * Probe priority Supabase migrations without printing env values.
 * Usage: node scripts/probe-migrations.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const MIGRATIONS = [
  {
    id: "030",
    file: "030_business_settings.sql",
    probes: [{ type: "table", name: "business_settings" }],
  },
  {
    id: "038",
    file: "038_notifications_unified.sql",
    probes: [
      { type: "table", name: "notifications" },
      { type: "column", table: "notifications", name: "target_role" },
      { type: "column", table: "notifications", name: "seller_id" },
    ],
  },
  {
    id: "039",
    file: "039_seller_notices.sql",
    probes: [{ type: "table", name: "seller_notices" }],
  },
  {
    id: "040",
    file: "040_seller_application_review.sql",
    probes: [
      { type: "table", name: "seller_documents" },
      { type: "table", name: "seller_review_checks" },
    ],
  },
  {
    id: "041",
    file: "041_category_product_review.sql",
    probes: [
      { type: "table", name: "category_review_rules" },
      { type: "table", name: "product_review_checklists" },
    ],
  },
  {
    id: "042",
    file: "042_seller_extended_tables.sql",
    probes: [
      { type: "table", name: "seller_users" },
      { type: "table", name: "seller_product_requests" },
      { type: "table", name: "seller_payout_accounts" },
      { type: "table", name: "seller_settlements" },
    ],
  },
  {
    id: "043",
    file: "043_order_timelines.sql",
    probes: [{ type: "table", name: "order_timelines" }],
  },
  {
    id: "044",
    file: "044_storage_seller_settlement_buckets.sql",
    probes: [
      { type: "bucket", name: "seller-documents" },
      { type: "bucket", name: "settlement-files" },
    ],
  },
  {
    id: "045",
    file: "045_refunds_cancel_flow.sql",
    probes: [
      { type: "table", name: "refunds" },
      { type: "column", table: "orders", name: "refund_status" },
    ],
  },
];

function isMissingError(message) {
  if (!message) return false;
  return (
    message.includes("Could not find") ||
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("PGRST204")
  );
}

async function probeTable(supabase, table) {
  const { error } = await supabase.from(table).select("id", { head: true, count: "exact" });
  if (error && isMissingError(error.message)) {
    return false;
  }
  return true;
}

async function probeColumn(supabase, table, column) {
  const { error } = await supabase.from(table).select(column).limit(0);
  if (error && isMissingError(error.message)) {
    return false;
  }
  return true;
}

async function probeBucket(supabase, bucketId) {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) return false;
  return (data ?? []).some((b) => b.id === bucketId);
}

async function probeMigration(supabase, migration) {
  const filePath = join(process.cwd(), "supabase", "migrations", migration.file);
  const fileExists = existsSync(filePath);
  const results = [];

  for (const probe of migration.probes) {
    let ok = false;
    if (probe.type === "table") {
      ok = await probeTable(supabase, probe.name);
    } else if (probe.type === "column") {
      ok = await probeColumn(supabase, probe.table, probe.name);
    } else if (probe.type === "bucket") {
      ok = await probeBucket(supabase, probe.name);
    }
    results.push({ probe, ok });
  }

  const okCount = results.filter((r) => r.ok).length;
  let status = "unknown";
  if (okCount === migration.probes.length) status = "applied";
  else if (okCount === 0) status = "missing";
  else status = "partial";

  return { id: migration.id, file: migration.file, fileExists, status, results };
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    console.log(JSON.stringify({ error: "supabase_not_configured", migrations: MIGRATIONS.map((m) => ({ id: m.id, file: m.file, status: "unknown" })) }, null, 2));
    process.exit(0);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const probeMode = process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon";
  const items = [];

  for (const migration of MIGRATIONS) {
    items.push(await probeMigration(supabase, migration));
  }

  console.log(JSON.stringify({ probeMode, checkedAt: new Date().toISOString(), items }, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
