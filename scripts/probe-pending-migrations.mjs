#!/usr/bin/env node
/**
 * Probe Supabase for pending migrations 047–049 (read-only).
 * Apply SQL manually: Supabase Dashboard → SQL → paste supabase/migrations/APPLY_047_048_049.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    return {};
  }

  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
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
    env[key] = value;
  }
  return env;
}

async function probeColumn(url, serviceKey, table, column) {
  const response = await fetch(
    `${url}/rest/v1/${table}?select=${encodeURIComponent(column)}&limit=0`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );

  if (response.ok) {
    return { ok: true, message: "exists" };
  }

  const body = await response.text();
  if (body.includes("does not exist") || body.includes("PGRST204")) {
    return { ok: false, message: "missing column" };
  }

  return { ok: true, message: `unknown (${response.status})` };
}

async function probeTable(url, serviceKey, table) {
  const response = await fetch(`${url}/rest/v1/${table}?select=id&limit=0`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (response.ok) {
    return { ok: true };
  }

  const body = await response.text();
  if (response.status === 404 || body.includes("does not exist")) {
    return { ok: false };
  }

  return { ok: true };
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log("SKIP: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not in .env.local");
    process.exit(0);
  }

  const checks = [
    { id: "047", label: "profile_usernames", probe: () => probeTable(url, key, "profile_usernames") },
    { id: "048", label: "featured_search_terms", probe: () => probeTable(url, key, "featured_search_terms") },
    {
      id: "049",
      label: "settlement_records.payout_bank_name",
      probe: () => probeColumn(url, key, "settlement_records", "payout_bank_name"),
    },
  ];

  console.log("Wadeal migration probe (read-only)\n");

  let missing = 0;
  for (const check of checks) {
    const result = await check.probe();
    const status = result.ok ? "✅ applied" : "❌ missing";
    if (!result.ok) {
      missing += 1;
    }
    console.log(`${check.id} ${check.label}: ${status}`);
  }

  console.log("");
  if (missing > 0) {
    console.log(`→ Apply: supabase/migrations/APPLY_047_048_049.sql in Supabase SQL Editor`);
  } else {
    console.log("All probed migrations appear applied.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
